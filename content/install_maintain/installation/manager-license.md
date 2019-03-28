---
layout: bt_wiki
title: Activating Cloudify Manager and License Management
category: Installation
draft: false
weight: 160
---

Since Cloudify 4.6 to use Cloudify Premium version you need to have valid license - either paying license or trial license. 

Without valid license you are not able to access most of the Cloudify REST APIs and neither Cloudify CLI nor Cloudify Console is operational. 

# Product Activation

To activate Cloudify (make it operational), you need to have valid license key and to upload it using either Cloudify CLI or Cloudify Console.

{{% note title="Activate Permissions" %}}
Only users with sys_admin permissions are allowed to active the product.
{{% /note %}}

## Cloudify CLI

You can upload license key and activate the product using the following command:

{{< highlight bash >}}
cfy license upload <license-path>
{{< /highlight >}}

## Cloudify Console

When you log in for the first time, you will see the following screen:
 
![first login screen]( /images/ui/license/first-login-screen.png )

**Go to app** button will be disabled until you activate the product wiht valid license.
 
To activate the product:

1. Paste license key into text area.
1. Click **Update** button.
1. See all license details on the screen after successful update and **Go to app** button is enabled.
1. Click **Go to app** button to go to the main application page. 

# License Management

When your product has been activated, you can always check the license details, current license status and update the license.

## License View

### Cloudify CLI

You can check installed license details using the following command:

{{< highlight bash >}}
cfy license list
{{< /highlight >}}

When you have license uploaded, then the output would be similar to the following:

{{< highlight bash >}}
Cloudify License
+-------------+--------------------------+-----------------+-------+------------------+----------------+---------+
| customer_id |     expiration_date      | license_edition | trial | cloudify_version |  capabilities  | expired |
+-------------+--------------------------+-----------------+-------+------------------+----------------+---------+
| customer123 | 2019-11-24 00:00:00.000  |      Spire      | False |       4.6        | HA,Awesomeness |  False  |
+-------------+--------------------------+-----------------+-------+------------------+----------------+---------+
{{< /highlight >}}

### Cloudify Console

In Cloudify Console you can view license details in two different ways described below.

#### Users menu - License Management option

{{% note title="Access to License Management option" %}}
Only users with sys_admin permissions have access to License Management option in users menu.
{{% /note %}}

1. Click on **License Management** option in users menu:

![users menu - license management option]( /images/ui/license/users-menu-license-management-option.png )

1. See **License Management** page with license details:

![valid license]( /images/ui/license/valid-license.png )

#### Help menu - About option

1. Click on **About** option in help menu:

![help menu - about option]( /images/ui/license/help-menu-about-option.png )

1. See version and license details:

![about modal]( /images/ui/license/about-modal.png )
 

## License Expiration

After trial license expiration user will not be able to access most of the Cloudify REST APIs and neither Cloudify CLI nor Cloudify Console will be operational.

License Edition and tag (Expired or Trial) can be observed in Cloudify Console ath the bottom left part of the screen:

* Valid trial license, edition: 'Spire'

![trial license tag]( /images/ui/license/trial-license-tag.png )

* Expired license, edition: 'Spire'

![expired license tag]( /images/ui/license/expired-license-tag.png )

## License Update

When your product has been activated, you can always check the license details, current license status and update the license.

{{% note title="Update Permissions" %}}
Only users with sys_admin permissions are allowed to update license.
{{% /note %}}

### Cloudify CLI
 
You can update license using the following command:

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
