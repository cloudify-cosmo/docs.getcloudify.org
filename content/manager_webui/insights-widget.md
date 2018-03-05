---
layout: bt_wiki
title: Insights Widget
category: Web Interface
draft: false
weight: 121
---
## Cost and Usage Analytics for Cloud

The Insights widget shows analytics of cloud platform costs and usage. It helps IT managers make decisions to control and reduce usage costs for their multi and hybrid cloud infrastructure.

As part of the Cloudify Dashboard, the Insights widget gives an end-to-end environment monitoring and orchestration solution, so that you can make the best decisions regarding your system with the most critical considerations.

![Insights Dashboard]({{< img "ui/widgets/insights-dashboard.png" >}})

## Supported Clouds

Insights supports these cloud platforms:

### Public

* AWS EC2
* Azure Classic
* Azure Resource Manager
* Google Compute Engine
* IBM (SoftLayer)
* Rackspace
* Digital Ocean
* HostVirtual
* Linode

### Private

* OpenStack
* VMware vSphere
* VMware vCloud
* KVM
* Packet.net
* Vultr

## Reports

The reports shown in the widget are:

1. Cost Overview - Real-time and historical VM cost reporting
1. Utilisation Overview - Real-time and historical VM usage reporting
1. Machines Overview - VM provisioning reporting

The filters in the widget let you choose the metrics shown by time period (hour, day, week, month, and quarter), by cloud, or by a specific Cloudify deployment. 

Insights also shows a comparison of metrics in different timeframes. For example, it can show that current month costs are larger than costs from last month.

### The Cost Overview Report

This report shows real-time and historical cost reporting for VMs. You can see time-period cost comparisons, the VM costs by cloud, and VM inventory per cloud or per deployment.

The Cost Overview report shows usage and costs trends over time and by cloud.

![Insights Cost Overview]({{< img "ui/widgets/insights-cost.png" >}})

### The Utilisation Overview Report

This report shows the amount of total/min/max/avg VM cores and loads, across all clouds. It can show time-period load comparison, or total cores and load per cloud.

The Utilisation Overview report gives a view into VM usage efficiency.

![Insights Utilisation Overview]({{< img "ui/widgets/insights-utilisation.png" >}})

### The Machine Overview Report

This report shows real-time and historical provisioning value of max/avg/and total, per VM or per cloud. It also shows the associated costs, and can show time-period VMs provisioned comparison.

The Machine Overview report gives insight to VM provisioning activity over a time period and by cloud.

![Insights Machines Overview]({{< img "ui/widgets/insights-machines.png" >}})

## Installation

### Cloudify Insights Installation Overview

Cloudify Insights as a service or on-premises requires an additional subscription model. Contact Cloudify Support for more information. You can use these steps to evaluate the service as an add-on to a running Cloudify manager:

* Make sure you have a manager up and running and a Cloudify CLI connected to it.
* Make sure that the cfyuser has sudo privileges on the manager VM before you install the Insights blueprint.

    **NOTE: You can restore the default cfyuser permissions after the evaluation.**

    1. Connect to the Cloudify manager with SSH.
    1. Add this line to the /etc/sudoers file, if it is not there already:

    `cfyuser	ALL=(ALL)	NOPASSWD: ALL`

    1. Save and exit the file: `wq!`

### Insights Manager Agent Installation

To install Insights, you must install the AMQP Middleware that lets the service access the Cloudify backend and import the widget to the Cloudify UI.

1. Install the Insights AMQP Middleware:
    1. Download and unzip the Insights widget from: [https://github.com/mistio/Cloudify-UI-Widget-boilerplate/releases](https://github.com/mistio/Cloudify-UI-Widget-boilerplate/releases)
    1. Open the archive, and enter the inputs for the Insights service in the `local-blueprint-inputs.yaml` file in the amqp-middleware-blueprints directory.

        The inputs file comes with several configuration options. Each configuration option has a description that explains the option.

        The inputs file is divided into these sections:

        * **Cloudify Manager Inputs**: Inputs required for the AMQP Middleware to connect to the RabbitMQ server on the Cloudify manager, and query Cloudify Manager's REST API to retrieve information on deployments and node instances.
        * **User Inputs**: User information to create a new Insights SaaS account.
        * **Cloud Credentials**: Users can specify their cloud credentials and the AMQP Middleware adds the cloud infrastructure to the Insights account.

        Most of the parameters below come with default values. These settings that are not commented out MUST be provided by the user: manager_host, user_name, User_email

    1. After you enter the inputs, save the file.
    1. From the CLI connected to the manager, execute the blueprint installation:

        ```cfy install <PATH-TO>/amqp-middleware-blueprints-master/local-blueprint.yaml -i <PATH-TO>/amqp-middleware-blueprints-master/inputs/local-blueprint-inputs.yaml```

    1. Then show the deployment outputs:

        ```cfy deployment outputs amqp-middleware-blueprints-master```

        You can also go to the deployment's drill-down page in the Cloudify UI and find the outputs widgets. The two outputs of the process are:

        * **credentials** - The Insights account token
        * **insights** - The path to the Insights web app with a read only token

        You will need the read-only token for the widget configuration.

1. To configure the Insights widget:
    1. Download the Insights widget zip package from: [https://github.com/mistio/Cloudify-UI-Widget-boilerplate/archive/master.zip]( https://github.com/mistio/Cloudify-UI-Widget-boilerplate/archive/master.zip )
    1. Login to the Cloudify manager as admin role and switch to edit mode.
    1. Add a new page and name it, for example: Insights
    1. Click on the page and click: Add widget
    1. Browse to the zip file that you downloaded and click OK.
    1. Select the Insights widget and click Add Selected Widgets.
    The empty widget is shown on the page.
    1. Copy the read-only token from the outputs called "insights".
    1. Click the widget configuration icon, paste the read-only token in the insights configuration field, and click OK
    After a few seconds, your widget shows the data collected in your insights account.

You can also install Cloudify Insights as an on-premise service. Contact Cloudify Support for more information.

### Adding Cloud Accounts 

To add clouds to an existing account:

1. Enter the details in the inputs/update-clouds.yaml file.

    The file structure is the same as the clouds section in inputs/local-blueprint-inputs.yaml.
1. Run:

    ```cfy execution start -d <PATH-TO>/amqp-middleware-blueprints-master -p <PATH-TO>/amqp-middleware-blueprints-master/inputs/update-clouds.yaml add_cloud```

### Removing Cloud Accounts 

To remove clouds from your account:

1. Enter the details in the inputs/remove-clouds.yaml file.
    You must refer to the clouds by their title.

1. Run:

    ```cfy execution start -d <PATH-TO>/amqp-middleware-blueprints -p  <PATH-TO>/inputs/update-clouds.yaml remove_cloud```

### Manager Restore

Before you make a snapshot and restore your manager, you must run the uninstall workflow on the Insights deployment to teardown the service, and delete both the deployment and the blueprint. Then, perform the snapshot creation, restore on the new manager, and reinstall the Insights service on the new manager.
