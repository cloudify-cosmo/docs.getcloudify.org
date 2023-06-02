---
title: Okta Authentication
category: Manager
draft: false
weight: 1500
aliases: /manager/okta_authentication/
---

{{< param product_name >}} enables integration with your local Okta system to authenticate users and provide Role-Based Access Control. This guide describes the configuration steps required to enable Okta authentication.

Other SAML 2.0 authentication solutions can be integrated with {{< param product_name >}}. However, only Okta is tested and officially supported.

{{% tip title="openssl version" %}}
To enable Okta integration, the openssl package on {{< param cfy_manager_name >}} needs to be of version 1.0.2. If you are running a {{< param product_name >}} image this is already the case, however if you are installing {{< param product_name >}} make sure to update the openssl package prior to the Okta configuration.
{{% /tip %}}

## Part 1: Configuring Okta
To configure Okta authentication in {{< param product_name >}}, first add {{< param product_name >}} as an application in your Okta system.

### Okta Configuration Prerequisites
You'll need Okta administrator privileges and your {{< param product_name >}} IP address/URL (or load balancer IP address/URL for {{< param product_name >}} HA cluster configuration).

### Adding {{< param product_name >}} as an Okta Application
1. Open the Okta Admin dashboard
2. From the top menu, choose <b>Applications > Applications > Create App Integration</b>
3. In the <b>Create a new app integration</b> form, choose **SAML 2.0** as sign-in method
4. In the <b>General Settings</b> step, configure the application name, such as {{< param product_name >}} Dev and add the logo.
5. In the <b>Configure SAML</b> step, configure the following in the **SAML Settings** section:

    * In <b>General</b> subsection:
        * add the <b>Single sign on URL</b>: https://cloudify-manager-ip/console/auth/saml/callback
        * make sure the box for <b>Use this for Recipient URL and Destination URL</b> is checked.
        * add the <b>Audience URI</b>: https://cloudify-manager-ip/console/auth/saml/callback

    * In <b>Attribute Statements</b> subsection add the following:
        * Name - firstname, Name Format - unspecified, Value - user.firstName
        * Name - lastname, Name Format - unspecified, Value - user.lastName
        * Name - email, Name Format - unspecified, Value - user.email
        * Name - username, Name Format - unspecified, Value - user.login

    * In <b>Groups Attribute Statements</b> subsection add all relevant user groups, or generally use:
        * Name - groups, Name Format - unspecified, Filter - Regex, Value - .*

6. In the <b>Feedback</b> step, define {{< param product_name >}} as an internal app
7. Once a new {{< param product_name >}} integration is created, you need to create at least one group
   in **Directory > Groups** section and assign relevant users to it.

### Additional Configuration
* Provide the Okta **Identity Provider Single Sign-On URL** and **X.509 Certificate** to the {{< param
  cfy_manager_name >}} administrator. They can be found in:
  <b>Application page > Sign on tab > Settings section > Sign on methods > View Setup Instructions</b>

## Part 2: Configuring {{< param product_name >}}

To complete the Okta authentication configuration, Okta needs to be configured in the {{< param cfy_manager_name >}}.

### {{< param product_name >}} Prerequisites

You'll need the following:

* SSH access to the {{< param product_name >}} VM/s with `sudo` privileges
* Okta CA Certificate (provided by your Okta administrator)
* Identity Provider Single Sign-On URL (provided by your Okta Administrator)

### Adding Okta Authentication in {{< param product_name >}}

SSH into the {{< param cfy_manager_name >}} VM and follow these steps:

1. Add the Okta certificate for {{< param product_name >}} (provided by your Okta admin, see above). Save the certificate as `okta_certificate.pem` in `/etc/cloudify/ssl/`
2. Restart {{< param product_name >}} REST service using the following command:
   ```
   sudo supervisorctl restart cloudify-restservice
   ```
4. Configure the {{< param cfy_console_name >}} to use Okta with the following steps:

    * Copy default user configuration file to user data folder
    ```
    sudo -u stage_user cp /opt/cloudify-stage/conf/userConfig.json /opt/cloudify-stage/dist/userData
    ```
    * Open the file `/opt/cloudify-stage/dist/userData/config.json` for editing

        * Under `auth` section change the values as follows:
            * `type`: "saml" (enabling SAML mode)
            * `certPath`: "/etc/cloudify/ssl/okta_certificate.pem" (SAML certificate path which is used by the
              {{< param cfy_manager_name >}} and {{< param cfy_console_name >}})
            * `loginPageUrl`: \<okta_sso_url\> (redirect url to the application, 
              **Identity Provider Single Sign-On URL**
              which can be found under **Setup Instructions** section of the newly created
              {{< param product_name >}} app in Okta)
            * `afterLogoutUrl`: \<organization_okta_portal_url\> (redirect url to the organization portal:
              https://my-org.okta.com)

        * Remove all other configuration objects (except `auth`) from the file if you don't plan to modify it

    * Restart the {{< param cfy_console_name >}} service using the following command:
    ```
    sudo supervisorctl restart cloudify-stage
    ```

5. Create new user-groups in {{< param product_name >}}, matching the user groups in Okta (must be exactly the same
   names) using the following command for each group:
   ```
   cfy user-group create <user_group_name> -r <security-role>
   ```

6. Assign the user-groups to tenants using the following command:
   ```
   cfy tenants add-user-group <user_group_name> -r <role> -t <tenant_name>
   ```

## Adding Okta Authentication in {{< param product_name >}} HA Configuration

* The Load Balancer IP address (or URL) should be used for SSO URL in Okta
* Each {{< param product_name >}} manager in the HA cluster must be configured according to the steps above.

## Configuring Azure SSO
To configure Azure-SSO authentication in {{< param product_name >}}, first you need to create an enterprise application for {{< param product_name >}} on your Azure Account.

### Azure-SSO Application Setup
After you create an enterprise application you need to configure Single sign-on with the following sections:

1. Basic SAML Configuration:
  * Identifier (Entity ID) : https://cloudify-manager-ip/console
  * Reply URL (Assertion Consumer Service URL) : https://cloudify-manager-ip/console/auth/saml/callback

2. Attributes & Claims: [ Same as in Part-1 Above ]

**Note** make sure to not include any namespace

![Azure-SSO Claims]( /images/manager/azure-sso-claims.png )

3. SAML Certificates:
  * from edit -> SAML Signing Certificate
  * change the Signing Option to : Sign SAML response

**Note** Make sure to download the certificate [Certificate (Base64)]

To get the user access URL , from application properties: `User access URL`

Then you need to follow Configuring {{< param product_name >}} above - with these values override:

  * loginPageUrl : the user access URL that you got above


## Configuring WSO2 SSO
To configure WSO2-SSO authentication in {{< param product_name >}}, first you need to create a service provider for {{< param product_name >}} on your WSO2 Setup.

### WSO2-SSO Service Provider Setup
After you create a service provider you need to configure Single sign-on with the following sections:


1. Claim Configration: [ Same as in Part-1 Above ]

**Note** make sure to not include any namespace

  * Define Custom Claim Dialect

![WSO2-SSO Claims]( /images/manager/wso2-sso-claims.png )

2. Inbound Authentication Configuration:
  * SAML2 Web SSO Configuration:
    * Issuer: console
    * Assertion Consumer URLs : https://cloudify-manager-ip/console/auth/saml/callback
    * Enable Response Signing : [ Tick it ]
    * Enable Signle Logout: [ Tick it ]
    * SLO Request URL : https://cloudify-manager-ip/console/login
    * Logout Method : Front-Channel Logout (HTTP Redirect Binding)
    * Enable Attribute Profile : [ Tick it ]
    * Include Attributes in the Response Always : [ Tick it ]
    * Enable IdP Initiated SSO
    * Enable IdP Initiated SLO
    * Return to URL : https://cloudify-manager-ip/console/login
    * Download IDP Metadata

**Note** the certificate will be part of IDP Metadata file so you need to get it from the XML

Then you need to follow Configuring {{< param product_name >}} above - with these values override:

  * loginPageUrl: https://wso2-server-ip/samlsso?spEntityID=console
  * afterLogoutUrl: https://wso2-server-ip/samlsso?spEntityID=console&slo=true
