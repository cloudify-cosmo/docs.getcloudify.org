---
layout: bt_wiki
title: Using the Secrets Store
category: Manager
draft: false
weight: 875
aliases: /manager/using-secrets/
---

The secrets store provides a secured variable storage (key-value pairs) for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform.
The secrets values are being stored encrypted in our DB. We use the Fernet encryption algorithm of cryptography library,
it's a symmetric encryption method which makes sure that the message encrypted cannot be manipulated/read without the key.
When you create a secret, the key value can be a text string or it can be a file that contains the key value. With the secrets store, you can make sure all secrets (for example credentials to IaaS environments) are stored separately from blueprints, and adhere to isolation requirements between different tenants. You can include the secret's key in your blueprints and not include the actual values in the blueprints.
For more information, see the [get_secret]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.

### Hidden value secret

All the secrets values are encrypted in the DB. When you create a secret you can specify if you want its value to be hidden or not.
A hidden-value secret means the secret's value will only be shown to the user who created it, tenant managers and sys-admins.
Use of the secret is allowed according to the users roles and the visibility of the secret.

#### Updating a hidden-value secret

A user is hidden-value permitted if he is the creator of the secret, or a sys-admin or a tenant manager in the secret's tenant.
Updating and deleting a hidden-value secret is allowed only to hidden-value permitted users.
Updating a non-hidden value secret is allowed according to the users roles and the visibility of the secret.
However, only hidden-value permitted users can update non-hidden value secret to be hidden-value.

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
2. Insert the following values:
    * The secret key
    * The secret value (or select the secret file from your file repository)
    * The visibility level (the icon of the green man)
    * If the value of the secret should be hidden
3. Click **Create**.

![Create Secret]( /images/manager/create_secret_dialog.png )

4. Press on the eye icon for viewing the secret's value.
5. To change the visibility level of the secret, click on the visibility icon in the key cell.
7. To make the secret hidden-value or vice versa, change the hidden-value checkbox.
8. For updating the secret's value there is an edit icon in the right and next to it the delete icon.

![View Secret]( /images/manager/secret_management.png )
