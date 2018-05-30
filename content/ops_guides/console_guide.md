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

All of the things that can be done in the Cloudify Console can also be done using the CLI and the REST API. More information can be found in [ http://docs.getcloudify.org/](http://docs.getcloudify.org/4.0.0)

## Logging into the Console

To login to the Cloudify Console you need to use a browser on your laptop or PC and enter in the URL of the Cloudify manager IP address or hostname, for example [https://192.168.0.1/#/login](https://192.168.0.1/#/login). Then enter your username and password in order to login to the system.

![Cloudify Console login]( /images/ops_guides/login.png )

When you successfully login to the Cloudify Console, you see the Cloudify Console dashboard.

![Cloudify Console dashboard]( /images/ops_guides/dashboard.tiles_executions.png )

## Uploading a Blueprint

* From the blueprints catalog

    To upload a blueprint from the blueprints catalog:

    1. Go to "Blueprints Catalog", select the required blueprint, and click "Upload".

    ![Upload from Blueprint Catalog]( /images/ops_guides/blueprintscatalog.tiles.png )

    1. Enter the blueprint name and select filename of the blueprint:

    ![Local Blueprints - Upload yaml]( /images/ops_guides/localblueprints.upload.yaml.png )

    1. Click "Upload".

    The blueprint is copied from "Blueprints catalog" to local blueprints.

    ![Local Blueprints - Upload Drupal]( /images/ops_guides/localblueprints.drupal.png )

* From the local host

    To upload a blueprint from the local host:

    1. Go to "Local Blueprints" and click "Upload".
    
    ![Upload blueprint to local blueprints]( /images/ops_guides/localblueprints.upload.button.png )

    1. Click in the field to select a blueprint package file.

    ![Select package file]( /images/ops_guides/localblueprints.upload.selectpackage.png )

    1. Browse to the blueprint archive.

    ![Browse to the blueprint archive]( /images/ops_guides/windowsexplorer.openblueprint.png )

    1. Enter the blueprint name and select filename of the blueprint:

    ![Local Blueprints - Upload yaml]( /images/ops_guides/localblueprints.upload.yaml.png )

    1. Click "Upload".

The blueprint is copied to local blueprints.

![Local Blueprints - Upload simple]( /images/ops_guides/localblueprints.simple-example.png )

*   **From the Internet resource**

    To upload a blueprint archive that is located in the Internet:

    1. Go to "Local Blueprints" and click "Upload".
    
    ![Upload blueprint to local blueprints]( /images/ops_guides/localblueprints.upload.button.png )

    1. Enter the URL of the blueprint archive.

    ![Upload blueprint from URL]( /images/ops_guides/localblueprints.upload.url.png )

    1. Enter the blueprint name and select filename of the blueprint:

    ![Local Blueprints - Upload yaml]( /images/ops_guides/localblueprints.upload.yaml.png )

    1. Click "Upload".

The blueprint is copied to local blueprints.

![Local Blueprints - Upload hello world]( /images/ops_guides/localblueprints.helloworld.png )

1. Deleting blueprint

Before deleting a blueprint all deployments based on the blueprint should be uninstalled and deleted.

To delete the blueprint just click on Delete button on the blueprint

![]( /images/ops_guides/.png )

## Customer Deployments

1. Creating a Deployment

To create a new deployment click on the "Deploy" button in the bottom right corner of blueprint in "Local Blueprints" (see previous section on uploading a blueprint).

![]( /images/ops_guides/.png )

![]( /images/ops_guides/.png )

A form with fields of inputs should pop up that need to be filled in before the deployment can be created. The first field is the name of the deployment and this needs to be a unique name given to this one deployment, it is usually something that relates the customer to a blueprint name (i.e. radius-city-west). The following fields will vary in number and name and are automatically generated based on the inputs of the blueprint (see section on blueprints to understand blueprint inputs).

Once the deployment has been created it should appear as one of the deployments in the deployments section (as shown below).

![]( /images/ops_guides/.png )

To get detailed information about the deployment click on it. By default, the page contains seven widgets, but you can edit it and add or remove widgets. The widgets are as follows:

*   **Topology**: shows the graphical topology of the deployment

![]( /images/ops_guides/.png )

*   **Nodes**: shows the nodes in the deployment

![]( /images/ops_guides/.png )

*   **Executions**: shows what workflows have been executed against the deployment

![]( /images/ops_guides/.png )

*   **Deployment** I**nputs & Deployment Outputs**: shows the inputs that given to the blueprint in order to create this deployment and any outputs that may have been created as a part of the install workflow

![]( /images/ops_guides/.png )

*   **Source**: shows the source of the blueprint

![]( /images/ops_guides/.png )

*   **Deployment Events & Logs**: shows events and logs of executions

![]( /images/ops_guides/.png )

*   **Monitoring**: shows the performance monitoring metrics if they have been configured for the deployment. See next section on setting up the dashboard for monitoring to work properly with your selected deployment.

    

![]( /images/ops_guides/.png )

1. Installing a Deployment

To actual install a deployment into the network, we need to run an "install" workflow against the deployment. It can be done by clicking to the "Execute workflow" button on the right hand side of the deployment menu and then click to the "Install".

![]( /images/ops_guides/.png )

![]( /images/ops_guides/.png )


The progress of the Install execution is showing in "Deployment Executions", "Deployments Events" and "Deployments Logs" widgets of the deployment page. See next screenshot:

![]( /images/ops_guides/.png )

1. Configuring the dashboard

As per the above mention of the monitoring widget for a deployment, you may need to load a customized deployment widget in order to display the performance metrics properly for your deployment. By default the standard widget displays operating system metrics (CPU, Disk, Memory, Network IO) however while this might make sense for a VNF it will not display the performance metrics of the SDN services for example.
In order to show the correct data you will need to load the custom widget.

Select edit mode:

![]( /images/ops_guides/.png )

Add widgets:

![]( /images/ops_guides/.png )

Add one timer widget (It is support widget for metrics widgets):

![]( /images/ops_guides/.png )


For every collector add Deployment metric graph:

![]( /images/ops_guides/.png )

Select a metric from pre-defined:

![]( /images/ops_guides/.png )


Once loaded the correct performance statistics should be display similar to the screen capture below.



![]( /images/ops_guides/.png )

![]( /images/ops_guides/.png )

1. Uninstalling a Deployment

Similar to installing a deployment, uninstalling a deployment is just running the "uninstall" workflow against the deployment. Deployments should be uninstalled before deleting.

1. Other workflows

Other workflows like Scale Up/Down or Heal are shown in the "execute workflow" menu but may not necessarily have anything implemented in the nodes to act on that workflow. By default, all blueprints should implement the install and uninstall workflows, but other workflows will depend on the nodes and their associated plugins supplied for the blueprint.

1. Deleting a Deployment

In order to delete a deployment the deployment should first be "uninstalled". Once uninstall the deployment can be deleted by clicking the "Delete deployment" button.

![]( /images/ops_guides/.png )

1. Logs & Events

The "Logs & Events" widget gives the operator the ability to search for errors and debug services and it is located on each deployments page

![]( /images/ops_guides/.png )


Further details on a line item can be seen by click on the message (especially error messages where further debugging information is revealed by clicking on the top level message).

Events and Logs Filter widget

Displays a filter pane for events and logs.

![]( /images/ops_guides/.png )

## System resources

1. Plugins

By default, [plugins ](http://docs.getcloudify.org/4.3.0/plugins/overview/)are tenant-specific, meaning that a blueprint on one tenant cannot access a plugin on a different tenant. You can also set a plugin as global when you upload it to the manager. The Plugins table lists the plugins are available to the current tenant.

![]( /images/ops_guides/.png )

*   Uploading a Plugin
1.  Click **Upload** above the Plugins table.
1.  Either enter the URL of the wagon or select the wagon file from your file repository.
1.  Either enter the URL of the plugin yaml file or select the plugin yaml file from your file repository.
1.  Click **Upload**.
The plugin details appear in the Plugins table.
1. Snapshots

The Snapshots table provides a list of all snapshots that have been uploaded or created. The Snapshots table is only available if you have `admin `credentials.

The snapshots creation process captures data in the entire Cloudify Manager, not just that of a specific tenant. However, the snapshot is created in the context of the current tenant, and therefore must be restored from it. Snapshots are created as a private resource by default and it cannot change.

![]( /images/ops_guides/.png )

*   Creating a Snapshot
1.  Click **Create** above the Snapshots table.
1.  Specify a unique ID for the snapshot and click **Create**.
It is good practice to use a name that will help you to easily identify the snapshot later.

    The creation process begins. If there are active executions when you attempt to create the snapshot, the process waits until the executions are complete before creating the snapshot. You can see the status of executions in the Deployment executions widget.

    The snapshot is saved as a ZIP file and appears in the Snapshots table, together with details of its creator, creation date and time, and current status.

*   Restoring a Snapshot

    If you are restoring a snapshot from a Cloudify Manager instance prior to version 4.0, refer to the [Restoring Snapshots of Legacy Cloudify Manager Instances](http://docs.getcloudify.org/4.3.0/manager_webui/plugins-snapshots-page/#restoring-snapshots-of-legacy-cloudify-manager-instances) section below.

    If you restore a snapshot to a Cloudify Manager instance that already contains data, that data is overwritten. To prevent inadvertent overwriting of existing data, you must explicity state that you want to force data overwrite.

1.  Click **Upload** in the Snapshots widget.
1.  Either enter the URL of the snapshot or select the snapshot file from your file repository.
1.  Enter the Snapshot ID.
1.  Click **Upload**.
1.  To restore a snapshot from a tenant-less (legacy) environment, toggle the relevant button.
    *   If your snapshot is from a Cloudify Manager instance that was created earlier than version 4.0, see [Restoring Snapshots of Legacy Cloudify Manager Instances](http://docs.getcloudify.org/4.3.0/manager_webui/plugins-snapshots-page/#restoring-snapshots-of-legacy-cloudify-manager-instances).
    *   To overwrite all content in the existing Cloudify Manager, toggle the relevant button.
1.  The snapshot is restored and its details appear in the Snapshots table.
*   Deleting a Snapshot
1.  In the Snapshots widget, click 

![]( /images/ops_guides/.png )
 for the snapshot entry that you want to delete.
1.  Click **Yes** to delete the snapshot from Cloudify Manager.
1. Secret Store Management

Secret storage provides a tenant-wide variable store for data that you do not want to expose in plain text in Cloudify blueprints, such as login credentials for a platform.

![]( /images/ops_guides/.png )

## Tenant Management

There are three widgets in this section: "User management", "Tenants Managements", "User Groups Management".

1. User management

Allows creating users and editing their profiles, set password, set roles, and edit user's group and tenants

*   Adding Users to a Tenant
1.  In the User Management widget, click the List icon on the far right of the user entry in the table that you want to add to a tenant.
1.  Click **Add to tenant**.
1.  Select one or more tenants from the dropdown list and click **save**…
1.  The user is added to the specified tenants.
Unless the user has a deactivated status, they can perform actions on the tenant according to their role and the configuration privileges specified by the admin.
*   Removing a User from a Group or Tenant

        You can remove a user from a group or a tenant, without deleting them from the system. A user can be removed in two ways.

*   In the User Management widget, click the List icon of the user that you want to remove and select **Edit user's groups** and click **Save**.
*   In the Tenant's Management widget, click the List icon of the tenant from which you want to remove a user and select **Edit users**. Select the user to remove and click **Save**.

        The user is removed. If a user is a member of one or more user groups that are still assigned to a tenant, that user remains active on the tenant.

![]( /images/ops_guides/.png )

1. Tenants Managements

Allows creating, editing and deleting tenants, add users and user groups to tenant

![]( /images/ops_guides/.png )

1. User Groups Management

Allows creating, editing and deleting user groups, add users and tenants to group

*   User Management via an LDAP System

        To integrate with an external user management system, you must first ensure that Cloudify Manager is configured accordingly. This can be achieved during the bootstrapping process, or you can run the following command on a Cloudify Manager instance on which no actions have been performed (a clean machine.)

*   Adding User Group to a Tenant
1.  In the User Groups Management widget, click the List icon on the far right of the user group entry in the table that you want to add to a tenant.
1.  Click **Add group to tenant**.
1.  Select one or more tenants from the dropdown list and click **save**..
1.  The user group is added to the specified tenants.
All users within the group, unless they have a deactivated status, can perform actions on the tenant according to their role and the configuration privileges specified by the `admin`.

![]( /images/ops_guides/.png )