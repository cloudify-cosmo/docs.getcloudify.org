---
layout: bt_wiki
title: Azure AKS
description: Deployment to Azure (AKS) of Highly Available manager worker using the helm chart.
category: Installation
draft: false
weight: 20
---
## Deployment to Azure of Highly Available {{< param cfy_manager_name >}} Worker  ( Premium Version )

### Provision AKS Cluster

[How to Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

```bash
az group create --name aks-demo --location eastus

az aks create --resource-group aks-demo --name aks-cluster --node-count 3 --enable-addons monitoring --generate-ssh-keys

az aks get-credentials --resource-group aks-demo --name aks-cluster
```

## Provision of Azure File Storage (NFS Supported) in Azure:

https://docs.microsoft.com/en-us/azure/storage/files/storage-files-how-to-create-nfs-shares?tabs=azure-portal

### Register the NFS 4.1 Protocol

```bash
# Connect your Azure CLI to your Azure account, if you have not already done so.
az login
# Provide the subscription ID for the subscription where you would like to 
# register the feature
subscriptionId="<yourSubscriptionIDHere>"
az feature register \
    --name AllowNfsFileShares \
    --namespace Microsoft.Storage \
    --subscription $subscriptionId
az provider register \
    --namespace Microsoft.Storage
```

To verify that the registration is complete, use the following commands:

```bash
az feature show \
    --name AllowNfsFileShares \
    --namespace Microsoft.Storage \
    --subscription $subscriptionId
```

### Creating NFS Share

To create NFS share must be used **Premium Files Storage**

### Create a FileStorage Storage Account

```bash
resourceGroup="<resource-group>" ## aks-demo
storageAccount="<storage-account>" ## cfynfsstorage
location="eastus"

az storage account create \
    --resource-group $resourceGroup \
    --name $storageAccount \
    --location $location \
    --sku Premium_LRS \
    --kind FileStorage
```
You can create it using UI via Azure portal, look [here](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-how-to-create-nfs-shares?tabs=azure-portal) for explanation of how to do it

### Create an NFS Share

```bash
az storage share-rm create \
    --resource-group $resourceGroup \
    --storage-account $storageAccount \
    --name "nfsshare" \
    --enabled-protocol NFS \
    --root-squash RootSquash \
    --quota 1024
```

You can create it using UI via Azure portal, look [here](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-how-to-create-nfs-shares?tabs=azure-portal) for explanation of how to do it

After provision is over your NFS server url looks like: https://cfynfsstorage.file.core.windows.net/cfynfsstorage/nfsshare 

Great explanation of how to provision FileStorage
https://www.youtube.com/watch?v=MXXS4n-Tk4o&t=0s&ab_channel=WintellectNOW

### Deploy NFS Provisioner
You need dynamic 'nfs client provisoner' to dynamically deploy new PV from nfs storage every time PV needed.

```bash
helm install nfs-provisioner stable/nfs-client-provisioner --set nfs.server="cfynfsstorage.file.core.windows.net" --set nfs.path="/cfynfsstorage/nfsshare"
```

Validate that new 'storageclass' nfs-client available:

```bash
kubectl get storageclass
```

Problems I encountered:

* Check nfsshare you created attached to virtual network through azure portal

* Check 'Secure transfer required' is disabled in configuration


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
    server: cfynfsstorage.file.core.windows.net
    path: "/cfynfsstorage/nfsshare"
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

We used an external LoadBalancer, no Ingress Nginx/ CertManager to install the cluster in this example.

#### Deployment of Helm Chart

```bash
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-worker cloudify-helm/cloudify-manager-worker -f values.yaml
```

You can find this values.yaml in /examples/azure folder. 


