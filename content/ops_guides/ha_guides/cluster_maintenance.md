---
title: Cloudify HA cluster maintenance
description: Guides for HA scenarios
weight: 80
alwaysopen: false
---

## Cloudify Cluster status

### Adding a new cluster node

When a new cluster node is added, it is required to configure its status reporter by the following steps:

1. Collect the following data:
- A list of the current private IP addresses of the Cloudify managers, There must be at least one address, that list will be updated automatically afterward.
- Run the following command on each of the Cloudify managers to retrieve specific internal communication tokens:
  ```bash
  cfy_manager status-reporter get-tokens
  ```
  This will return a list of three token named 'manager_status_reporter', 'db_status_reporter' and 'broker_status_reporter', please copy aside 'db_status_reporter' and 'broker_status_reporter' tokens.
- Please copy to all cluster nodes, expect Cloudify management's service ones, the CA certificate that was specified in the config.yaml at the section 'ssl_inputs' of field 'ca_cert_path'. This is for
  for a secure connection between the reporters and Cloudify system.
1. To enable and configure the node's status reporter, execute (on every node's machine):
  ```bash
  cfy_manager status-reporter configure --token <relevant status reporter token> --ca-path <Cloudify-rest CA certificate local path> --managers-ip <list of current managers ip>
  ```
### Configuring status reporter

The Status reporter can be configured by running the following command:
```bash
cfy_manager status-reporter configure <--reporting-freq/--token/--managers-ip/--log-level>
```

- Cluster node status reporting frequency of the reporter, the **default frequency** is once every 5 seconds.
- The HTTP token used by the status reporter to securely communicate with Cloudify management service.
- Cloudify's management services nodes' IP addresses, needed for the reporter to send his node status.
- The log level of the status reporter {INFO,WARNING,ERROR,DEBUG}.
