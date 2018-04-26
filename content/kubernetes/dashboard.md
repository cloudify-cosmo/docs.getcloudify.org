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

* A Cloudify Manager (4.3+)
* A Kubernetes Cluster
* Cloudify Kubernetes Plugin 2.2.0
* Secrets:
  * `kubernetes_master_ip`: Usually the IP of the primary network device on the Kubernetes Master machine
  * `kubernetes_master_port`: Usually `6443`
  * `kubernetes_certificate_authority_data`: The contents of the `certificate-authority` file
  * `kubernetes-admin_client_certificate_data`:  The contents of the admin user's `client_certificate_data` file
  * `kubernetes-admin_client_key_data`: The contents of the admin user's `client_key_data` file
  * `agent_key_private`: The contents of the private key for the Kubernetes Master SSH user
* Inputs:
  * `dashboard_agent_user`: The SSH user of the Kubernetes Master
  * `public_dashboard_ip`: A floating IP connected to the primary network device on the Kubernetes Master machine

## Installation

To execute the _Kubernetes Dashboard Blueprint_ on your Cloudify Manager, run this command from the Cloudify CLI:

```shell
cfy install \
    https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/archive/master.zip \
    --blueprint-filename examples/kubernetes-dashboard-blueprint.yaml \
    --blueprint-id kube-dashboard -i dashboard_agent_user=[SSH User of K8s master] -i public_dashboard_ip=[FLOATING IP OF K8s master]
```

## Get the Authentication Token

This deployment generated an authentication token. Retrieve it from your Deployment outputs:

```shell
  ::  cfy dep out kube-dashboard
Retrieving outputs for deployment kube-dashboard...
 - "bearer_token":
     Description: Kubernetes Token
     Value: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLXA2NGw3Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJjOGNhYjc0ZC0zNzNkLTExZTgtOWQzMS1mYTE2M2VmM2IzOGQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.ibWzDPKUqIqbak3twXSvPqn-JLHnj976tOnK-HDFukIHX_J30VM2hB_b2WvAifOovsx0P4vHgDFLygcS0Cl-zSo-Zv3-dMd7boYD5QvhXlQ03HzexG4ouhfczZq_85ItjVFAc9b5Xd2YABuJIzML21XIAp_r-cd_Noq4WNFp3yHgkwySJwQUvRQ2gkUT5pQJNlWlCdwe8jpg12UbVN585eoK4ardenT87-8ez5Qe7hlrVy1LY6kXcd8nCVcgqVfjYfGOY0YrMujbCMoqSUAvoIxTWSbqfEwXfL_CJGCwOOFO770WtfxHuwrnl3_sxpe6evrLFL-51TnTOh2hHQnsew
 - "dashboard_url":
     Description: Kubernetes Access Url
     Value: https://172.25.1.20:32521
```

## Connect to the Dashboard

When you connect to the dashboard, you see a screen inviting you to login. Paste the "bearer token" and authenticate.
