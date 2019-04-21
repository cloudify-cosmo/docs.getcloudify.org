---
layout: bt_wiki
title: SSH Key Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the [utilities plugin]({{< relref "working_with/official_plugins/Configuration/utilities/_index.md" >}}).
{{% /note %}}

# Cloudify Utilities: SSH Key

This plugin enables a user to create a private and public key.

### Notes

- Tested with Cloudify Manager 4.0+.
- For Cloudify Manager 4.0 and above: Private key can be stored in secret store.

## Examples:

**Node Template with Secret Creation:**

```yaml
  agent_key:
    type: cloudify.keys.nodes.RSAKey
    properties:
      resource_config:
        key_name: { get_input: agent_key_name }
        openssh_format: true
      use_secret_store: true
```
