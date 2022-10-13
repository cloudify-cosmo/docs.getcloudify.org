+++
title = "Helm"
description = "Helm"
weight = 30
+++

Cloudify Manager may be installed on a Kubernetes cluster using our official helm chart. You have two options for installation: AIO helm chart, to better understand each option read about it below.

# Prerequisites 
- Existing Kubernetes cluster
- Installed helm package manager

It’s a helm chart for Cloudify Manager AIO which is:

- Not highly available, has one replica only.
- Has no persistent volume to survive restarts/failures.
- Has all components on board (as part of docker container): Cloudify Manager, Message Broker, and DB part of it.

# Install

```
helm repo add cloudify-helm https://cloudify-cosmo.github.io/cloudify-helm
helm install cloudify-manager-aio cloudify-helm/cloudify-manager-aio
```

# Configure

To understand all available Cloudify Manager AIO options chart has, please read Cloudify AIO Helm chart

# Update

Not Supported for community

# Delete

TBD
