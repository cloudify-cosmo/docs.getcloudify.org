+++
title = "QCOW2 Image (OpenStack)"
description = "QCOW2 Image (OpenStack)"
weight = 50
alwaysopen = false
+++

## Overview

A {{< param cfy_manager_name >}} is a compute host that runs the {{< param product_name >}} Management services. To help you get running with {{< param cfy_manager_name >}} easily, {{< param product_name >}} provides images of the {{< param cfy_manager_name >}} for OpenStack.

You can create an OpenStack instance with the OpenStack QCOW file. Images include the pre-installation of {{< param cfy_manager_name >}} and its dependencies.

{{% note title="Prerequisites" %}}
Make sure that your environment meets the [prerequisites]({{< relref "cloudify_manager/community/capacity_and_planning.md" >}}) before you install the {{< param cfy_manager_name >}}.
{{% /note %}}

## Setup an Instance of a {{< param cfy_manager_name >}} Image

1. Go to the [{{< param product_name >}} download page]({{< ref "trial_getting_started/set_trial_manager/other-deployments.md#community-downloads" >}}) and select the {{< param product_name >}} Manager QCOW Image.
1. Go to your OpenStack cloud and launch an instance based on the image you downloaded:
   1. Go to **Compute** > **Images** and click **Create**.
   1. Enter the details of the image, including:
      * Image Source - Select **Image File** and click **Browse File** to browse to the QCOW2 image file.
      * Format - Select **QCOW2**.
   1. Configure the instance resources according to the [prerequisites]({{< relref "cloudify_manager/premium/aio/capacity_and_planning.md" >}}).
   1. Launch the instance.
   1. To verify that the {{< param cfy_manager_name >}} is installed after the instance is created and running, go to the {{< param cfy_console_name >}} at `http://<public_ip>`. Use this IP address as the manager IP address.
   1. The default username and password are _admin/ admin_.

1. To use {{< param cfy_manager_name >}} from the terminal using the [{{< param cfy_cli_name >}}]({{< relref "cloudify_manager/cloudify_cli/" >}}), run the following command with your instance details.

```
cfy profiles use <manager-ip> -u admin -p admin -t default_tenant
```

1. To change the `admin` password, run:

```
cfy users set-password admin -p <new-password>
```

1. To update the active CLI profile to use the new password, run:

```
cfy profiles use <manager-ip> -u admin -p <the-new-password> -t default_tenant
```
