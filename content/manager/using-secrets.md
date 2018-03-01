---
layout: bt_wiki
title: Using the Secrets Store
category: Manager
draft: false
weight: 875
---

The secrets store provides a variable storage (key-value pairs) for data that you do not want to expose in plain text in Cloudify blueprints,
such as login credentials for a platform.<br>
When creating a secret, the desired value can be a string or a file that contains the value to be set.<br>
Through usage of the secrets store, a user can ensure all secrets (such as credentials to IaaS environments, passwords, and so on) are stored separately from blueprints,
and adhere to isolation requirements between different tenants.<br>
Users need not know the actual values of a secret parameter (such as a password), since they can just point to the secrets store.<br>

To use the secrets store, you must specify the secret's key when you create the blueprint.<br>
For more information, see the [get_secret]({{< relref "blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.<br>

### Creating a secret via the CLI

The `cfy secrets` command is used to manage Cloudify secrets (key-value pairs).

{{< gsHighlight  bash  >}}
$ cfy secrets create test -s test_value
...

Secret `test` created

...
{{< /gsHighlight >}}

For more commands, see [secrets command line]({{< relref "cli/secrets.md" >}}).

### Creating a secret via the Cloudify Web UI

Secret Store Management is performed via the System Resources page in the Web interface.

1. Click **Create** in the Secret Store Management widget.
2. Insert the secret's key, value (or select the secret file from your file repository) and visibility.

![Create Secret]({{ <img "manager/create_secret_dialog.png"> }})

3. Click on **Create**.
4. To update the secret's visibility click on the visibility icon in key cell.

![View Secret]({{ <img "manager/secret_view.png"> }})

