+++
title = "Cloudify as a Service"
description = "Try our hosted Cloudify service"
weight = 8
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

Cloudify trial as a service is the fastest and easiest way to try Cloudify.
You will be getting access to the Cloudify trial managed service which is hosted and managed by Cloudify. Follow the instructions on this page to get your trial account provisioned and gain access to our trial service.

Please note that while the Cloudify service requires no deployment or hardware, if you wish to gain the most from your trial you will need access to some cloud infrastructure (e.g. AWS, Azure, GCP) to integrate with and run your test workloads.

### Step 1: Request a Cloudify trial account

To start using Cloudify hosted service, a dedicated account must be created for you.
If you have already requested an account and received the details via email please continue to step 2.

Request your Cloudify trial account [here](https://cloudify.co/download/)

Once you submit the account request form, your request is immediately processed by our system and you should expect an email from the Cloudify team within minutes. Your email will contain an activation link as well as other registration information.


### Step 2: Activate your Cloudify trial and Login

Follow the activation link in your email to your dedicated trial management page. This page Shares the account provisioning progress, the trial remaining time and login information (which is also available in the email you received).

The activation will take place automatically once you click the link. It takes a few minutes to initialize your account and a progress bar will indicate when the account is ready. You will also receive a confirmation email when the account is ready.

Note! Once the activation started it will complete even if you leave the page during the process.

Once initialization is complete, the page content will automatically refresh and share your account details including:

* A link to your trial manager login page.
* Your initial login credentials.

Follow the link. Cloudify login page should be displayed.

![login-page.png]( /images/ui/login/login-page.png )

Use the supplied initial credentials to login.

#### Congratulations! you now have your Cloudify manager ready.


### Step 3: (Optional) - Setup your command line interface (CLI)

Cloudify offers multiple user interfaces. All orchestration actions can be performed from the Management Console UI you have logged into in Step 2, however in many cases a CLI access from your Mac, Windows, or Linux station is easier.

Follow [these]({{< relref "/install_maintain/installation/installing-cli.md" >}}) instructions to deploy your CLI.


____


What's next?

<<<<<<< HEAD
* Go ahead and examine our **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})** to learn about Cloudify basics.
=======
* To run your first multi cloud examples on AWS, Azure, GCP and OpenStack using the native Cloudify plugins as well as Cloud Formation, Azure ARM and Ansible plugins refer to the  **[example based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}})**.
* To run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS or AKS refer to the  [Kubernetes reference guide ]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).
* Optional: To manage your installation using the command line utility refer to the [local CLI guide] ({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}})
>>>>>>> master
