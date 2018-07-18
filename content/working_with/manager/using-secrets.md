---
layout: bt_wiki
title: Using the Secrets Store
category: Manager
draft: false
weight: 875
aliases: /manager/using-secrets/
---

The secrets store provides a secured variable storage (key-value pairs) for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform.
The values of the secrets are encrypted in the database.
We use the Fernet encryption of cryptography library, which is a symmetric encryption method that makes sure that the message encrypted cannot be manipulated/read without the key.
When you create a secret, the key value can be a text string or it can be a file that contains the key value. The secret store lets you make sure all secrets (for example credentials to IaaS environments) are stored separately from blueprints, and that the secrets adhere to isolation requirements between different tenants. You can include the secret key in your blueprints and not include the actual values in the blueprints.
For more information, see the [get_secret]({{< relref "developer/blueprints/spec-intrinsic-functions.md#get-secret" >}}) intrinsic function.

### Secrets with a hidden value

All the values of the secrets are encrypted in the database. When you create a secret you can specify if you want its value to be hidden or not.
A secret with a hidden value means the value is only shown to the user who created it, tenant managers and sys-admins.
Users can use the secret according to the user roles and the visibility of the secret.


### Updating a secret

#### Updating a secret with a shown value

* Updating the secret's value and visibility or deleting the secret is allowed according to the user roles and the visibility of the secret.
* Updating the secret to hide the value is only allowed to the user who created it, tenant managers and sys-admins.

#### Updating a secret with a hidden value

Only the creator of the secret, a sys-admin or a tenant manager of the tenant the secret is stored on can see, update or delete the secret with a hidden value (unlike a secret with a shown value which other users in the tenant can also update or delete).

### Creating a secret from the CLI

You can use the `cfy secrets` command to manage Cloudify secrets (key-value pairs).

{{< highlight  bash  >}}
$ cfy secrets create test -s test_value
...

Secret `test` created

...
{{< /highlight >}}

For more commands, see [secrets command line]({{< relref "cli/orch_cli/secrets.md" >}}).

### Creating a secret from the Cloudify Console

Secret Store Management is performed from the System Resources page in the Cloudify Console.

1. Click **Create** in the Secret Store Management widget.
2. Insert the following values:
    * The secret key
    * The secret value (or select the secret file from your file repository)
    * The visibility level (the icon of the green man)
    * If the value of the secret should be hidden
3. Click **Create**.

![Create Secret]( /images/manager/create_secret_dialog.png )

4. Press on the eye icon for viewing the secret value.
5. To change the visibility level of the secret, click on the visibility icon in the key cell.
7. To hide the secret value, select the Hidden checkbox.
8. For updating the secret value there is an edit icon in the right and next to it the delete icon.

![View Secret]( /images/manager/secret_management.png )