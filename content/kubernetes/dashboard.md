---
layout: bt_wiki
title: Kubernetes Dashboard
category: Kubernetes
draft: false
weight: 200

---

## Overview

Expose your Kubernetes Dashboard on a public IP using the Cloudify Kubernetes Plugin.


## Prerequisites

* A Cloudify Manager (4.3+).
* A Kubernetes Cluster.
* Cloudify Kubernetes Plugin 2.2.0.
* Secrets:
  * `kubernetes_master_ip`: This is usually the IP of the primary network device on the Kubernetes Master machine.
  * `kubernetes_master_port`: This is usually `6443`.
  * `kubernetes_certificate_authority_data`: The contents of the `certificate-authority` file.
  * `kubernetes-admin_client_certificate_data`:  The contents of the admin user's `client_certificate_data` file.
  * `kubernetes-admin_client_key_data`: The contents of the admin user's `client_key_data` file.
  * `agent_key_private`: The content of the private key for the Kubernetes Master SSH user.
* Inputs:
  * `dashboard_agent_user`: The SSH user of the Kubernetes Master.
  * `public_dashboard_ip`: A floating IP connected to the primary network device on the Kubernetes Master machine.


## Installation

Execute the _Kubernetes Dashboard Blueprint_ from your Cloudify Manager.

_You can use your Cloudify CLI to execute this:_

```shell
cfy install \
    https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/archive/master.zip \
    --blueprint-filename examples/kubernetes-dashboard-blueprint.yaml \
    --blueprint-id kube-dashboard
```


## Get the Authentication Token

This deployment generated an authentication token. Retrieve it from your Deployment outputs:

```shell
cfy deployments outputs kube-dashboard
 - "bearer_token":
     Description: Kubernetes Token
     Value: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InJlZ3VsYXItdXNlci10b2tlbi1qeHhoNSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJyZWd1bGFyLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiMGE3MzBiOC0yMTM5LTExZTgtODAxZC00MjAxMGEwYjBjMDQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDpyZWd1bGFyLXVzZXIifQ.m06FHyC8TbKZ1bcnxIV_JKpKrADIOYDN4BqEcTMR947fzzfTzU8QiVjYJQF4kCgAR1rC3dNYcQI8rtmwLJg3ttmAoFi_myi38Mb6JyW19vMjxUx3BK8xuiXhcReQyEt0X50koSminwQbqFqMNbtGtODqIyjfe-ePfbdbTV57n16YdtKrhpHuifkWhD26Vyskj1BWs7jmfzPmb8Q7ttKHEIsEgxjTjFxhRPMzp-UxeH1pLnd36tnfUxU9v-6dHCzJUIlYpu-IahhQmTvf5sK5eClT2h3bGJzMtDA2oji_0kFWJ0yemeJuOXX4fNNSeRo9lPPCQIlz1gBNPvSHQngwgQ
 - "dashboard_url":
     Description: Kubernetes Access Url
     Value: https://172.25.1.20:8443
```


## Connect to the Dashboard

When you connect to the dashboard, you will see a screen inviting you to login. Paste the "bearer token" and authenticate.
