---
layout: bt_wiki
title: Cloudify Manager Worker
description: Deploy a Cloudify Manager Worker to Kubernetes with a helm chart.
category: Installation
draft: false
weight: 50
---
## Cloudify Manager Worker Helm Chart (Premium Version)

### Description
 
A Helm chart for Cloudify Manager is:

* Is highly available, can be deployed with multiple replicas. (available only when used NFS like Storage file system)
* Uses persistent volume to survive restarts or failures.
* Uses external DB (postgress), which may be deployed via public Helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami/postgresql
* Uses external Message Brokes (RabbitMQ), which may be deployed via public Helm chart of Bitnami: https://github.com/bitnami/charts/tree/master/bitnami

This is how the setup looks after it's deployed to 'cfy-example' namespace (it's possible to have multiple replicas (pods) of cloudify manager):

![cfy-manager](/images/helm/cfy-example.png)

#### [Cloudify-Helm GitHub repo](https://github.com/cloudify-cosmo/cloudify-helm)
### Prerequisites
* Docker installed
* Kubectl installed
* Helm installed
* Running Kubernetes cluster (view differences between cloud providers)
  * [EKS on AWS]({{< relref "cloudify_manager/premium/helm/installing-helm-eks.md" >}})
  * [AKS on Azure]({{< relref "cloudify_manager/premium/helm/installing-helm-aks.md" >}})
  * [GKE on GCP]({{< relref "cloudify_manager/premium/helm/installing-helm-gke.md" >}})
* Sufficient Kubernetes node [Minimum Requirements](https://docs.cloudify.co/latest/install_maintain/installation/prerequisites/)
* Cloudify Premium valid license (for Premium version) 

### How to create and deploy such a setup?

1. [Generate certificate as a secret in k8s.](#generate-certificates-and-add-as-secret-to-k8s)

2. [Deployment of DB (Postgres).](#install-postgresqlbitnami-to-kubernetes-cluster-with-helm)

3. [Deployment of Message Broker (RabbitMQ).](#install-rabbitmqbitnami-to-kubernetes-cluster-with-helm)

4. [Deployment of Cloudify Manager worker.](#install-cloudify-manager-worker)

5. [(Optional) Ensure UI access to the manager upon installation](#optional-ensure-ui-access-to-the-manager-upon-installation)

6. [(Optional) Extra configuration options](#configuration-options-of-cloudify-manager-worker-valuesyaml)

7. [Troubleshooting](#troubleshoot)

8. [Uninstallation of Helm charts](#uninstallation)

**You need to deploy DB and Message Broker before deploying Cloudify manager worker.**


### Generate certificates and add as secret to k8s

**SSL certificate must be provided to secure communications between the Cloudify Manager and Posrgress/RabbitMQ:**

* ca.crt (to sign other certificates)

* tls.key

* tls.crt

#### Option 1: Create certificates using the community cloudify manager docker container

```bash
$ docker pull cloudifyplatform/community-cloudify-manager-aio:latest
$ docker run --name cfy_manager_local -d --restart unless-stopped --tmpfs /run --tmpfs /run/lock cloudifyplatform/community-cloudify-manager-aio
```
Exec to the manager and generate certificates
```bash
$ docker exec -it cfy_manager_local bash

# NAMESPACE to which cloudify-manager deployed, must be changed accordingly
$ cfy_manager generate-test-cert -s 'cloudify-manager-worker.NAMESPACE.svc.cluster.local,rabbitmq.NAMESPACE.svc.cluster.local,postgres-postgresql.NAMESPACE.svc.cluster.local'
```
You can change the name of the created certificates (inside the container):
```bash
$ cd /root/.cloudify-test-ca
$ mv cloudify-manager-worker.helm-update.svc.cluster.local.crt tls.crt
$ mv cloudify-manager-worker.helm-update.svc.cluster.local.key ./tls.key
```

Exit the container and copy the certificates from the container to your working environment:
```bash
$ docker cp cfy_manager_local:/root/.cloudify-test-ca/. ./
```

Create secret in k8s from certificates:

```bash
$ kubectl create secret generic cfy-certs --from-file=./tls.crt --from-file=./tls.key --from-file=./ca.crt -n NAMESPACE
```


#### Option 2: Use cert-manager component installed to kubernetes cluster

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
Create a local copy of the cert-issuer.yaml and apply it to the namespace:
```bash
$ kubectl apply -f ./cert-issuer.yaml -n NAMESPACE
```

### Clone cloudify-helm Repository
This step is necessary because the following steps will require files from this directory
* In case you don't have Git installed - https://github.com/git-guides/install-git
```bash
$ git clone https://github.com/cloudify-cosmo/cloudify-helm.git && cd cloudify-helm
```
### Install PostgreSQL (Bitnami) to Kubernetes Cluster with Helm
**First we need to add the Bitnami Helm repository - for PostgreSQL and RabbitMQ charts:**
```bash
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

You can find example of PostgreSQL values.yaml in external/postgres-values.yaml

Use certificate we created as k8s secret: 'cfy-certs'

```yaml
volumePermissions.enabled=true
tls:
  enabled: true
  preferServerCiphers: true
  certificatesSecret: 'cfy-certs'
  certFilename: 'tls.crt'
  certKeyFilename: 'tls.key'
```

Install PostgreSQL with postgres-values.yaml with pinned version:

```bash
$ helm install postgres bitnami/postgresql -f ./cloudify-manager-worker/external/postgres-values.yaml --version 10.15.0 -n NAMESPACE
```

### Install RabbitMQ (Bitnami) to Kubernetes Cluster with Helm


Use certificate we created as k8s secret: 'cfy-certs':

```yaml
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

Add to `rabbitmq-values.yaml`:

```yaml
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

Install RabbitMQ with `rabbitmq-values.yaml` with pinned version:

```bash
$ helm install rabbitmq bitnami/rabbitmq -f ./cloudify-manager-worker/external/rabbitmq-values.yaml --version 8.29.0 -n NAMESPACE
```

### Install Cloudify Manager Worker

#### Create configMap with premium license - required if using Cloudify premium version

Create `license.yaml` file and populate it with license data
* American/British English accepted, but must be alligned across all 'license/licence' strings (values/configMaps):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cfy-license
  namespace: <NAMESPACE>
data:
  cfy_license.yaml: |
    license:
      capabilities: null
      cloudify_version: null
      customer_id: <CUSTOMER_ID>
      expiration_date: 12/31/2021
      license_edition: Premium
      trial: false
    signature: !!binary |
      <LICENSE_KEY>
```
Enable license in values file

* License name (metadata.name) must match the secretName in the values file:

```yaml
license:
  secretName: cfy-license
```
Apply created config map:
```bash
$ kubectl apply -f license.yaml
```
#### Add the cloudify-helm Repository
Add the `cloudify-helm` repository or upgrade it:
```bash
$ helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm
```
or
```bash
$ helm repo update cloudify-helm
```
**If you want to customize the values it's recommended to do so before installing the chart** - [see configuration options below](#configuration-options-of-cloudify-manager-worker-valuesyaml), and either way make sure to review the values file.

#### (Optional) Ensure UI access to the manager upon installation:
#### **[OPTION 1]**
Use ingress-controller (e.g. NGINX Ingress Controller - https://kubernetes.github.io/ingress-nginx/deploy/)

**HTTP**
* Modify Ingress section accordingly (see example):

```yaml
ingress:
  enabled: true
  host: cloudify-manager.DOMAIN
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: 50m # use this annotation to allow upload of resources up to 50mb (e.g. plugins)
    # cert-manager.io/cluster-issuer: "letsencrypt-prod" # use this annotation to utilize an installed cert-manager
  tls:
    enabled: false
    secretName: cfy-secret-name
```
**HTTPS - Pre-applied SSL Cert**

* Create SSL secret with tls certificate:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cfy-secret-name
  namespace: NAMESPACE
data:
  tls.crt: SSL_TLS_CRT
  tls.key: SSL_TLS_KEY
type: kubernetes.io/tls
```
* Modify Ingress section accordingly (see example):
```yaml
ingress:
  enabled: true
  host: cloudify-manager.DOMAIN
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: 50m # use this annotation to allow upload of resources up to 50mb (e.g. plugins)
    # cert-manager.io/cluster-issuer: "letsencrypt-prod" # use this annotation to utilize an installed cert-manager
  tls:
    enabled: true
    secretName: cfy-secret-name
```
**HTTPS - Certificate Manager**
* Use certificate manager (e.g. Let's Encrypt via cert-manager - https://cert-manager.io/docs/)
* Modify Ingress section accordingly (see example):
```yaml
ingress:
  enabled: true
  host: cloudify-manager.DOMAIN
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: 50m # use this annotation to allow upload of resources up to 50mb (e.g. plugins)
    cert-manager.io/cluster-issuer: "<cluster-issuer-name>" # use this annotation to utilize an installed cert-manager
  tls:
    enabled: true
    secretName: cfy-secret-name
```
**HTTP/ HTTPS options will expose Cloudify Manager UI on a URL matching the `host` value**

#### **[OPTION 2]**
Skip Ingress and expose the Cloudify Manager service using LoadBalancer:

**HTTP**

For this method you need to edit the Service section to use the right type:
```yaml
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
```
That will create a load balancer depending on your K8S infrastructure (e.g. EKS will create a Classic Load Balancer)
**To get the hostname of the load balancer run:**
```bash
kubectl describe svc/cloudify-manager-worker -n NAMESPACE | grep Ingress
```
**The value of the ingress will be the UI URL of the Cloudify Manager.**

**HTTPS**
* To secure the site with SSL you can update the load balancer configuration to utilize an SSL Certificate
* To have a fixed URL, you can utilize a DNS service to route the LB URL (hostname) to the URL you want

#### After values are verified, install the manager worker chart
```bash
$ helm install cloudify-manager-worker cloudify-helm/cloudify-manager-worker -f ./cloudify-manager-worker/values.yaml -n NAMESPACE
```
### Configuration Options of cloudify-manager-worker values.yaml
Edit the values file in `./cloudify-manager-worker/values.yaml` according to your preferences:
#### Upgrade Cloudify Manager Worker:

To upgrade Cloudify Manager use `helm upgrade`.

For example to change to newer version (e.g. from 6.2.0 to 6.3.0 in this example)

Change image version in values.yaml:

Before:
```yaml
image:
  repository: cloudifyplatform/premium-cloudify-manager-worker
  tag: 6.2.0
```

After:
```yaml
image:
  repository: cloudifyplatform/premium-cloudify-manager-worker
  tag: 6.3.0
```

Run `helm upgrade`

```bash
$ helm upgrade cloudify-manager-worker cloudify-helm/cloudify-manager-worker -f ./cloudify-manager-worker/values.yaml -n NAMESPACE
```
If DB schema was changed in newer version, needed migration will be running first on DB, then application will be restarted during upgrade - be patient, because it may take a couple of minutes.

#### Image:

```yaml
image:
  repository: "cloudifyplatform/premium-cloudify-manager-worker"
  tag: "6.3.0"
  pullPolicy: IfNotPresent
```

#### DB - PostgreSQL:

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

#### Message Broker - RabbitMQ:

```yaml
queue:
  host: rabbitmq
  username: 'cfy_user'
  password: 'cfy_test_pass'
```

#### Service:
[See customization example above](#option-2)

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

#### Node Selector - Select on which nodes cloudify manager may run:

```yaml
nodeSelector: {}
# nodeSelector:
#   nodeType: onDemand 
```

#### Secret Name of Certificate

```yaml
secret:
  name: cfy-certs
```

#### Resources Requests and Limits:

```yaml
resources:
  requests:
    memory: 0.5Gi
    cpu: 0.5
```

#### Persistent Volume Size for EBS/ EFS:

If using multiple replicas (High availability), NFS like Storage like EFS must be used.
For more details see links to different cloud providers [here](#prerequisites)

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

#### Readiness Probe may be Enabled/ Disabled

```yaml
readinessProbe:
  enabled: true
  port: 80
  path: /console
  initialDelaySeconds: 10
```

#### Config

You can delay start of cfy manager/ install all plugins/ disable security (not recommended)

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

#### Ingress

You may enable ingress-nginx and generate automatically cert if you have ingress-nginx/ cert-manager installed (e.g. using nginx with existing ssl secret) - [See above for more details](#option-1)

```yaml
ingress:
  enabled: false
  host: cloudify-manager.app.cloudify.co
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: 50m # use this annotation to allow upload of resources up to 50mb (e.g. plugins)
    # cert-manager.io/cluster-issuer: "letsencrypt-prod" # use this annotation to utilize an installed cert-manager
  tls:
    enabled: false
    secretName: cfy-secret-name
```

### Troubleshoot

Some common use cases:

#### License is not Uploaded Correctly upon Installation

This might happen if the English convention of licence/license is not alligned across the values (name of the value and its value), or across the license/licence configMap.


Also, the [StatefulSet](./templates/statefulset.yaml) accepts a license/licence [configMap](#create-configmap-with-premium-license---required-if-using-cloudify-premium-version) with the `data` value of this syntax `cfy_license.yaml` (according to the chosen English convention)

After ensuring the above, try to reinstall the worker chart

- Workaround for this issue would be to manually upload the license after the manager installation through the UI after logging in or via the [CLI](https://docs.cloudify.co/latest/cli/maint_cli/license/).

#### Cloudify Manager Installation Succeded but I can't Reach the UI

Please see [above](#optional-ensure-ui-access-to-the-manager-upon-installation).

If you already installed the chart, update the values accordingly and run:

```bash
$ helm upgrade cloudify-manager-worker cloudify-helm/cloudify-manager-worker -f <path-to-values.yaml-file> -n NAMESPACE
```

#### I had to reinstall the worker chart and now it fails on Installation

This might happen due to inter-communications between the components in the different pods, a work around for that would be to delete the postgresql (has a PersistentVolume) and the rabbitmq pods, which will trigger a restart for them.
```bash
$ kubectl delete pod postgres-postgresql-0 -n NAMESPACE
$ kubectl delete pod rabbitmq-0 -n NAMESPACE
```
Then try reinstalling the worker chart.

#### Can't Find the Help You Need Here?
Feel free to open an [issue](https://github.com/cloudify-cosmo/cloudify-helm/issues) in the Helm chart GitHub page, or [contact us](https://cloudify.co/contact/) through our website.

### Uninstallation

As the whole setup is built from mainly 3 Helm charts, you simply need to uninstall them.
```bash
$ helm uninstall cloudify-manager-worker postgres rabbitmq -n NAMESPACE
```

To clean the supporting files:
```bash
$ kubectl delete secret cfy-certs -n NAMESPACE
$ kubectl delete configmap cfy-license -n NAMESPACE
```

[Jump to Top](#cloudify-manager-worker-helm-chart--premium-version)