+++
title = "ITOM Governance Integration"
description = "More information about ServiceNow application ITOM integration"
weight = 106
alwaysopen = false
+++

ServiceNow offers a suite of applications that help IT Operations Management.

One of the applications Cloud Configuration Governance which validate and remediate your cloud resource configuration properties.

for more references about the application you can check the following link : [CCG-Application Documentation](https://docs.servicenow.com/bundle/sandiego-it-operations-management/page/product/itom-governance/reference/cloud-configuration-governance.html)

Assuming you have the CCG-Application configured correctly with all the required components:

* Mid Server
* Cloud Accounts
* Connection Aliases

you should be able to define scan configurations and build custom policies and define violations and link them to remediation actions.

## Integration breakdown

Cloud Configuration Governance application contains a set of resource collectors [ AWS/Azure ] that will be triggered from the scan configuration setup, these collectors call specific REST apis based on the type of the resource to describe and fetch all the properties/settings that can be obtained and store the results inside servicenow tables, based on the stored settings you can build policies to report violations, then you can map each violation with remediation action [sub-flow]

## Cloudify Application Integration

In Cloudify application v2.5 we introduced integration with CCG application in the form of sub-flows that leverage the inputs that we get from CCG application in order to remediate the violation that will be detected based on the policy definition.

When you install Cloudify application it will include a custom table (x_clop2_cloudify_remediation_setups) which will contain an initial setup for all of the sub-flows defined in the application, there you should be able to link the flow with a config_name to use a specific Cloudify manager tenant to carry out the remediation -some sub-flows takes a value you can also modify that-.

we offer a set of pre-defined most used remediations for various violation types:

### Remediation of resources that is not strictly provisioned by Cloudify:

* AWS EC2-Instances:

  * Instance-Type
  * Instance-State
  * Instance-Policy
  * Instance-Enhanced-Monitoring

* Azure Virtual-Machines:

  * Machine-Size
  * Machine-State
  * Machine-VMInsights

* AWS S3 Buckets:

  * Server-Side-Encryption
  * Policy-Assignment

* AWS IAM Users:

  * Delete-User-Profile
  * Attach-Predefined-Policy

### Remediation of resources that is provisioned by Cloudify:

You can leverage a sub-flow that can interact with Cloudify deployments where you can trigger cloudify-workflows on deployments that were deployed using Cloudify given that you have a tag that contains the deployment-id.


## Videos

### Integration Explained

<iframe src="https://player.vimeo.com/video/780779950" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

### Extra Example

<iframe src="https://player.vimeo.com/video/780782197" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>