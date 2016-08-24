---

title: Workflow Execution in the UI



weight: 135

terminology_link: reference-terminology.html
execute_workflow_link: getting-started-execute-workflow.html
---
{{% gsSummary %}}{{% /gsSummary %}}

When executing a `Workflow` for a `Deployment` (e.g. the `install` workflow), the topology nodes show badges that reflect the workflow execution state.<br/>
See more details on executing workflows [here]({{< relref "manager/execute-workflow.md" >}}).<br/>

## Badges

* Install state - The workflow execution is in progress for this node
* Done state - The workflow execution was completed successfully for this node
* Alerts state - The workflow execution was partially completed for this node
* Failed state - The workflow execution failed for this node

![Deployment Topology Node Badges]({{< img "ui/ui-deployment-topology-badges.png" >}})

## Workflow states represented by badges
A deployment before any workflow was executed

![Deployment Topology]({{< img "ui/ui-deployment-topology-1.png" >}})

A deployment with a workflow execution in progress

![Deployment Topology Execution In Progress]({{< img "ui/ui-deployment-topology-2.png" >}})

A deployment with a workflow execution in progress, partially completed

![Deployment Topology Execution Partially Completed]({{< img "ui/ui-deployment-topology-3.png" >}})

A deployment with a workflow execution completed successfully

![Deployment Topology Execution Completed Successfully]({{< img "ui/ui-deployment-topology-4.png" >}})

A deployment with a workflow execution partially completed successfully with some alerts

![Deployment Topology Execution Completed Partially Alerts]({{< img "ui/ui-deployment-topology-5.png" >}})

A deployment with a workflow execution that partially failed

![Deployment Topology Execution Completed Partially Errors]({{< img "ui/ui-deployment-topology-6.png" >}})

A deployment with a workflow execution that failed

![Deployment Topology Execution Completed Errors]({{< img "ui/ui-deployment-topology-7.png" >}})

