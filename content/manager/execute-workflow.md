---
layout: bt_wiki
title: Executing Workflows
category: Manager Intro
draft: false
weight: 600

terminology_link: reference-terminology.html
workflows_link: workflows-built-in.html
---

After you have [created a deployment]({{< relref "manager/create-deployment.md" >}}), you must execute the process that will implement your application's actual manifestation in your selected environment.

This process is achieved using the [install workflow] ({{< relref "workflows/built-in-workflows.md#the-install-workflow" >}}), which is the default workflow provided by Cloudify for deploying your application.

You can create workflows for different types of actions such as deploying code, changing the infrastructure state, and even for overriding the default Install Workflow.


## Executing a Workflow via the CLI

To execute a workflow run the following command.

{{< gsHighlight  bash >}}
cfy executions start -w <WORKFLOW_NAME> -d <DEPLOYMENT_NAME>
{{< /gsHighlight >}}


## Executing a Workflow via the Cloudify Web UI

1. Navigate to the relevant deployment on the Deployments widget.   
   ![workflows1]({{< img "ui/ui-workflows1.png" >}})

2. Select the required workflow from the dropdown adjacent to the relevant deployment.   
   ![workflows2]({{< img "ui/ui-workflows2.png" >}})

3. Enter the required values and click **Execute** to start the workflow execution.   
   You must supply the `node_instance_id` value.
   ![workflows3]({{< img "ui/ui-workflows3.png" >}})<br>
   After **run execution** is clicked, the progress spinner is displayed. You can cancel the execution by clicking the **X** button.<br>
   ![workflows4]({{< img "ui/ui-workflows4.png" >}})

### Installing the Application

We'll now execute the Install Workflow from our nodecellar deployment:

Type the following command in your terminal:

{{< gsHighlight  bash >}}
cfy executions start -w install -d nodecellar
{{< /gsHighlight >}}

This will take some time (depending on the IaaS provider), during which the resources will be created and configured.

To track the progress of the installation, you can look at the events emitted to the terminal window.

Each event is labeled with its time,
the deployment name and the node in our topology that it relates to, e.g.

{{< gsHighlight  bash  >}}
2014-12-02T09:46:05 CFY <nodecellar> [nodejs_d36c8] Creating node
{{< /gsHighlight >}}

In the Web UI, you can checkout the Logs/Events page for an overview of all Logs and Events in a specific Manager.

![Events]({{< img "guide/quickstart-openstack/events.png" >}})

<br>

You can also have a look at the Monitoring tab and see some default metrics once the application has been installed:

![Metrics]({{< img "guide/default_dashboard.png" >}})

{{% gsNote title="Note" %}}
The blueprint we installed actually defines a custom collector for the Mongo database.
To add mongo related graphs to the dashboard, have a look at [Adding Custom Graphs]({{< relref "manager_webui/graphing-metrics.md" >}}).
{{% /gsNote %}}

# Test Drive the application

Once the workflow execution is complete, we can view the application endpoint by running:
{{< gsHighlight  bash >}}
cfy deployments outputs -d nodecellar
{{< /gsHighlight >}}
Hit that URL to see the application running.

The nodecellar application should be up on your screen.

Click the "Browse wines" button to verify that the application was installed successfully
and can access the mongodb database to read the list of wines.

![Nodecellar]({{< img "guide/quickstart-openstack/nodecellar.png" >}})

# Uninstall the application

Uninstalling the deployment is just a matter of running another workflow, which will teardown all the resources provisioned by the `install` workflow.
To run the [uninstall]({{< relref "workflows/built-in-workflows.md#the-uninstall-workflow" >}}) workflow, type the following command:

{{< gsHighlight  bash >}}
cfy executions start -w uninstall -d nodecellar
{{< /gsHighlight >}}

Similarly to the `install` workflow, you can track the progress of the
uninstall process in the CLI or the web UI using the events that are displayed in both.
Once the workflow is completed, you can verify that the resources were indeed destroyed.

# What's Next

Now that the uninstallation process is complete, you can [delete the deployment]({{< relref "manager/delete-deployment.md" >}}).
