---

title: LDAP Plugin



weight: 600
---
# Overview
LDAP is a protocol used over an IP network to access and manage the distributed directory information service. The directory service provides a systematic set of records, usually organized in a hierarchical structure and is often used by organizations as a central repository to hold user information as well as provide a way of authentication accordingly. The directory service also makes it possible to define user groups and user roles that can later be used for authorization purposes.

This guide will focus on using the Cloudify LDAP security plugin to authenticate users against an LDAP/Active Directory service endpoint using the simple, bind based authentication method.

LDAP server authentication may be configured in a variety of ways, and so the [cloudify-ldap-plugin](https://github.com/cloudify-cosmo/cloudify-ldap-plugin) is designed to support multiple configurations, all of which are configurable under the [manager-types.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1-build/types/manager-types.yaml#L62) file's security settings and will be demonstrated here. Users reading this guide must first be familiarized with LDAP and with the Cloudify [manager security]({{< relref "manager/security.md" >}}) concepts, with regards to [authentication providers]({{< relref "manager/security.md#authentication-providers" >}}). For any further customization of this plugin, it is recommended that developers be familiar with the [python-ldap](http://www.python-ldap.org/index.html) client API.

# Installation
In order to install the [cloudify-ldap-plugin](https://github.com/cloudify-cosmo/cloudify-ldap-plugin) it must first be defined as a [custom rest plugin]({{< relref "manager/security.md#packaging-configuring-and-installing-custom-implementations" >}}) in the [manager-blueprint](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/tree/3.3.1-build), prior to bootstrap.
## REST plugin configuration
Defining the [cloudify-ldap-plugin](https://github.com/cloudify-cosmo/cloudify-ldap-plugin) in the manager blueprint as a rest plugin:
```yaml
node_types:
  .....
  manager.nodes.RestService:
    .....
    properties:
      .....
      plugins:
        ldap_authentication_plugin:
          source: 'http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.3.1/sp-RELEASE/cloudify_ldap_plugin-1.0-py27-none-linux_x86_64-centos-Core.wgn'
          install_args: 'cloudify-ldap-plugin --use-wheel --no-index --find-links=wheels/ --pre'
```
This example demonstrates using a [Wagon](https://github.com/cloudify-cosmo/wagon) package to install the [cloudify-ldap-plugin](https://github.com/cloudify-cosmo/cloudify-ldap-plugin). Using a [Wagon](https://github.com/cloudify-cosmo/wagon) package in this case, eliminates the need for some system-level dependencies to be installed on the manager host, as explained in the following paragraph.

## System-level requirements
The LDAP python dependency [python-ldap](http://www.python-ldap.org/index.html), included in the [cloudify-ldap-plugin](https://github.com/cloudify-cosmo/cloudify-ldap-plugin) package, requires system level dependencies i.e openldap-devel, python-devel, and gcc in order to install. These system level dependencies should be installed using a userdata script as follows:

* No Wagon package - Userdata script should include `sudo yum install python-devel openldap-devel gcc -y`
* Using Wagon package - Userdata script should only include `sudo yum openldap-devel -y`

# Configuring the authentication provider
Configuring the LDAP authentication provider should be done within the constraints of authenticating against the organization's directory. Setting the LDAP plugin configuration is done prior to bootstrap and will determine the way users authenticate against the Cloudify manager throughout its lifecycle.

## Authentication process
Once the user request has been made to the Cloudify REST endpoint, the bind authentication process can take place according to one of the following options:
### Direct bind
Authenticate the entity by attempting to bind using the **user id** and **password** supplied by the user, where user id is the fully qualified DN, e.g. **"cn=steve miller,ou=Users,dc=welcome,dc=com"**. <br>

{{% gsInfo title="Active Directory" %}}
Active Directory users may also authenticate by passing the standard Active Directory authentication attribute known as `userPrincipalName` e.g **"stevem@welcome.com"**.
{{% /gsInfo %}}


### Search based bind
Authenticate the entity by performing a user search under a base DN according to the user id and a pre-defined `inetOrgPerson` attribute.<br>
The pre-defined attribute and the base DN are configurable prior to bootstrap, as will be described later on.

To understand the search process, we'll define a sample LDAP user named 'steve':
```
cn="steve miller"
uid="smiller"
dn="cn=steve miller,ou=Users,dc=welcome,dc=com"
```
and sample base DN:
```
base_dn="ou=Users,dc=welcome,dc=com"
```

The search based flow for 'steve' can be described as follows:

* User makes a request to the Cloudify REST using his `uid` (**"smiller"**) as user id rather then passing the fully qualified DN. <br>
For this example we use `uid` since it's the default attribute for search based bind.
* An LDAP search is performed for the user starting at the pre-defined base DN (**"ou=Users,dc=welcome,dc=com"**).
* If a user with `uid` **"smiller"** has been found under the base DN, his fully qualified DN (**"cn=steve miller,ou=Users,dc=welcome,dc=com"**) will be used to bind with the supplied password.

## Initialization properties
{{% table %}}
Keyname           | Required | Type        | Description
-----------       | -------- | ----        | -----------
name              | yes      | string      | The name of the authentication provider.
implementation    | yes      | string      | The authentication provider's class path and class name. Possible values would be `authentication.ldap_authentication_provider:LDAPAuthenticationProvider` or `authentication.active_directory_authentication_provider:ActiveDirectoryAuthenticationProvider`
ldap_url          | yes      | string      | Complete LDAP endpoint URL including port if non default (389) is used.
domain_name       | no       | string      | The domain name to be used. This property is **only available** when using the "ActiveDirectoryAuthenticationProvider".
[search_properties]({{< relref "#search-properties" >}}) | no       | dict        | Schema of search inputs that will be passed to the implementation.
{{% /table %}}

#### Search properties
Using the search option would require setting these properties under the `search_properties` schema:
{{% table %}}
Keyname           | Required | Type        | Description
-----------       | -------- | ----        | -----------
base_dn    		  | yes      | string      | The subtree root point where users will be authenticated from.
admin_user_id     | yes      | string      | The user used to perform the search. This 'admin' user must have read permissions over the defined base_dn subtree.
admin_password    | yes      | string      | The admin user password to bind with.
user_id_attribute | no       | string      | The user ID attribute to authenticate by. By default, `uid` will be used for the "LDAPAuthenticationProvider" and `userPrincipalName` for "ActiveDirectoryAuthenticationProvider".
{{% /table %}}

## Configuration options
This section covers some possible configuration variations that can be defined in the [manager-types.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1-build/types/manager-types.yaml#L62) file, under `authentication_providers`.

#### Using direct bind
* To enable authentication using the **user id** and **password** provided in the user's request, the configuration to be used would look like so:
```yaml
authentication_providers:
    ......
    - name: 'ldap_authentication_provider'
      implementation: 'authentication.ldap_authentication_provider:LDAPAuthenticationProvider'
      properties:
        ldap_url: 'ldap://xxx.xxx.xxx.xxx:389'
    ......
```


* {{< tag >}}Active Directory{{< /tag >}}: The "ActiveDirectoryAuthenticationProvider" also supports passing the `domain_name` property to the provider configuration. This enables Active Directory users to authenticate according to their `sAMAccountName` not having to pass their entire `userPrincipalName`. The configuration for such implementation would be:
```yaml
authentication_providers:
    ......
    - name: 'ad_authentication_provider'
      implementation: 'authentication.active_directory_authentication_provider:ActiveDirectoryAuthenticationProvider'
      properties:
        ldap_url: 'ldap://xxx.xxx.xxx.xxx:389'
        domain_name: 'welcome.com'
    ......
```

#### Using search based bind
* Using the [search properties]({{< relref "#search-properties" >}})  as part of the configuration. This example uses the `cn` attribute as the 'user_id_attribute' and would only allow user authentication according to the CN ("common name"). The 'user_id_attribute' can be set to any attribute defined in `inetOrgPerson`, as long as that attribute is set to be unique in the directory-service configuration.
```yaml
authentication_providers:
    ......
    - name: 'ldap_authentication_provider'
      implementation: 'authentication.ldap_authentication_provider:LDAPAuthenticationProvider'
      properties:
        ldap_url: 'ldap://xxx.xxx.xxx.xxx:389'
        search_properties:
        	base_dn: 'ou=Users,dc=welcome,dc=com'
        	admin_user_id: 'cn=admin,ou=Users,dc=welcome,dc=welcome'
        	admin_password: 'XXXXXX'
        	user_id_attribute: 'cn'
    ......
```

# Client authentication

[Client authentication]({{< relref "manager/security.md#clients" >}}) against the Cloudify manager is done via [HTTP basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). Cloudify clients can be configured to pass the "authorization" header containing the user id and password encoded with [Base64](https://en.wikipedia.org/wiki/Base64). These credentials can be passed to clients as follows:
## CLI
When using the CLI to [perform secure requests]({{< relref "manager/security.md#cli-cfy-commands" >}}), credentials should be set as environment variables:
```bash
export CLOUDIFY_USERNAME=user_id
export CLOUDIFY_PASSWORD=password
# make a secured request
cfy status
```
## REST client
When using the REST client to [perform secure requests]({{< relref "manager/security.md#cloudify-s-rest-client" >}}), authentication header must be set on instantiation:
```python
headers = {'Authorization': 'Basic ' + base64_encode('USERNAME:PASSWORD')}
rest_client = CloudifyClient(host='143.3.12.x', headers=headers)
# make a secured request
rest_client.manager.get_status()
```
## Cloudify web UI
When using the web UI, credentials should be passed via the login window:

![UI login screen]({{< img "customui/secure_login_ldap.png" >}})