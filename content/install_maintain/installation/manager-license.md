---
layout: bt_wiki
title: Activating Cloudify Manager and License Management
category: Installation
draft: false
weight: 160
---
A new license mechanism was introduced as part of Cloudify 4.6.
From 4.6 on, in order to activate a Cloudify Premium Manager, a valid license is required.
Before the Cloudify Manager is activated, most of the Cloudify REST APIs are blocked, and neither Cloudify CLI nor Cloudify Console are operational.
Cloudify community version does not require a license, hence no activation is needed.

# Product Activation

A Cloudify license is provided to all Cloudify Premium subscribed customers by Cloudify support.
Cloudify Premium trial customers receive their trial licnse via email upon trial request.
Request your free 60 day trial at https://cloudify.co/download/#trial.
To activate your Cloudify manager submit your license through either the Cloudify management console (UI) or via the Cloudify CLI.

{{% note title="Activate Permissions" %}}
Only admin users (users with sys_admin system role) are allowed to upload a license and activate the Manager.
{{% /note %}}

## Cloudify CLI

You can upload a license and activate the product by using the following command:

{{< highlight bash >}}
cfy license upload <license-path>
{{< /highlight >}}

## Cloudify Console

When you log in for the first time, you will see the following screen:
 
![first login screen]( /images/ui/license/first-login-screen.png )

**Go to app** button will be disabled until you activate the product by uploading a valid license.
 
To activate the Manager:

1. Paste your licens into the text area.
1. Click on the **Update** button.
1. After the license was successfully uploaded you can See all it's details on the screen, and **Go to app** button is enabled.
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
| customer123 | 2019-11-24 00:00:00.000  |      Spire      | False |       4.6        | HA,Awesomeness |  False  |
+-------------+--------------------------+-----------------+-------+------------------+----------------+---------+
{{< /highlight >}}

### Cloudify Console

There are two possible ways to view the license details in the Cloudify Console:

#### Users menu - License Management option

{{% note title="Access to License Management option" %}}
Only users with sys_admin permissions have access to License Management option under the users menu.
{{% /note %}}

1. Click on **License Management** option under users menu:

    ![users menu - license management option]( /images/ui/license/users-menu-license-management-option.png )

1. See **License Management** page with license details:

    ![valid license]( /images/ui/license/valid-license.png )

#### Help menu - About option

1. Click on **About** option under the help menu:

    ![help menu - about option]( /images/ui/license/help-menu-about-option.png )

1. See version and license details:

    ![about modal]( /images/ui/license/about-modal.png )
 

## License Expiration

When a trial license is expired the REST API, Cloudify CLI and Cloudify Console will stop being operational.
License Edition and tag (Expired or Trial) can be viewed in Cloudify Console at the upper left part of the screen:

* Valid trial license, edition: 'Spire'

    ![trial license tag]( /images/ui/license/trial-license-tag.png )

* Expired license, edition: 'Spire'

    ![expired license tag]( /images/ui/license/expired-license-tag.png )

## License Update

You can always see the license details, current license status and upload a new license (instead of the current one)

{{% note title="Update Permissions" %}}
Only users with sys_admin permissions are allowed to update licenses.
{{% /note %}}

{{% note title="Update Permissions" %}}
There can only be one license on a Manager at any given time.
{{% /note %}}

### Cloudify CLI
 
You can upload a new license (instead of the current one) using the following command:

{{< highlight bash >}}
cfy license upload <license-path>
{{< /highlight >}}

### Cloudify Console

To update license from Cloudify Console follow these steps:

1. Click on **License Management** option in users menu:

    ![users menu - license management option]( /images/ui/license/users-menu-license-management-option.png )

1. Click on **Edit License** button:

    ![expired license]( /images/ui/license/expired-license.png )

1. Paste license key into text area.
1. Click **Update** button.
1. See all license details on the screen after successful update. 
