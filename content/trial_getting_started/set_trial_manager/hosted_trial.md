+++
title = "Cloudify as a Service"
description = "Try our hosted Cloudify service"
weight = 8
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

{{< param cfy_caas >}} is the fastest and easiest way to try {{< param product_name >}}.
You'll get access to the {{< param product_name >}} trial manager service which is hosted and managed by {{< param company_name >}}. Follow the instructions below to get your trial account provisioned and gain access to our trial service.

**Note**: While the {{< param product_name >}} service requires no deployment or hardware, if you wish to gain the most from your trial you will need access to some cloud infrastructure (e.g. AWS, Azure, GCP) to integrate with and run your test workloads.

## Step 1: Request a {{< param cfy_caas >}} Trial Account

To start using {{< param cfy_caas >}}, a dedicated account must be created for you.
If you already requested an account and received the details via email please continue to step 2.

Request your {{< param product_name >}} trial account [here]({{<param cfy_caas_signup_link>}}).

Once you submit the account request form, your request is immediately processed by our system. Expect an email from the {{< param product_name >}} team within minutes. Your email will contain an activation link as well as other registration information.

## Step 2: Activate your {{< param product_name >}} Trial and Log In

Click the activation link in your email to your dedicated trial management page. This page shares the account provisioning progress, the trial remaining time, and login information (which is also available in the email you received).

The activation will take place automatically once you click the link. It takes a few minutes to initialize your account and a progress bar will indicate when the account is ready. You will also receive a confirmation email when the account is ready.

**Note**: Once the activation has started it will complete even if you leave the page during the process.

Once initialization is complete, the page content will automatically refresh and share your account details including:

* A link to your trial manager login page
* Your initial login credentials

Follow the link. The {{< param product_name >}} login page should be displayed. Use the supplied initial credentials to log in.

![login-page.png]( /images/ui/pages/login-page.png )

Congratulations! Your {{< param cfy_manager_name >}} is now ready to begin orchestrating your environments.

## Step 3: Install your First Deployment on your New {{< param cfy_manager_name >}}

Check out your new {{< param cfy_manager_name >}} by installing the [Local Hello-World Example Deployment]({{< relref "trial_getting_started/examples/local/local_hello_world_example.md" >}}). This is a great way to become familiar with the basic concepts of the {{< param cfy_manager_name >}}.

This example demonstrates how you can use {{< param product_name >}} to easily install a local HTTP server with a hello-world page on it.

## Step 4: (Optional) Setup your Command Line Interface (CLI)

{{< param product_name >}} offers multiple user interfaces. All orchestration actions can be performed from the Management Console UI (after completing step 2 login instructions). However, in many cases, a CLI access from your Mac, Windows, or Linux station is easier.

Follow [these]({{< relref "/trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli.md" >}}) instructions to deploy your CLI.

## Next Steps

Now that you have access to a {{< param cfy_manager_name >}} environment, we recommend performing some additional activities to become comfortable with {{< param company_name >}}. The following suggestions will get you started!

* Run your first multi-cloud example on AWS, Azure, GCP, and OpenStack using the native {{< param product_name >}} plugins as well as Cloud Formation, Azure ARM, and Ansible plugins by following the [example-based tutorials]({{< relref "trial_getting_started/examples/_index.md" >}}).
* Run your first Kubernetes service on OpenShift, KubeSpray, GKE, EKS, or AKS by following the [Kubernetes reference guide]({{< relref "working_with/official_plugins/orchestration/kubernetes" >}}).
* Manage your installation using the command line utility by reviewing the [local CLI guide]({{< relref "trial_getting_started/set_trial_manager/getting-started-with-cloudify-docker-and-cli" >}}).
