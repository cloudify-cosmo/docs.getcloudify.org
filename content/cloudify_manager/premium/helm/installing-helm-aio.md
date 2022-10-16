---
layout: bt_wiki
title: All-in-One
description: Deploy a Cloudify Manager AIO to Kubernetes with a helm chart.
category: Installation
draft: false
weight: 10
---
## Cloudify manager AIO helm chart  ( Community Version )

### Description

It's a helm chart for cloudify manager which is:

* Not highly available, has one replica only.
* Has no persistent volume to survive restarts/failures.
* Has all components on board (as part of docker container): Message Broker and DB part of it.

**This is the best and most simple way to make yourself familiar with cloudify, running a Cloudify manager AIO is a matter of minutes**


### Installation
```bash
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm

helm install cloudify-manager-aio cloudify-helm/cloudify-manager-aio
```

### Configuration options for values.yaml:

#### Image:

```yaml
image:
  repository: "cloudifyplatform/community-cloudify-manager-aio"
  tag: "latest"
  pullPolicy: IfNotPresent
```

#### Service:

```yaml
service:
  type: LoadBalancer
  name: cloudify-manager-aio
  rabbitmq:
    port: 5671
  http:
    port: 80
  https:
    port: 443
  internal_rest:
    port: 53333
```

#### node selector - select on which nodes cloudify manager AIO may run:
* for more information and options see [the worker docs]({{< relref "./installing-helm-worker.md#option-2" >}})
```yaml
nodeSelector: {}
# nodeSelector:
#   nodeType: onDemand 
```


#### resources requests and limits:
```yaml
resources:
  requests:
    memory: 0.5Gi
    cpu: 0.5
```

#### readiness probe may be enabled/disabled
```yaml
readinessProbe:
  enabled: true
  port: 80
  path: /console
  initialDelaySeconds: 10
```


