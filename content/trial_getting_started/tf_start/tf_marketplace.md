+++

title = "Upload Terraform Blueprints from the Marketplace"
description = "Upload a Terraform module from Cloudify Marketplace and install it."
weight = 28
alwaysopen = false
+++

The Getting Started guide to uploading and deploying Terraform based blueprints from the marketplace.

## Prerequisites
* Terraform module archive available from a URL
* Credentials to AWS. AWS credentials can be created by following the guide [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)


## Overview
In this guide we will go through the following steps to upload a blueprint based on Terraform from the marketplace and test it.

* Upload the Blueprint to the Cloudify Manager
* Test the uploaded blueprint by creating a deployment and installing it

## Step 1: Upload the Blueprint
There are several places where you can enter the Marketplace Terraform section.

* Dashboard -> Run Terraform module button
* Blueprints page -> Run Terraform module button
* Blueprints page -> Upload button -> Upload from the marketplace, select the **Terraform** tab

Click the upload button, after the upload is finished you'll be forwarded to the blueprint's page.


![Terraform Marketplace]( /images/trial_getting_started/tf/TtMarketplace.jpg )


## Step 2: Test the Blueprint by Creating a Deployment and Installing it
* Click the Create Deployment button
* Review the inputs in the Deployment Creation dialog
* You should be prompted to define the credentials to the cloud as secrets, those will be propagated to the Terraform module. AWS credentials can be created by following the guide [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)

![Terraform Marketplace]( /images/trial_getting_started/tf/TtMarketplace.jpg )


## Step 3: Verify the Installation
* Inspect the install workflow execution graph until it's finished. The bars of the execution graph will turn green when operations will finish
* Review the logs section on the deployment page
* Click the Deployment info tab and review the outputs section, There you will find the outputs of the Terraform module defined in the blueprint


![Terraform Marketplace]( /images/trial_getting_started/tf/TfInstall.jpg )
