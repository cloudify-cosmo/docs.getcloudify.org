---
layout: bt_wiki
title: Manager Images
category: Blueprints
weight: 12000
---

It is possible to spin up a Cloudify Manager from a cloud image or import it
into your private cloud environment from an image file.

This greatly simplifies the installation process and reduces the need for
complex bootstrap process. However, the tradeoff is in the fact that the image
is less customizable during the installation process.

## AWS Images
AWS provides two ways to use 3rd party pre-provisioned cloud images:
[Shared AMI](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/sharing-amis.html)
and [Marketplace Images](https://aws.amazon.com/marketplace).

You should use a shared AMI if you are an experienced user, a developer or just
want full control of the initialized instance. In any other case, we recommend
using the AWS Marketplace.

### Shared AMI
Using the Shared AMI allows you to easily initialize new cloud instance from
within your AWS account. You can find links to our public AMIs on our
[Download Page](http://getcloudify.org/downloads/get_cloudify.html).

When initializing the instance from the shared AMI, consider the following:

* **Security Groups**: Should allow access on ports 80 and 443
* **Keypair**: Run the instance with a keypair you have the private key for, in
order to be able to SSH the image if needed
* **Instance Size**: Choose large enough instance in order to avoid slowdowns.
4+ GB of RAM is recommended.

### AWS Marketplace
More information will appear here as soon as the Cloudify images become
available on AWS Marketplace.

## OpenStack Images
More information will appear here as soon as we will release Cloudify OpenStack
images.

## Configuration
After your instance is up and running, the following procedure is needed in
order to configure the newly running instance:

1. Create a new deployment from the `CloudifySettings` blueprint. This
blueprint will be pre-installed in your Cloudify Manager.  You'll need to
provide a number of inputs, see the **Configuration inputs** reference below
for more info.
2. Run the install workflow from the newly created deployment.
3. Wait for the installation to be completed successfully. After installation
is done, your manager should be in the same state as if it were just
bootstrapped.

### Configuration inputs

* **agent_keypair_name**: The name of the keypair that will be generated for
Cloudify Agents
* **agent_security_group_name**: The name of the security group that will be
generated for Cloudify Agents
* **agents_user**: The username Cloudify will use in order to connect to the
Cloudify Agents
* **aws_access_key_id**: AWS access key ID to be used by Cloudify in order to
access the AWS API
* **aws_secret_access_key**: AWS secret access to be used by Cloudify in order
to access the AWS API

## Guide

To get running with a Cloudify Manager on your EC2 instance, see this [comprehensive tutorial](http://getcloudify.org/downloads/Running_Cloudify_Manager_on_EC2_with_AMI.pdf).
