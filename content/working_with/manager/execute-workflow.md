---
title: Executing Workflows
category: Manager Intro
draft: false
weight: 600
aliases: /manager/execute-workflow/

terminology_link: reference-terminology.html
workflows_link: workflows-built-in.html
---

After you have [created a deployment]({{< relref "working_with/manager/create-deployment.md" >}}), you must execute the process that will implement your application's actual manifestation in your selected environment.

This process is achieved using the [install workflow] ({{< relref "working_with/workflows/built-in-workflows.md#the-install-workflow" >}}), which is the default workflow provided by {{< param product_name >}} for deploying your application.

You can create workflows for different types of actions such as deploying code, changing the infrastructure state, and even for overriding the default Install Workflow.


## Executing a Workflow via the CLI

To execute a workflow run the following command.

{{< highlight  bash >}}
cfy executions start <WORKFLOW_NAME> -d <DEPLOYMENT_NAME>
{{< /highlight >}}


## Executing a Workflow via the {{< param cfy_console_name >}}

1. Navigate to the [Services page]({{< relref "working_with/console/pages/services-page.md" >}}) and click the relevant deployment on the [Deployments widget]({{< relref "working_with/console/widgets/deployments.md" >}}).

2. Click **Execute Workflow** and select the required workflow from the dropdown menu.   
   ![workflows2]( /images/manager/ui-workflows2.png )

3. Enter the required values and click **Execute** to start the workflow execution. You must supply the `node_instance_id` value.<br />
   ![workflows3]( /images/manager/ui-workflows3.png )<br />

#### Example: Installing an Application

This example shows how an `install` workflow can be executed from the Node Cellar deployment:

* Type the following command in your terminal:

  {{< highlight  bash >}}
  cfy executions start install -d nodecellar
  {{< /highlight >}}

The execution will take some time (depending on the IaaS provider), during which the resources are created and configured.

You can track the progress of the installation by reviewing the events displayed in the terminal window. Each event is labeled with its time, the deployment name, the node in the topology to which it relates, and so on.

{{< highlight  bash  >}}
2017-12-02T09:46:05 CFY <nodecellar> [nodejs_d36c8] Creating node
{{< /highlight >}}

**Testing the Installed Application**

1. After the Node Cellar `install` workflow execution is complete, you can view the application endpoint by running:
   {{< highlight  bash >}}
   cfy deployments outputs nodecellar
   {{< /highlight >}}

2. Navigate to the URL to see the application running.

3. Click the "Browse wines" button to verify that the application was installed successfully and can access the mongodb database to read the list of wines.   

   ![Nodecellar]( /images/guide/quickstart-openstack/nodecellar.png )

**Uninstalling the Application**

To uninstall the deployed application, you run a workflow that tears down all the resources that were provisioned by the `install` workflow. For more information, see the [uninstall]({{< relref "working_with/workflows/built-in-workflows.md#the-uninstall-workflow" >}}) workflow.

Type the following command in your terminal:
{{< highlight  bash >}}
cfy executions start uninstall -d nodecellar
{{< /highlight >}}

Similarly to the `install` workflow, you can track the progress of the uninstall process in the CLI or the {{< param cfy_console_name >}}.
After the workflow is complete, you can verify that the resources have been deleted.

# Next Steps

After an application uninstallation process is complete, you can [delete a deployment]({{< relref "working_with/manager/delete-deployment.md" >}}).
