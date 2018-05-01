---
layout: bt_wiki
title: Kubernetes Overview
category: Kubernetes
draft: false
weight: 500

---

# Kubernetes Troubleshooting Guide

These are commonly reported issues. 


## Docker Installation

Kubernetes requires Docker to be running on the machine. Our [Kubernetes blueprint](https://github.com/cloudify-examples/simple-kubernetes-blueprint) will try to install Docker on your VMs. However, installation may time out. This usually indicates that it failed to install Docker.

{{< gsHighlight bash >}}
2018-05-01 09:16:46.272  CFY <kubernetes> [kubernetes_master_y032hn.create] Sending task 'script_runner.tasks.run'
2018-05-01 09:16:46.272  CFY <kubernetes> [kubernetes_master_y032hn.create] Task started 'script_runner.tasks.run'
2018-05-01 09:16:46.410  LOG <kubernetes> [kubernetes_master_y032hn.create] INFO: Downloaded scripts/kubernetes_master/create.py to /tmp/M2Z4A/tmpH2xJaV-create.py
2018-05-01 09:16:47.276  CFY <kubernetes> [kubernetes_master_y032hn.create] Task rescheduled 'script_runner.tasks.run' -> Docker is not present on the system.
{{< /gsHighlight >}}

This issue is very IaaS dependent.

    * The AWS blueprint uses Cloud Init to installed Docker. Make sure that your AMI supports Cloud Init. If so, check the Cloud Init log `/var/log/cloud-init.log`.
    * The Openstack blueprint uses Cloud Init to installed Docker. Make sure that your Openstack image supports Cloud Init. If so, check the Cloud Init log `/var/log/cloud-init.log`.
    * The Azure blueprint uses Custom Scripts. Check the [troubleshooting guide](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/extensions-customscript#troubleshooting) for Custom Scripts.
    * The GCP blueprint uses Startup Scripts. See the documentation on [Startup Scripts](https://cloud.google.com/compute/docs/startupscript).
    * The VSphere blueprint uses the Cloudify script plugin. The deployment execution logs should be helpful. 


## Incorrect Padding

Kubernetes uses client certificate authentication. These certificates are base64-encoded. 

{{< gsHighlight bash >}}
  File "/usr/lib64/python2.7/base64.py", line 321, in decodestring
    return binascii.a2b_base64(s)
Error: Incorrect padding
{{< /gsHighlight >}}

You will get this error if the encoded value becomes corrupted. Try decoding and re-encoding the certificate.
