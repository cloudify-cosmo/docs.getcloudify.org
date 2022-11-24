+++
title = "Networking"
description = "Networking"
weight = 20
alwaysopen = false
+++

## Ports and Entry Points

Rather than specifying the ports in each component's overview, ports are specified here so that you can easily review the network requirements.

### External Ports

{{% note title="Ports" %}}
All ports are TCP ports unless stated otherwise.
{{% /note %}}

By default, there are two external networks from which the {{< param cfy_manager_name >}}s are accessed:

* The network on which the CLI resides is potentially a user's `management network`.
* The network on which the application resides is potentially a user's application network.

Therefore, {{< param product_name >}} requires only two entry points for its management environment:

* Ports 80/ 443 for user rest-service/ UI access via Nginx
* Port 22 is exposed for SSH access, to enable remote access to the {{< param cfy_manager_name >}}.
  This is required for the `cfy ssh` command to work.

### Application Ports

The following ports are exposed for agent-manager communication:

* The REST service and the file server are accessed via port 53333
* RabbitMQ is accessed via port 5671

The agents use the REST service to update the application's model (for example, setting runtime properties).
Agents connect to RabbitMQ to receive tasks.

### Local ports

The following additional ports are exposed on localhost, and used by the manager internally:

* RabbitMQ uses port 15671 for the management API access
* The {{< param cfy_console_name >}} backend uses port 8088
* The {{< param cfy_composer_name >}} backend uses port 3000
* PostgreSQL uses port 5432 for database access