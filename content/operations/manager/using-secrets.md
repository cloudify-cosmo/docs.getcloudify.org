---
layout: bt_wiki
title: Using the Secrets Store
category: Manager
draft: false
weight: 875
---

The secrets store provides a variable storage (key-value pairs) for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform.
When you create a secret, the key value can be a text string or it can be a file that contains the key value. With the secrets store, you can  make sure all secrets (for example credentials to IaaS environments) are stored separately from blueprints, and adhere to isolation requirements between different tenants. You can include the secret's key in your blueprints and not include the actual values in the blueprints.
For more information, see the [get_secret]({{< relref "blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.

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
2. Insert the secret key, the value (or select the secret file from your file repository) and the visibility level.

![Create Secret]({{< img "manager/create_secret_dialog.png" >}})

3. Click **Create**.
4. To change the visibility level for the secret, click on the visibility icon in key cell.

![View Secret]({{< img "manager/secret_view.png" >}})
