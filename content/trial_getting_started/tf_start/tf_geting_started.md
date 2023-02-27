+++

title = "Upload a Terraform Module"
description = "Upload a Terraform module and install it."
weight = 27
alwaysopen = false
+++

The following Getting Started guide will explain how to import a Terraform module and install it. In the example, we will use the existing Cloudify [GitHub repo](https://github.com/cloudify-community/tf-source) with several Terraform modules. Import [public_vm](https://github.com/cloudify-community/tf-source/tree/main/template/modules/public_vm) Terraoform module. The module provisions EC2 with EIP on AWS.

## Prerequisites
* Terraform module archive available from a URL
* Credentials to AWS. AWS credentials can be created by following the guide [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)


## Overview
In this guide we'll go through the following steps to upload a Terraform module and test it.

* Provide a URL to the GitHub Terraform module repo and chose the right module
* Define the Terraform variables for the Terraform module
* Provision the Terraform module


## Step 1: Open the Upload the Terraform Module Dialog
Go to the Blueprints page and from the `Upload` dropdown select the **Upload from Terraform module**.
You should see the **Create blueprint from the Terraform dialog**.

* Type in that dialog the name
* Select the Terraform version that you would like to use

## Step 2: Provide a URL to the GitHub Terraform Modules Repository
Provide a URL to the GitHub repository containing the Terraform module.

For this example, we will use the Cloudify repository: `https://github.com/cloudify-community/tf-source.git`

* The folder structure of the archive should start with a single root folder, This root folder can contain the Terraform module, or subfolders with multiple modules
* Another option is to provide a URL to a ZIP or upload a ZIP from a local drive

![Define Terraform Module Path]( /images/trial_getting_started/tf/Tf_Path.png )


## Step 3: Select a Module and Autoupload Variables
* Click on the **Terraform module folder**. The dropdown contains all the Terraform modules presented in the git repository. Select **template/modules/public_vm**
* Once the **template/modules/public_vm** module is selected, the dialog will scan the module for Terraform variables and outputs and will suggest how to populate them automatically.


![Terraform Module Variables autodetect]( /images/trial_getting_started/tf/TF_Varialbes_Autoupload.png )

## Step 4: Define the Varialbes
* Provide values for access_key & secret_key with aws_access_key_id, and aws_secret_access_key. The AWS credentials can be created by following the guide [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey). As AWS credentials are sensitive data, we would like to store them as encrypted data in the secret store. 
  * Select the **Secret** as the source 
  * Provide a name as it will be stored in the secret store
  * In the value put the secret value
* For the rest variables leave the source as Input and provide the values as listed below

![Define Terraform Module Outputs]( /images/trial_getting_started/tf/Variables.png )


## Step 5: Define the Outputs and Capabilities of the Blueprint
The outputs of the Terraform module can be made available in the outputs and capabilities in Cloudify.

* Expand the outputs section and validate
![Define Terraform Module Outputs]( /images/trial_getting_started/tf/Outputs.png )


## Step 6: Create the Blueprint
Submit the dialog, errors discovered will appear in the dialog. After successful submission, you will be forwarded to the create deployment modal.

## Step 7: Create a Deployment and Test the Blueprint
* Provide a deployment name to be created
* Review the input values, which you can change if needed
* Click **Install** to provision the Terraform modal. You'll be forwarded to the deployment page

## Step 8: Explore the Deployment
* In the last execution tab, you can track the provisioning progress and see the logs
* The Deployment Info tab provides general information about the provisioned resources and the deployments