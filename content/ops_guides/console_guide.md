---
title: Cloudify Console Guide
category: Operations Guides
draft: false
weight: 100
---
# Cloudify Console for Service Orchestration

The Cloudify Console provides a graphical user interface for orchestration that lets the operator:

* Upload blueprints into the Cloudify Managers
* Deploy and install/uninstall new services
* Monitor the status and performance of services
* View service logs and events

All of the things that can be done in the Cloudify Console can also be done using [the CLI and the REST API]({{< relref "working_with/_index.md" >}}).

## Logging into the Console

To login to the Cloudify Console you need to use a browser on your laptop or PC and enter in the URL of the Cloudify manager IP address or hostname, for example `https://192.168.0.1`. Then enter your username and password in order to login to the system.

![Cloudify Console login]( /images/ops_guides/login.png )

When you successfully login to the Cloudify Console, you see the Cloudify Console dashboard.

![Cloudify Console dashboard]( /images/ui/ui-dashboard-page.png )

## Uploading a Blueprint

* From the blueprints catalog:

    To upload a blueprint from the blueprints catalog:

    1. Go to **Cloudify Catalog**, select the required blueprint, and click **Upload**.

        ![Upload from Blueprint Catalog]( /images/ops_guides/blueprintscatalog.tiles.png )
    
    1. Enter the blueprint name and select filename of the blueprint:

        ![Local Blueprints - Upload yaml]( /images/ops_guides/localblueprints.upload.yaml.png )
    
    1. Click **Upload**.
        
        The blueprint is copied from Blueprints catalog to Local Blueprints.

* From the local host:

    To upload a blueprint from the local host:

    1. Go to **Local Blueprints** and click **Upload**.

        ![Upload blueprint to local blueprints]( /images/ops_guides/localblueprints.upload.button.png )
    
    1. Click in the field to select a blueprint package file.

        ![Select package file]( /images/ops_guides/localblueprints.upload.selectpackage.png )

    1. Browse to the blueprint archive.

        ![Browse to the blueprint archive]( /images/ops_guides/windowsexplorer.openblueprint.png )

    1. Update blueprint name and YAML file of the blueprint

    1. Click **Upload**.

        The blueprint is copied to local blueprints.

        ![Local Blueprints - Upload simple]( /images/ops_guides/localblueprints.simple-example.png )

*   From a URL:

    To upload a blueprint archive that is located in the Internet:

    1. Go to **Local Blueprints** and click **Upload**.

        ![Upload blueprint to local blueprints]( /images/ops_guides/localblueprints.upload.button.png )

    1. Enter the URL of the blueprint archive.

        ![Upload blueprint from URL]( /images/ops_guides/localblueprints.upload.url.png )

    1. Update blueprint name and YAML file of the blueprint     

    1. Click **Upload**.

        The blueprint is copied to local blueprints.

        ![Local Blueprints - Upload hello world]( /images/ops_guides/localblueprints.helloworld.png )

## Deleting blueprint

Before deleting a blueprint all deployments based on the blueprint must be uninstalled and deleted.

To delete the blueprint, just click **Delete** on the blueprint.

![Delete blueprint]( /images/ops_guides/localblueprints.delete.png )

## Setting up Customer Deployments

1. To create a new deployment:

    1. Go to Local Blueprints and click **Deploy** in the blueprint.

        ![Deploy blueprint]( /images/ops_guides/localblueprints.deploy.png )

    1. Fill in the inputs for the deployment and click **Deploy**.

        ![Create deployment - inputs]( /images/ops_guides/localblueprints.deploy.inputs.png )
        
        The first field is the name of the deployment and this needs to be a unique name given to this one deployment. It is usually something that includes the customer name and blueprint name (for example, radius-city-west). The other fields depend on the blueprint requirements and are automatically generated based on the inputs of the blueprint. For more about inputs, see [blueprint inputs]({{< relref "developer/blueprints/spec-inputs.md" >}})).

    1. After the deployment is created it is shown as one of the deployments in Deployments.

        ![Deployments list]( /images/ops_guides/deployments.list.status.png )

1. To install a deployment:

    1. To actually install a deployment into the network, drill down to specific deployment by clicking its name in Deployments page. 
    
    1. Click **Execute workflow** in the deployment menu and then click **Install**.

        ![Execute Workflow]( /images/ops_guides/deployments.execute.menu.png )

    1. After you review the parameters for the install workflow, click **Execute**.

        ![Execute Install]( /images/ops_guides/workflow.execute.install.png )

    1. The progress of the Install execution is shown in the Deployment Executions, Deployments Events and Logs widgets of the deployment page.

        ![Deployment Install Progress]( /images/ops_guides/deployments.exceutions_events_logs.png )

1. To get detailed information about the deployment click on it. 

The page contains a set of default widgets, but you can edit the page and add or remove widgets. The default widgets include:

*   **Topology**: shows the graphical topology of the deployment

![Deployment Topology]( /images/ops_guides/deployments.topology.png )

*   **Nodes**: shows the nodes in the deployment

![Deployment Nodes]( /images/ops_guides/deployments.nodes.list.png )

*   **Executions**: shows what workflows were executed on the deployment

![Deployments Executions]( /images/ops_guides/deployments.executions.list.png )

*   **Deployment Inputs & Outputs**: shows the inputs given to the blueprint in order to create this deployment and any outputs that were created as a part of the install workflow

![Deployment Inputs & Outputs]( /images/ops_guides/deployments.input_outputs.png )

*   **Source**: shows the source files of the blueprint

![Deployment Source]( /images/ops_guides/deployments.sourcefiles.png )

*   **Deployment Events & Logs**: shows events and logs of executions

![Deployment Events & Logs]( /images/ops_guides/deployments.exceutions_events_logs.png )

## Managing Customer Deployments

* To uninstall a deployment - Run the **Uninstall** workflow on the deployment. Deployments must be uninstalled before deleting.

* To scale, heal or run other executions - Run the workflow on the deployment.

{{% note %}}
Other workflows like Scale Up, Scale Down or Heal are shown in the **Execute Workflow** menu but can only run on deployments that are configured with those workflows in the deployment blueprint.
{{% /note %}}

* To delete a deployment - After you uninstall the deployment, you can click **Delete deployment** to delete it.

    ![Execute Workflow]( /images/ops_guides/deployments.execute.menu.png )

* To monitor the logs and events on a deployment - Search for errors and debug services in the [Logs Page]({{< relref "working_with/console/logs-page.md" >}}).

![Logs Page]( /images/ui/logsPage/logs-page.png )


## System Resources

### Plugins

By default, [plugins]({{< relref "working_with/official_plugins/_index.md" >}}) are tenant-specific, meaning that a blueprint on one tenant cannot access a plugin on a different tenant. You can also set a plugin as global when you upload it to the manager. The Plugins table lists the plugins are available to the current tenant.

![Plugins List]( /images/ops_guides/sys_resources.plugins.png )

*   Uploading a Plugin

    1.  Click **Upload** above the Plugins table.
    1.  Either enter the URL of the wagon or select the wagon file from your file repository.
    1.  Either enter the URL of the plugin yaml file or select the plugin yaml file from your file repository.
    1.  Click **Upload**.

        The plugin details appear in the Plugins table.

### Secret Store Management

Secret storage provides a tenant-wide variable store for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform.

![Secrets List]( /images/ops_guides/secretstore.list.png )


### Snapshots

The Snapshots table provides a list of all snapshots that have been uploaded or created. The Snapshots table is only available if you have `admin` credentials in Admin Operations page.

The snapshots creation process captures data in the entire Cloudify Manager, not just that of a specific tenant. However, the snapshot is created in the context of the current tenant, and therefore must be restored from it.

{{% note %}}
Snapshots are created as a private resource.
{{% /note %}}

![Snapshots List]( /images/ops_guides/sys_resources.snapshots.png )

*   Creating a Snapshot

    1.  Click **Create** above the Snapshots table.
    1.  Specify a unique ID for the snapshot and click **Create**.

        It is good practice to use a name that will help you to easily identify the snapshot later.

    The creation process begins. If there are active executions when you attempt to create the snapshot, the process waits until the executions are complete before creating the snapshot. You can see the status of executions in the Deployment executions widget.

    The snapshot is saved as a ZIP file and is shown in the Snapshots table with details of its creator, creation date and time, and current status.

*   Restoring a Snapshot

    If you are restoring a snapshot from a Cloudify Manager instance prior to version 4.0, refer to the [Restoring Snapshots of Legacy Cloudify Manager Instances]({{< relref "working_with/console/system-resources-page.md#restoring-snapshots-of-legacy-cloudify-manager-instances" >}}) section below.

    If you restore a snapshot to a Cloudify Manager instance that already contains data, that data is overwritten. To prevent inadvertent overwriting of existing data, you must explicity state that you want to force data overwrite.

    1.  Click **Upload** in the Snapshots widget.
    1.  Either enter the URL of the snapshot or select the snapshot file from your file repository.
    1.  Enter the Snapshot ID.
    1.  Click **Upload**.
    1.  To restore a snapshot from a tenant-less (legacy) environment, toggle the relevant button.
        *   If your snapshot is from a Cloudify Manager instance that was created earlier than version 4.0, see [Restoring Snapshots of Legacy Cloudify Manager Instances]({{< relref "working_with/console/system-resources-page.md#restoring-snapshots-of-legacy-cloudify-manager-instances" >}}).
        *   To overwrite all content in the existing Cloudify Manager, toggle the relevant button.
    1.  The snapshot is restored and its details appear in the Snapshots table.

*   Deleting a Snapshot

    1.  In the Snapshots widget, click ![Delete]( /images/ops_guides/delete.icon.png ) for the snapshot entry that you want to delete.
    1.  Click **Yes** to delete the snapshot from Cloudify Manager.


## Role-Based Access Management

There are three widgets in this section: User management, Tenants Managements, User Groups Management.

1. User management

    Allows creating users and editing their profiles, set password, set roles, and edit user's group and tenants.

    *   Adding Users to a Tenant

        1.  In the User Management widget, click the List icon on the far right of the user entry in the table that you want to add to a tenant.
        1.  Click **Edit user's tenants**.
        1.  Select one or more tenants from the dropdown list and click **Save**.
        1.  The user is added to the specified tenants.

        Unless the user has a deactivated status, they can perform actions on the tenant according to their role and the configuration privileges specified by the admin.

    *   Removing a User from a Group or Tenant

        You can remove a user from a group or a tenant, without deleting them from the system. A user can be removed in two ways.

        *   In the User Management widget, click the List icon of the user that you want to remove and select **Edit user's groups** and click **Save**.
        *   In the Tenant's Management widget, click the List icon of the tenant from which you want to remove a user and select **Edit users**. Select the user to remove and click **Save**.

        The user is removed. If a user is a member of one or more user groups that are still assigned to a tenant, that user remains active on the tenant.

        ![User Management Menu]( /images/ops_guides/usermgmt.menu.png )

1. Tenant Management

    Allows creating, editing and deleting tenants, add users and user groups to tenant.

    ![Tenant Management Menu]( /images/ops_guides/tenantmgmt.menu.png )

1. User Groups Management

    Allows creating, editing and deleting user groups, add users and tenants to group.

    *   User Management via an LDAP System
        To integrate with an external user management system, you must first ensure that Cloudify Manager is configured accordingly. This can be achieved during the bootstrapping process, or you can run the following command on a Cloudify Manager instance on which no actions have been performed (a clean machine.)
    *   Adding User Group to a Tenant

        1.  In the User Groups Management widget, click the List icon on the far right of the user group entry in the table that you want to add to a tenant.
        1.  Click **Edit group's tenants**.
        1.  Select one or more tenants from the dropdown list and click **Save**.
        1.  The user group is added to the specified tenants.

        All users within the group, unless they have a deactivated status, can perform actions on the tenant according to their role and the configuration privileges specified by the `admin`.

        ![User Group Management List]( /images/ops_guides/usergrpmgmt.list.png )