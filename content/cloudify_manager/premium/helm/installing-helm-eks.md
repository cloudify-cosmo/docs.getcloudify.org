---
layout: bt_wiki
title: AWS EKS
description: Deployment to AWS (EKS) of Highly Available manager worker using the helm chart.
category: Installation
draft: false
weight: 30
---
## Deployment to AWS of Highly Available {{< param cfy_manager_name >}} Worker (Premium Version)

### Provision EKS Cluster

[Installing AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
[eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html)

```bash
$ eksctl create cluster \
  --region us-west-2 \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --name eks-cluster
```

## Provision of EFS (NFS Supported) in AWS:

https://docs.aws.amazon.com/efs/latest/ug/creating-using-create-fs.html


```bash
$  aws efs create-file-system \
-\-creation-token efs-storage \
-\-backup true \
-\-encrypted true \
-\-performance-mode generalPurpose \
-\-throughput-mode bursting \
-\-region us-west-2 \
-\-tags Key=Name,Value="Test File System" \
-\-profile adminuser
```

### Deploy EFS Provisoner

#### Deploy efs-provisioner.yaml

You need to know **efs.system.id** and region first, look at aws console/ EFS to get those.

Change first **efs.system.id** and region in `efs-provisioner.yaml`.

For example:

```yaml
# metadata:
#   name: efs-provisioner
# data:
#   file.system.id: fs-f71ec6c3
#   aws.region: us-west-2
```

```bash
kubectl apply -f efs/efs-provisoner.yaml
```

You can find `efs-provisoner.yaml` in the `examples/aws` folder

#### Create Storage Class

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: aws-efs
provisioner: example.com/aws-efs
```

```bash
kubectl apply -f efs/storage.yaml
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
  storage_class: 'aws-efs'
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

You can find this values.yaml in /examples/aws folder. 


