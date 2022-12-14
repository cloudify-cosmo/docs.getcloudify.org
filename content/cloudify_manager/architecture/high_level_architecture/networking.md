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

| Port    | Description                                                                                                                    |
|---------|--------------------------------------------------------------------------------------------------------------------------------|
| 80/ 443 | Rest-service/ UI access via Nginx                                                                                              |
| 22      | SSH access, to enable remote access to the {{< param cfy_manager_name >}}. This is required for the `cfy ssh` command to work. |

### Application Ports

The following ports are exposed for agent-manager communication:

| Port  | Description                          |
|-------|--------------------------------------|
| 53333 | The REST service and the file server |
| 5671  | RabbitMQ                             |

The agents use the REST service to update the application's model (for example, setting runtime properties).
Agents connect to RabbitMQ to receive tasks.

### Local Ports

The following additional ports are exposed on localhost, and used by the manager internally:

| Port  | Description                                      |
|-------|--------------------------------------------------|
| 15671 | RabbitMQ port                                    |
| 8088  | The {{< param cfy_console_name >}} backend port  |
| 3000  | The {{< param cfy_composer_name >}} backend port |
| 5432  | PostgreSQL port                                  |
