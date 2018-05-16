---
layout: bt_wiki
title: Using the Secrets Store
category: Manager
draft: false
weight: 875
---

The secrets store provides a secured variable storage (key-value pairs) for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform.
The secrets values are being stored encrypted in our DB. We use the Fernet encryption algorithm of cryptography library,
it's a symmetric encryption method which makes sure that the message encrypted cannot be manipulated/read without the key.
When you create a secret, the key value can be a text string or it can be a file that contains the key value. With the secrets store, you can make sure all secrets (for example credentials to IaaS environments) are stored separately from blueprints, and adhere to isolation requirements between different tenants. You can include the secret's key in your blueprints and not include the actual values in the blueprints.
For more information, see the [get_secret]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.

### Hidden value secret

All the secrets values are encrypted in the DB. When you create a secret you can specify if you want its value to be hidden or not.
A hidden-value secret means the secret value is only shown to the user that created the secret and to admins.
A hidden-value secret means the secret's value will only be presented to the user who created it, tenant managers and sys-admins.
Use of the secret is allowed according to user roles and visibility setting for the secret.

### Creating a secret via the CLI

The `cfy secrets` command is used to manage Cloudify secrets (key-value pairs).

{{< highlight  bash  >}}
$ cfy secrets create test -s test_value
...

Secret `test` created

...
{{< /highlight >}}

For more commands, see [secrets command line]({{< relref "cli/orch_cli/secrets.md" >}}).

### Creating a secret via the Cloudify Web UI

Secret Store Management is performed via the System Resources page in the Cloudify Console.

1. Click **Create** in the Secret Store Management widget.
2. Insert the secret key, the value (or select the secret file from your file repository) and the visibility level.

![Create Secret]( /images/manager/create_secret_dialog.png )

3. Click **Create**.
4. To change the visibility level for the secret, click on the visibility icon in key cell.

![View Secret]( /images/manager/secret_view.png )
