---
layout: bt_wiki
title: Okta Authentication
category: Manager
draft: false
weight: 1500
aliases: /manager/okta_authentication/
---

Cloudify enables integration with your local Okta system to authenticate users. In this guide, the configuration steps required to enable Okta authentication are described.

{{% tip title="openssl version" %}}
To enable Okta integration, the openssl package on Cloudify Manager needs to be of version 1.0.2. If you are running a Cloudify image this is already the case, however if you are installing make sure to update the openssl package prior to the Okta configuration.
{{% /tip %}}

## Configuring Cloudify in Okta 
To configure Okta authentication in Cloudify, first add Cloudify as an application in your okta system. The instructions below refer to okta’s classic UI - other views may differ in configuration parameters.

### Adding Cloudify as an Okta Application
1. Open the admin dashboard in okta
2. From the top menu, choose “Applications”
3. Choose “Add Application”
4. Select “Create New App”
5. In the “Create a New Application” form, choose as sign on method “SAML 2.0”
6. Under General Settings configure the application name (Cloudify) and logo
7. Under SAML Settings, configure the following:

    General:
    
    a. As Single sign on URL: https://cloudify-manager-ip/console/auth/saml/callback (or http if client side SSL is not used)
    
    b. Make sure the box for “Use this for Recipient URL and Destination URL” is marked
    
    c. As Audience URI: https://cloudify-manager-ip/console/auth/saml/callback (or http if client side SSL is not used)
    
    d. Attribute statements - add the following:
    
    * Name - firstname , Value - user.firstName
    * Name - lastname , Value - user.lastName
    * Name - email , Value - user.email
    * Name - username , Value - user.login
    
    e. Group Attribute Statements:
    Add all relevant user groups, or generally use:
    Name - group , Filter - Regex, Value - .*
    
    ![Create App]( /images/okta/okta1.png )

    ![Create App]( /images/okta/okta2.png )

    ![Create App]( /images/okta/okta3.png )
    
    f. Under Feedback, define Cloudify as an internal app
    
    ![Create App]( /images/okta/okta4.png )

### Additional Configuration
In Assignments, assign the new Cloudify app created to the relevant users or groups.

## Configuring Okta in Cloudify
To complete the okta authentication configuration, Okta needs to be configured in the Cloudify manager. 
To do so SSH into the Cloudify manager VM and follow these steps:

1. Add the okta certificate for Cloudify (can be found under setup instructions of the newly created Cloudify app in Okta) as a pem file named okta_certificate.pem under /etc/cloudify/ssl/ 

2. Restart Cloudify rest service using the following command:

	sudo systemctl restart cloudify-restservice.service
3. Configure the {{< param cfy_console_name >}} to use Okta with the following steps:

    a. Open the file /opt/cloudify-stage/conf/config.json for editting
    
    b. Under saml section change the values as follows:
    
    “enabled”: true (enabling saml mode)
    
    “certPath”: “/etc/cloudify/ssl/okta_certificate.pem” (SAML certificate path which is used by the Cloudify Manager and {{< param cfy_console_name >}})
    
    “ssoUrl” - <okta_sso_url> (redirect url to the application at the Okta identity provider, can be found under setup instructions of the newly created Cloudify app in Okta)
    
    portalUrl - <organization_okta_portal_ip_and_path> (redirect url to the organization portal)
    
    c. Restart {{< param cfy_console_name >}} service using the following command:
    sudo systemctl restart cloudify-stage.service
    
4. Create new user-groups in Cloudify, matching the user groups on okta (must be exactly the same names) using the following command for each group:
	cfy user-group create <user_group_name>
5. Assign the user-groups to tenants using the following command:
	cfy tenants add-user-group <user_group_name> -t <tenant_name>

