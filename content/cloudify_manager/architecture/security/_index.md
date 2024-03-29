+++
title = "Security"
description = "Security"
weight = 50
alwaysopen = false
+++

## Overview
Security, in the context of the {{< param cfy_manager_name >}}, means securing communication with the {{< param cfy_manager_name >}} and controlling who
has permission to use it to execute various operations.
<br>Secured communication is achieved using SSL, which allows clients to validate the authenticity of the {{< param cfy_manager_name >}},
and to ensure that the data sent to and from it is encrypted.<br>
Controlling access to {{< param cfy_manager_name >}} and permissions to perform actions, is implemented via Flask-Security to support user authentication and authorization.

{{< param cfy_manager_name >}} is secured by default. It cannot be bootstrapped in a non-secure way.

<br>Details about {{< param product_name >}}'s SSL and Access Control implementation and configuration are provided below.

{{< param product_name >}} security for client access focuses on the REST service, which is the first and only access point of clients to
{{< param cfy_manager_name >}}. All requests to {{< param cfy_manager_name >}} are authenticated and authorized before reaching their endpoint.
<br>
For example, when a {{< param cfy_console_name >}} user attempts to upload a new blueprint, a request is sent to the REST service's
*/blueprints* endpoint through port 80/ 443. The request only reaches the endpoint if the user is logged in and is authorized to upload
blueprints. Similarly, a user who executes the CLI command `cfy deployments list` triggers a request to execute `GET` on
*/deployments* that is only successful if it includes valid credentials that identify an authorized
user.
<br>Requests generated by other HTTP clients (e.g. curl) must also include valid credentials. Required credentials are a username and password, or a {{< param product_name >}}-generated token, and a tenant name. If credentials are missing, invalid, or represent an unauthorized user the request fails with a "401: Unauthorized User"
error.

{{% note title="Note" %}}
The */version* endpoint is not a secured resource and is therefore open to all users.
{{% /note %}}