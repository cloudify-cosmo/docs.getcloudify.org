---
layout: bt_wiki
title: Okta Authentication
category: Manager
draft: false
weight: 1500
aliases: /manager/okta_authentication/
---

{{< param product_name >}} enables integration with your local Okta system to authenticate users and provide Role-Based Access Control. This guide describes the configuration steps required to enable Okta authentication.

Other SAML 2.0 authentication solutions can be integrated with Cloudify. However, only Okta is tested and officially supported.

{{% tip title="openssl version" %}}
To enable Okta integration, the openssl package on {{< param cfy_manager_name >}} needs to be of version 1.0.2. If you are running a {{< param product_name >}} image this is already the case, however if you are installing {{< param product_name >}} make sure to update the openssl package prior to the Okta configuration.
{{% /tip %}}

## Part 1: Configuring Okta
To configure Okta authentication in {{< param product_name >}}, first add {{< param product_name >}} as an application in your Okta system. The instructions below refer to Okta’s <b>Classic UI</b> - other views may differ in configuration parameters.
### Okta Configuration Prerequisites:
You'll need Okta administrator privileges and your {{< param product_name >}} IP address/URL (or load balancer IP address/URL for {{< param product_name >}} HA cluster configuration).

### Adding {{< param product_name >}} as an Okta Application
1. Open the Okta Admin dashboard
2. From the top menu, choose <b>Applications</b>
3. Choose <b>Add Application</b>
4. Select <b>Create New App</b>
5. Choosing a meaningful name will be helpful when additional managers are added. For example, `Cloudify Dev` or `Cloudify Production`.
6. In the <b>Create a New Application</b> form, choose as sign on method “SAML 2.0”
7. Under <b>General Settings</b> configure the application name, such as Cloudify Dev and add the logo.
8. Under <b>SAML Settings</b>, configure the following:

    <b>General:</b>

    a. Add the <b>Single sign on URL</b>: https://cloudify-manager-ip/console/auth/saml/callback

    b. Make sure the box for <b>Use this for Recipient URL and Destination URL</b> is checked.

    c. Add the <b>Audience URI:</b> https://cloudify-manager-ip/console/auth/saml/callback 

    d. <b>Attribute Statements</b> - add the following:

    * Name - firstname , Value - user.firstName
    * Name - lastname , Value - user.lastName
    * Name - email , Value - user.email
    * Name - username , Value - user.login

    e. Groups Attribute Statements:
    Add all relevant user groups, or generally use:
    Name - groups , Filter - Regex, Value - cloudify*

    ![Create App]( /images/okta/okta1.png )

    ![Create App]( /images/okta/okta2.png )

    f. Under Feedback, define {{< param product_name >}} as an internal app

    ![Create App]( /images/okta/okta4.png )

### Additional Configuration
* In Users, assign the new {{< param product_name >}} app created to the relevant users or groups.
* Provide the Okta Identity Provider Single Sign-On URL and certificate to the {{< param cfy_manager_name >}} administrator. They can be found here:

<b>Application page > Sign on tab > Settings section > SIGN ON METHODS > View Setup Instructions</b>

## Part 2: Configuring {{< param product_name >}} 

To complete the Okta authentication configuration, Okta needs to be configured in the {{< param cfy_manager_name >}}.

### {{< param product_name >}} Prerequisites:

You'll need the following:

* SSH access to the {{< param product_name >}} VM/s with `sudo` privileges.
* Okta CA Certificate (provided by your Okta administrator)
* Identity Provider Single Sign-On URL (provided by your Okta Administrator)

### Adding Okta Authentication in {{< param product_name >}}

SSH into the {{< param cfy_manager_name >}} VM and follow these steps:

1. Add the Okta certificate for {{< param product_name >}} (provided by your Okta admin, see above). Save the certificate as `okta_certificate.pem` in `/etc/cloudify/ssl/`

2. Restart {{< param product_name >}} REST service using the following command:

    `sudo supervisorctl restart cloudify-restservice`
	
3. Configure the {{< param cfy_console_name >}} to use Okta with the following steps:

    a. Open the file `/opt/cloudify-stage/conf/app.json` for editting

    b. Under saml section change the values as follows:

      * `enabled`: true (enabling saml mode)

      * `certPath`: “/etc/cloudify/ssl/okta_certificate.pem” (SAML certificate path which is used by the {{< param 
      cfy_manager_name >}} and {{< param cfy_console_name >}})

      * `ssoUrl` - <okta_sso_url> (redirect url to the application at the Okta identity provider, can be found under 
      setup instructions of the newly created {{< param product_name >}} app in Okta)

      * `portalUrl` - <organization_okta_portal_ip_and_path> (redirect url to the organization portal: https://my-org.
      okta.com)
        
    c. Restart the {{< param cfy_console_name >}} service using the following command:

    `sudo supervisorctl restart cloudify-stage`

5. Create new user-groups in {{< param product_name >}}, matching the user groups in Okta (must be exactly the same names) using the following command for each group:

    `cfy user-group create <user_group_name> -r <security-role>`
 
6. Assign the user-groups to tenants using the following command:

    `cfy tenants add-user-group <user_group_name> -r <role> -t <tenant_name>`
	
## Adding Okta Authentication in {{< param product_name >}} HA Configuration

* The Load Balancer IP address (or URL) should be used for SSO URL in Okta
* Each {{< param product_name >}} manager in the HA cluster must be configured according to the steps above.	
