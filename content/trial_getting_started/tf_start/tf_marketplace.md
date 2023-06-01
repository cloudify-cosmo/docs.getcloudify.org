+++

title = "Get Terraform Blueprints from the Marketplace"
description = "Get Terraform based blueprints from the marketplace"
weight = 28
alwaysopen = false
+++

Getting Started guide to uploading and deploying Terraform based blueprints from the marketplace.

This getting started guide introduces you to uploading and deploying Terraform-based blueprints from the {{< param company_name >}} Marketplace.

## Prerequisites
* {{< param cfy_manager_name >}} Version 6.4 or later
* Credentials to a cloud provider, such as AWS

## Overview

In this guide we will perform the following steps to upload and test a blueprint based on Terraform from the {{<param company_name>}} Marketplace.

* Upload the Blueprint to {{< param cfy_manager_name >}}
* Create a deployment to test the uploaded blueprint

## Uploading and deploying the blueprint

### Step 1: Upload the blueprint

There are several locations where you can find Terraform blueprints from the {{<param company_name>}} Marketplace:

* **Dashboard** > **Run Terraform module**
* **Blueprints** > **Run Terraform module**
* **Blueprints** > **Upload** > **Upload from Marketplace**

We will use the "Run Terraform module" button from the Blueprints page for this example. Select this option and click the upload button next to the "VM-Ubuntu-AWS-TFM" catalog item:

You will be taken to the deployment dialog once the blueprint has been uploaded to the {{< param cfy_manager_name >}}.

![Terraform Marketplace]( /images/trial_getting_started/tf/TtMarketplace.jpg )

### Step 2: Create a deployment and test the blueprint

Next, we will create a deployment from the uploaded blueprint and confirm that the end-to-end environment creation process is successful. Perform the following steps to create a new deployment:

1. Fill out any necessary Inputs (or leave them at their default values)
2. Click the "Install" button

The {{< param cfy_manager_name >}} will begin orchestrating all of the steps necessary to deploy a new environment from your blueprint. You can follow the progress of the installation by viewing the Execution Task Graph and the Deployment Events/Logs. The Execution Task Graph is a powerful feature that visualizes workflows and includes the ability to resume workflows from the point of failure.

![Terraform Install]( /images/trial_getting_started/tf/TfMarketplaceInstall.jpg )

### Step 3: Verify the installation

The final step in the deployment process is to verify that the installation was successful. Watch the Install workflow Execution Task Graph until it is finished. The bars of the graph will turn green as operations complete. 

Once the installation has finished, take some time to explore the following features on the deployment page:

* Navigate to the Deployment Info page and review the Outputs that were defined during blueprint creation. These correspond to the Terraform module's Outputs.
* Navigate to the Deployment Info page and review the Inputs. These represent the values that were provided to the {{< param cfy_manager_name >}} during deployment.

![Terraform Marketplace]( /images/trial_getting_started/tf/TfMarketplaceDeployment.jpg )
