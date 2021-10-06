---
layout: bt_wiki
title: Deploying a Cloudify Manager Worker to Kubernetes
description: Deploy a Cloudify Manager Worker to Kubernetes with a helm chart.
category: Installation
draft: false
weight: 100
---
# Cloudify manager worker helm chart ( Cloudify Premium Version )

## Description
 
It's a helm chart for cloudify manager which is:

* Highly available, can be deployed with multiple replicas. ( available only when used NFS like Storage file system )
* Use persistent volume to survive restarts/failures.
* Use external DB (postgress), which may be deployed via public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami/postgresql
* Use external Message Brokes (rabbitMQ), which may be deployed via public helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami

This is how the setup looks after it's deployed to 'cfy-example' namespace (it's possible to have multiple replicas (pods) of cloudify manager):

![cfy-manager](/images/helm/cfy-example.png)


## How to create and deploy such a setup?

1. Generate certificate as a secret in k8s.

2. Deployment of DB (Postgres).

3. Deployment of Message Broker (rabbitMQ).

4. Deployment of Cloudify manager worker.

**You need to deploy DB and Message Broker before deploying Cloudify manager worker**


## Generate certificates and add as secret to k8s

**SSL certificate must be provided, to secure communications between cloudify manager and posrgress/rabbitmq**

* ca.crt (to sign other certificates)

* tls.key

* tls.crt

### Option 1: Create certificates using cloudify manager docker container

```bash
$ docker pull cloudifyplatform/community-cloudify-manager-aio:latest
$ docker run --name cfy_manager_local -d --restart unless-stopped --tmpfs /run --tmpfs /run/lock -p 8000:8000 cloudifyplatform/community-cloudify-manager-aio
$ docker exec -it created_ID bash

# NAMESPACE to which cloudify-manager deployed, must be changed accordingly
$ cfy_manager generate-test-cert -s 'cloudify-manager-worker.NAMESPACE.svc.cluster.local,rabbitmq.NAMESPACE.svc.cluster.local,postgres-postgresql.NAMESPACE.svc.cluster.local'
```

Create secret in k8s from certificates:

```bash
$ kubectl create secret generic cfy-certs --from-file=./tls.crt --from-file=./tls.key --from-file=./ca.crt
```


### Option 2: Use cert-manager component installed to kubernetes cluster

You need to deploy those manifests, which will generate cfy-certs secret eventually, you need to change NAMESPACE to your namespace before.
You can find this manifest in external folder - cert-issuer.yaml

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: selfsigned-issuer
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: cfy-ca
spec:
  secretName: cfy-ca-tls
  commonName: NAMESPACE.svc.cluster.local
  usages:
    - server auth
    - client auth
  isCA: true
  issuerRef:
    name: selfsigned-issuer
---
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: cfy-ca-issuer
spec:
  ca:
    secretName: cfy-ca-tls
---
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: cfy-cert
spec:
  secretName: cfy-certs
  isCA: false
  usages:
    - server auth
    - client auth
  dnsNames:
  - "postgres-postgresql.NAMESPACE.svc.cluster.local"
  - "rabbitmq.NAMESPACE.svc.cluster.local"
  - "cloudify-manager-worker.NAMESPACE.svc.cluster.local"
  - "postgres-postgresql"
  - "rabbitmq"
  - "cloudify-manager-worker"
  issuerRef:
    name: cfy-ca-issuer
```


## Install PostgreSQL(bitnami) to Kubernetes cluster with helm

You can find example of PostgreSQL values.yaml in external/postgres-values.yaml

Use certificate we created as k8s secret: 'cfy-certs'

```
volumePermissions.enabled=true
tls:
  enabled: true
  preferServerCiphers: true
  certificatesSecret: 'cfy-certs'
  certFilename: 'tls.crt'
  certKeyFilename: 'tls.key'
```

Install postgresql with postgres-values.yaml

```
helm install postgres bitnami/postgresql -f ./cloudify-manager-worker/external/postgres-values.yaml -n NAMESPACE
```

## Install RabbitMQ(bitnami) to Kubernetes cluster with helm


Use certificate we created as k8s secret: 'cfy-certs'

```
tls:
    enabled: true
    existingSecret: cfy-certs
    failIfNoPeerCert: false
    sslOptionsVerify: verify_peer
    caCertificate: |-    
    serverCertificate: |-
    serverKey: |-
```

Run management console on 15671 port with SSL (cloudify manager talks to management console via SSL):

add to rabbitmq-values.yaml

```
configuration: |-
  management.ssl.port       = 15671
  management.ssl.cacertfile = /opt/bitnami/rabbitmq/certs/ca_certificate.pem
  management.ssl.certfile   = /opt/bitnami/rabbitmq/certs/server_certificate.pem
  management.ssl.keyfile    = /opt/bitnami/rabbitmq/certs/server_key.pem

extraPorts:
  - name: manager-ssl
    port: 15671
    targetPort: 15671
```

Install rabbitmq with rabbitmq-values.yaml

```
helm install rabbitmq bitnami/rabbitmq -f ./cloudify-manager-worker/external/rabbitmq-values.yaml -n NAMESPACE
```

## Install cloudify manager worker

```
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-worker cloudify-helm/cloudify-manager-worker -f ./cloudify-manager-worker/values.yaml -n NAMESPACE
```

## Configuration options of cloudify-manager-worker values.yaml:

### Image:

```yaml
image:
  repository: "cloudifyplatform/premium-cloudify-manager-worker"
  tag: "5.3.0"
  pullPolicy: IfNotPresent
```

### DB - postgreSQL:

```yaml
db:
  host: postgres-postgresql
  cloudify_db_name: 'cloudify_db'
  cloudify_username: 'cloudify'
  cloudify_password: 'cloudify'
  server_db_name: 'postgres'
  server_username: 'postgres'
  server_password: 'cfy_test_pass'
```

### Message Broker - rabbitmq:

```yaml
queue:
  host: rabbitmq
  username: 'cfy_user'
  password: 'cfy_test_pass'
```

### Service:

```yaml
service:
  host: cloudify-manager-worker
  type: ClusterIP
  name: cloudify-manager-worker
  http:
    port: 80
  https:
    port: 443
  internal_rest:
    port: 53333
```

### node selector - select on which nodes cloudify manager AIO may run:

```yaml
nodeSelector: {}
# nodeSelector:
#   nodeType: onDemand 
```

### Secret name of certificate

```yaml
secret:
  name: cfy-certs
```

### resources requests and limits:

```yaml
resources:
  requests:
    memory: 0.5Gi
    cpu: 0.5
```

### Persistent volume size for EBS/EFS:

If using multiple replicas (High availability), NFS like Storage like EFS must be used

```yaml
volume:
  storage_class: 'efs'
  access_mode: 'ReadWriteMany'
  size: "3Gi"
```

If using one replicas, you can use EBS (gp2) for example, **gp2 is default**:

```yaml
volume:
  storage_class: 'gp2'
  access_mode: 'ReadWriteOnce'
  size: "3Gi"
```

### readiness probe may be enabled/disabled

```yaml
readinessProbe:
  enabled: true
  port: 80
  path: /console
  initialDelaySeconds: 10
```

### license - relevant in case you use premium cloudify manager,not community

You can add license as secret to k8s

```yaml
licence:
  secretName: cfy-licence
```

### Config

You can delay start of cfy manager / install all plugins / disable security (not recommended)...

```yaml
config:
  start_delay: 0
  # Multiple replicas works only with EFS(NFS) volume
  replicas: 1
  install_plugins: false
  cli_local_profile_host_name: localhost
  security:
    ssl_enabled: false
    admin_password: admin
  tls_cert_path: /mnt/cloudify-data/ssl/tls.crt
  tls_key_path: /mnt/cloudify-data/ssl/tls.key
  ca_cert_path: /mnt/cloudify-data/ssl/ca.crt
```

### Ingress

You may enable ingress-nginx and generate automatically cert if you have ingress-nginx / cert-manager installed.

```yaml
ingress:
  enabled: false
  host: cloudify-manager.app.cloudify.co
  annotations:
    kubernetes.io/ingress.class: nginx
    # cert-manager.io/cluster-issuer: "letsencrypt-prod"
  tls:
    enabled: false
    secretName: cfy-secret-name
```
