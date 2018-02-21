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
cfy executions start <WORKFLOW_NAME> -d <DEPLOYMENT_NAME>
{{< /gsHighlight >}}


## Executing a Workflow via the Cloudify Web UI

1. Navigate to and click the relevant deployment on the Deployments widget.   
   ![workflows1]({{< img "manager/nodecellar_openstack_topology.png" >}})

2. Click **Execute Workflow** and select the required workflow from the dropdown menu.   
   ![workflows2]({{< img "manager/ui-workflows2.png" >}})

3. Enter the required values and click **Execute** to start the workflow execution.   
   You must supply the `node_instance_id` value.
   ![workflows3]({{< img "manager/ui-workflows3.png" >}})<br>
   During the time that the progress spinner is displayed, you can cancel the execution by clicking the **X** button.<br>
   
#### Example: Installing an Application

This example shows how an `install` workflow can be executed from the Node Cellar deployment:

* Type the following command in your terminal:  

  {{< gsHighlight  bash >}}
  cfy executions start install -d nodecellar
  {{< /gsHighlight >}}

The execution will take some time (depending on the IaaS provider), during which the resources are created and configured.

You can track the progress of the installation by reviewing the events displayed in the terminal window. Each event is labeled with its time, the deployment name, the node in the topology to which it relates, and so on.

{{< gsHighlight  bash  >}}
2017-12-02T09:46:05 CFY <nodecellar> [nodejs_d36c8] Creating node
{{< /gsHighlight >}}

**Testing the Installed Application**

1. After the Node Cellar `install` workflow execution is complete, you can view the application endpoint by running:   
   {{< gsHighlight  bash >}}
   cfy deployments outputs nodecellar
   {{< /gsHighlight >}}

2. Navigate to the URL to see the application running.

3. Click the "Browse wines" button to verify that the application was installed successfully and can access the mongodb database to read the list of wines.   

   ![Nodecellar]({{< img "guide/quickstart-openstack/nodecellar.png" >}})

**Uninstalling the Application**

To uninstall the deployed application, you run a workflow that tears down all the resources that were provisioned by the `install` workflow. For more information, see the [uninstall]({{< relref "workflows/built-in-workflows.md#the-uninstall-workflow" >}}) workflow. 

* Type the following command in your terminal:  
  {{< gsHighlight  bash >}}
  cfy executions start uninstall -d nodecellar
  {{< /gsHighlight >}}   

Similarly to the `install` workflow, you can track the progress of the uninstall process in the CLI or the Web interface.
After the workflow is complete, you can verify that the resources have been deleted.

# What's Next

After an application uninstallation process is complete, you can [delete a deployment]({{< relref "manager/delete-deployment.md" >}}).
