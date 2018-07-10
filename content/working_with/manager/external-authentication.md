---
layout: bt_wiki
title: External Authentication
draft: false
weight: 1550
---
## Overview
Cloudify lets you extend the user authentication mechanism so that you can support different external authentication services.

You can authenticate users with the basic username/password support in Cloudify or you can configure your Manager to integrate with an external authenticator, such as an LDAP-based user-management system. External authentication is an extension to the Cloudify Manager not included in the standard Manager installation.

To support a new external authentication mechanism, you must add a dedicated module in the specified format to a specific location in the Manager and restart the REST services.


## Managing external authentication in Cloudify
You can add the external authentication modules at any time after you install the Cloudify Manager. The Cloudify module that interacts with the authentication modules is the ExtendedAuthHandler module. The ExtendedAuthHandler module loads all of the authentication modules from these folders:

- /opt/manager/resources/authenticators
- /opt/manager/env/lib/python2.7/site-packages/cloudify_premium/authentication

{{% note title="Note" %}} Adding a new authentication module requires restart of the rest-service service. {{% /note %}}

You can use the authentication modules that are in the cloudify_premium package, located at cloudify_premium/authentication, as a reference implementation or as a base implementation that can be modified for your needs.


## Authenticator Base Module
Each authenticator module inherits from the AuthBase class. The AuthBase contains the common tasks relevant to user authentication, including Cloudify user creation, and user group and tenant update, if needed.

A very simple example to authenticate the user “meme”:

```python
from cloudify_premium.authentication.auth_base import AuthBase, UserData


class MyAuthentication(AuthBase):

    def _authenticate_request(self, request):
        auth = request.authorization
        if auth and auth.username == "meme":
            return UserData(auth.username)
        return None


configure = MyAuthentication().configure
```

This is not a practical example, but it does show the high-level requirements of the authentication module.

- Inherit from AuthBase
- Include authentication logic for every request
- Add a module-level “configure” variable that holds the authenticator configure method.

In this example, the _authenticate_request is overridden to verify the username and to return UserData object that contains the given username. According to the UserData object, a relevant Cloudify user is be created.


## AuthBase methods

As mentioned, the AuthBase module implements the basic functionality for Cloudify user authentication and management. You can override this functionality to support any case of external authentication. Other important methods are: configure, can_handle_auth_request, handle_auth_request

### Configure method

The configure method is called once and returns the object (self), or None if the object should not be created. By default, configure returns self, which means that the authenticator is added to the authenticators poll. For example, the implementation in the LDAP authenticator is:

```python
def configure(self, logger):
   """
   Set the object instance.
   Being called after the configuration is loaded
   """
   if not config.instance.ldap_server:
       return None
   self.logger = logger
   self._ldappy = self._get_ldappy()
   return self
```

In this example, if ldap info is not found in the configuration, then the LDAP authenticator does not exist.


### can_handle_auth_request

The can_handle_auth_request method shows if a specific request is valid for the current authenticator. By default, the method returns True, which means that the authenticator is a valid authentication for any request. For example, the implementation in the LDAP authenticator is:

```python
def can_handle_auth_request(self, request):
   """
   Validate that this authenticator can handle auth process,
   for given request
   """
   return request.authorization and self._ldappy
```

In this example, the LDAP authenticator handles only requests that contain authorization information, and only if there is a valid ldappy instance.


### handle_auth_request

The handle_auth_request method is the actual method that does user authentication for a given request. It triggers a call to the _authenticate_request method and acts according to the response. In the case of a UserData information, it will create/update a Cloudify user and return it.n the case of a Response object, it will just return the response.


## LDAP/OKTA Reference Implementation

In version 4.3 and lower, LDAP and OKTA authentication was included in the Cloudify Manager. In version 4.4 and higher, LDAP and OKTA support is converted to the new external authentication method.

The OKTA and LDAP authentication implementation is located at: cloudify_premium/authentication. As with other external authentication services, you can change the authentication module and restart the rest service with the command: “sudo systemctl restart cloudify-restservice”
