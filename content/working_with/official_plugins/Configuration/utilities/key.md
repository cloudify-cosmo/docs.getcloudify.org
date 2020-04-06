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
 
## Example 1:

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
On this example we created a SSH key(private and public) and stored its values on secret store.

The names of the secrets will be: key_name_private, key_name_public.

From version 1.20.0 of utilities plugin the user can create key by using existing SSH key secrets.

## Example 2:
Lets say we deployed the last example with key_name: 'my_key', as mentioned before two secrets will be created(my_key_private, my_key_public).

Then if we deploy this node:
```yaml
node_templates:

  agent_key:
    type: cloudify.keys.nodes.RSAKey
    properties:
      resource_config:
        key_name: 'my_key'
        openssh_format: true
      use_secret_store: true
      use_secrets_if_exist: true
```

this node will use the existing secrets my_key_private and my_key_public 
as his key values.If the secrets dont exitst 

### Notes

- The owner of the secrets is the first deployed node so if the user 
will perform uninstall the secrets will be deleted and our example node will 
not be valid anymore.
Also, if the user first uninstall our example node(second example), the secrets 
will **not** be deleted because this node is not the owner of this key secrets.
- When enabling "use_secrets_if_exist" then "use_secret_store" must be enabled too.