---
layout: bt_wiki
title: GCP GKE
description: Deployment to Google (GKE) of Highly Available Cloudify manager worker using the helm chart.
category: Installation
draft: false
weight: 40
---
## Deployment to GCP of Highly Available Cloudify Manager Worker (Premium Version)

### Provision GKE Cluster

[Installing Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

```bash
gcloud container clusters create \
  --num-nodes 2 \
  --region europe-west1-b \
  gke-cluster

gcloud container clusters get-credentials gke-cluster
```

## Provision of Filestore (NFS Supported) in GCP:

https://cloud.google.com/community/tutorials/gke-filestore-dynamic-provisioning

### Enable the Required Google APIs

```bash
gcloud services enable file.googleapis.com
```

### Create a Filestore Volume

#### Create a Filestore instance with 1TB of storage capacity

```bash
## --project must be your PROJECT_ID
gcloud beta filestore instances create nfs-storage \
    --project=gke-demo-320314 \
    --zone=europe-west1-b \
    --tier=STANDARD \
    --file-share=name="nfsshare",capacity=1TB \
    --network=name=default
```

#### Retrieve the IP address of the Filestore instance

```bash
FSADDR=$(gcloud beta filestore instances describe cfy-fs \
     --project=gke-demo-320314 \
     --zone=europe-west1-b \
     --format="value(networks.ipAddresses[0])")
```

### Deploy NFS Provisioner
You need dynamic 'nfs client provisoner' to dynamically deploy new PV from nfs storage every time PV needed

```bash
helm install nfs-cp stable/nfs-client-provisioner --set nfs.server=$FSADDR --set nfs.path=/nfsshare
```

Validate that new 'storageclass' nfs-client available:

```bash
kubectl get storageclass
```


#### Alternative is to create PV manually every time:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs
spec:
  capacity:
    storage: 1000Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: $FSADDR
    path: "/nfsshare"
  mountOptions:
    - vers=4
    - minorversion=1
    - sec=sys
```

### Deploy Helm Chart

#### Create Namespace
```bash
kubectl create ns cfy-demo
```

#### Create needed certificates and store as k8s secret
```bash
$ docker pull cloudifyplatform/community-cloudify-manager-aio:latest
$ docker run --name cfy_manager_local -d --restart unless-stopped --tmpfs /run --tmpfs /run/lock -p 8000:8000 cloudifyplatform/community-cloudify-manager-aio
$ docker exec -it created_ID bash

$ cfy_manager generate-test-cert -s 'cloudify-manager-worker.cfy-demo.svc.cluster.local,rabbitmq.cfy-demo.svc.cluster.local,postgres-postgresql.cfy-demo.svc.cluster.local'

## save certs in tls.crt|tls.key|ca.crt
$ kubectl create secret generic cfy-certs --from-file=./tls.crt --from-file=./tls.key --from-file=./ca.crt
```

#### Values.yaml

```yaml
domain: "cfy-demo.svc.cluster.local"

volume:
  storage_class: 'nfs-client'
  access_mode: 'ReadWriteMany'
  size: "15Gi"

service:
  host: cloudify-manager-worker
  type: LoadBalancer
  name: cloudify-manager-worker
  http:
    port: 80
  https:
    port: 443
  internal_rest:
    port: 53333
secret:
  name: cfy-certs

config:
  replicas: 2
  start_delay: 0
  install_plugins: false
  cli_local_profile_host_name: localhost
  security:
    ssl_enabled: false
    admin_password: admin
  tls_cert_path: /mnt/cloudify-data/ssl/tls.crt
  tls_key_path: /mnt/cloudify-data/ssl/tls.key
  ca_cert_path: /mnt/cloudify-data/ssl/ca.crt

ingress:
  enabled: false
  host: cfy-efs-app.eks.cloudify.co
  annotations:
    kubernetes.io/ingress.class: nginx
    # cert-manager.io/cluster-issuer: "letsencrypt-prod"
  tls:
    enabled: false
    secretName: cfy-secret-name
```

We used an external LoadBalancer, not Ingress Nginx/ CertManager to install a cluster in this example.

#### Deployment of Helm Chart

```bash
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-worker cloudify-helm/cloudify-manager-worker -f values.yaml
```

You can find this values.yaml in `/examples/gcp` folder. 


