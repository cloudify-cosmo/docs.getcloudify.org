---
layout: bt_wiki
title: Activating Cloudify Manager and License Management
description: Learn how to activate a Cloudify Premium/Spire license and activate it.
category: Installation
draft: false
weight: 6
---
From Cloudify v4.6 on, in order to activate a Cloudify Premium Manager, a valid license is required.
Before the Cloudify Manager is activated, most of the Cloudify REST APIs are blocked, and neither Cloudify CLI nor {{< param cfy_console_name >}} is operational.
Cloudify community version does not require a license, hence no activation is needed.
If Cloudify is deployed as a cluster of managers, the license should only be applied once. This should be done through the active manager in that cluster.

# Product Activation

A Cloudify license is provided to all Cloudify Premium subscribed customers by Cloudify support.
Cloudify Premium trial customers receive their trial license via email upon trial request.
Request your free 60 day trial at https://cloudify.co/download/#trial.
To activate your Cloudify manager submit your license through either the {{< param cfy_console_name >}} (UI) or via the Cloudify CLI.

{{% note title="Activate Permissions" %}}
Only admin users (users with sys_admin system role) are allowed to upload a license and activate the Manager.
{{% /note %}}

## Cloudify CLI

You can upload a license and activate the product by using the following command:

{{< highlight bash >}}
cfy license upload <license-file-path>
{{< /highlight >}}

## {{< param cfy_console_name >}}

When you log in for the first time, you will see the following screen:

![first login screen]( /images/ui/license/first-login-screen.png )

**Go to app** button will be disabled until you activate the product by uploading a valid license.

To activate the Manager:

1. Paste your licens into the text area.
1. Click on the **Update** button.
1. After the license was successfully uploaded you can see all it's details on the screen, and **Go to app** button is enabled.
1. Click **Go to app** button to go to the main application page.

# License Management

You can always check installed licenses details or upload a new license.

## License View

### Cloudify CLI

You can check installed license details using the following command:

{{< highlight bash >}}
cfy license list
{{< /highlight >}}

The output of the command would be similar to the following:

{{< highlight bash >}}
Cloudify License
+-------------+--------------------------+-----------------+-------+------------------+----------------+---------+
| customer_id |     expiration_date      | license_edition | trial | cloudify_version |  capabilities  | expired |
+-------------+--------------------------+-----------------+-------+------------------+----------------+---------+
| customer123 | 2019-11-24 00:00:00.000  |      Spire      | False |       4.6        |                |  False  |
+-------------+--------------------------+-----------------+-------+------------------+----------------+---------+
{{< /highlight >}}

### {{< param cfy_console_name >}}

There are two possible ways to view the license details in the {{< param cfy_console_name >}}:

#### Users menu - License Management option

{{% note title="Access to License Management option" %}}
Only users with sys_admin permissions have access to License Management option under the users menu.
{{% /note %}}

1. Click the **License Management** option under the users menu:

    ![users menu - license management option]( /images/ui/license/users-menu-license-management-option.png )

1. The **License Management** dialog containing the license details will be displayed:

    ![valid license]( /images/ui/license/valid-license.png )

#### Help menu - About option

1. Click the **About** option under the help menu:

    ![help menu - about option]( /images/ui/license/help-menu-about-option.png )

1. The **About** dialog containing the license details will be displayed:

    ![about modal]( /images/ui/license/about-modal.png )


## License Expiration

When the license expires, the Cloudify manager will display a notification specifying the new state.
When using a trial license, upon license expiration, all Cloudify manager functionality will cease until it is updated with a valid license. This means that the REST API, Cloudify CLI and {{< param cfy_console_name >}} will not be functional.

* Valid trial license example, edition: 'Spire'

    ![trial license tag]( /images/ui/license/trial-license-tag.png )

* Expired license example, edition: 'Spire'

    ![expired license tag]( /images/ui/license/expired-license-tag.png )

## License Update

When the Cloudify subscription is renewed or updated with new capabilities a new license will be provided by Cloudify support. Updating the license can be applied through the CLI or the {{< param cfy_console_name >}}.

{{% note title="Update Permissions" %}}
Only users with sys_admin permissions are allowed to update licenses.
{{% /note %}}

{{% note title="Update Permissions" %}}
A single license may be active at any given time.
{{% /note %}}

### Cloudify CLI

You can upload a new license (instead of the current one) using the following command:

{{< highlight bash >}}
cfy license upload <license-path>
{{< /highlight >}}

### {{< param cfy_console_name >}}

To update the license from the {{< param cfy_console_name >}} follow these steps:

1. Click the **License Management** option in the users menu:

    ![users menu - license management option]( /images/ui/license/users-menu-license-management-option.png )

1. Click the **Edit License** button:

    ![expired license]( /images/ui/license/expired-license.png )

1. Paste the license key into text area.
1. Click the **Update** button.
1. The updated license details will be displayed in the License Management dialog.
