+++
title = "Additional Security Information "
description = "Additional Security Information "
weight = 30
alwaysopen = false
+++

## Overview

* All services required by {{< param product_name >}} run under the {{< param product_name >}} user (and not root) in the manager VM. The only exception is the parent process of Nginx, which runs as root in order to enable the use of port 80. It is not recommended to change this behavior.<br>
* A secrets store is implemented inside the {{< param product_name >}} PostgreSQL database, which provides a tenant-wide variable store.
* Through the usage of the secrets store, a user can ensure all secrets (such as credentials to IaaS environments, passwords, and so on) are stored securely and separately from blueprints, and adhere to isolation requirements between different tenants.<br>
* Users need not know the actual values of a secret parameter (such as a password), since they can just point to the secrets store.<br>
* Secrets can be added to the store using a `SET` function and retrieved via `GET`.<br>
* Plugins can access the secrets store, to leverage the secrets when communicating with IaaS environments.<br>
* {{< param cfy_manager_name >}} instances must be secured via SSL to ensure secrets are not passed on an unencrypted communication channel.<br>
* The use of PostgreSQL ensures that secrets are replicated across all {{< param cfy_manager_name >}} instances within a cluster, as part of HA.<br>

For more information about the secrets store, [click here]({{< relref "working_with/manager/using-secrets.md" >}}).
