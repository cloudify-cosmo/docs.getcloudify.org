+++
title = "Getting Started Wizard"
description = "Getting started wizard"
weight = 97
alwaysopen = false
+++

OK, so you have your {{< param cfy_manager_name >}} setup ready. When you login to the {{< param cfy_manager_name >}} for first time a getting started wizard is presented.
Note: The wizard will be shown only for admin users as it requires installing plugins, secrets and blueprints.

![1_getting_started.png]( /images/getting_started/1_getting_started.png )

The wizard will assist you with setting up your {{< param cfy_manager_name >}} with installing plugins, secrets and blueprints. 

You can select multiple technologies and install all the required resources at once.

Find below the supported technologies, you can find out what resources are installed as part of it by clicking on each one of them:

* [AWS]({{< relref "/trial_getting_started/getting_started_wizard/aws.md" >}})
* [GCP]({{< relref "/trial_getting_started/getting_started_wizard/gcp.md" >}})
* [Openstack v3]({{< relref "/trial_getting_started/getting_started_wizard/openstack.md" >}})
* [Azure]({{< relref "/trial_getting_started/getting_started_wizard/azure.md" >}})
* [vCloud]({{< relref "/trial_getting_started/getting_started_wizard/vcloud.md" >}})
* [vSphere]({{< relref "/trial_getting_started/getting_started_wizard/vsphere.md" >}})
* [Terraform on AWS]({{< relref "/trial_getting_started/getting_started_wizard/terraform_on_aws.md" >}})
* [Ansible on AWS]({{< relref "/trial_getting_started/getting_started_wizard/ansible_on_aws.md" >}})

In the main window you will have an option to select one or many technologies and continue by pressing the `Next` button.

![2_getting_started_technologies.png]( /images/getting_started/2_getting_started_technologies.png )

If your selection requires secrets you'll be promoted to a step to set up secrets. If you selected more than one technology you might have a several steps to set up the secrets.

To continue you'll need to feel all the required fields and continue by pressing the `Next` button.

![3_getting_started_aws_secrets.png]( /images/getting_started/3_getting_started_aws_secrets.png )

In the end you'll be shown a summary to review the changes that will be applied, to confirm press `Finish` button.


![4_getting_started_summary.png]( /images/getting_started/4_getting_started_summary.png )

If the secrets you are setting up already exists the summary will notify that they will be updated.

![4_1_getting_started_summary_secret_update.png]( /images/getting_started/4_1_getting_started_summary_secret_update.png )

In case the resources already exists it will be reflected in the summary step with the green check mark near by the installed resource.

![4_2_gettinng_started_preinstalled_resources.png]( /images/getting_started/4_2_gettinng_started_preinstalled_resources.png )
 
Once you confirm you'll be promoted to the installation phase. The progress bar will be shown in the bottom of the step.

When the bar shows 100% you can close the window and you are ready to create your first deployment.

![6_getting_started_status_complete.png]( /images/getting_started/6_getting_started_status_complete.png )

You can close the wizard and and proceed to create your first deployment.

## Disable Getting started Wizard
The getting started wizard will pop up each time you log in. In case you want to disable it you have two options.

The first option is by checking the box `Don't show next time` inside the wizard. Either you close the wizard or finish the flow with the checkbox the wizard won't appear the next time.

![7_getting_started_dont_show_next_time.png]( /images/getting_started/7_getting_started_dont_show_next_time.png )

## Enable Getting started wizard
The getting started wizard can be enabled or disabled through the user management widget as well.

To enable the getting started wizard please navigate to user management and check the box in the `Getting Started` column for a relevant user.

![8_getting_started_enable_wizard.png]( /images/getting_started/8_getting_started_enable_wizard.png )
