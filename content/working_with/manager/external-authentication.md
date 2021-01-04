---
layout: bt_wiki
title: External Authentication
draft: false
weight: 1550
---

{{%children style="h3" description="true"%}}

## Overview
{{< param product_name >}} lets you extend the user authentication mechanism so that you can support different external authentication services.

You can authenticate users with the basic username/password support in {{< param product_name >}} or you can configure your Manager to integrate with an external authenticator, such as an LDAP-based user-management system. External authentication is an extension to the {{< param cfy_manager_name >}} not included in the standard Manager installation.

To support a new external authentication mechanism, you must add a dedicated module in the specified format to a specific location in the Manager and restart the REST services.


## Managing external authentication in {{< param product_name >}}
You can add the external authentication modules at any time after you install the {{< param cfy_manager_name >}}. The {{< param product_name >}} module that interacts with the authentication modules is the `ExtendedAuthHandler` module. The `ExtendedAuthHandler` module loads all of the authentication modules from these folders:

- /opt/manager/resources/authenticators
- /opt/manager/env/lib/python2.7/site-packages/cloudify_premium/authentication

{{% note title="Note" %}} Adding a new authentication module requires restarting the REST service. {{% /note %}}

You can use the authentication modules that are in the `cloudify_premium` package, located at `cloudify_premium/authentication`, as a reference implementation or as a base implementation that can be modified for your needs.


## Authenticator Base Module
Each authenticator module inherits from the `AuthBase` class. The `AuthBase` contains the common tasks relevant to user authentication, including {{< param product_name >}} user creation, and user group and tenant update, if needed.

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

- Inherit from `AuthBase`
- Include authentication logic for every request
- Add a module-level `configure` variable that holds the authenticator's `configure` method.

In this example, `_authenticate_request` is overridden to verify the username and to return a `UserData` object that contains the given username. A relevant {{< param product_name >}} user is created according to the `UserData` object.


## `AuthBase` methods

As mentioned, the `AuthBase` module implements the basic functionality for {{< param product_name >}} user authentication and management. You can override this functionality to support any type of external authentication. Other important methods are: `configure`, `can_handle_auth_request`, and `handle_auth_request`.

### `Configure`

The `configure` method is called once and returns the object (`self`), or `None` if the object should not be created. By default, `configure` returns `self`, which means that the authenticator is added to the authenticators pool. For example, the implementation in the LDAP authenticator is:

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

In this example, if LDAP info is not found in the configuration, then the LDAP authenticator is not used.


### `can_handle_auth_request`

The `can_handle_auth_request` method shows if a specific request is valid for the current authenticator. By default, the method returns `True`, which means that the authenticator is a valid authentication for any request. For example, the implementation in the LDAP authenticator is:

```python
def can_handle_auth_request(self, request):
   """
   Validate that this authenticator can handle auth process,
   for given request
   """
   return request.authorization and self._ldappy
```

In this example, the LDAP authenticator handles only requests that contain authorization information, and only if there is a valid `ldappy` instance.


### `handle_auth_request`

The handle_auth_request method is the actual method that does user authentication for a given request. It triggers a call to the `_authenticate_request` method and acts according to the response. In the case of a `UserData` information, it will create/update a {{< param product_name >}} user and return it. In the case of a `Response` object, it will just return the response.


## LDAP/OKTA Reference Implementation

In version 4.3 and below, LDAP and OKTA authentication modules were included with {{< param cfy_manager_name >}}. Starting version 4.4, LDAP and OKTA support is converted to the new external authentication method.

The OKTA and LDAP authentication implementations are located at `cloudify_premium/authentication`. As with other external authentication services, you can change the authentication module and restart the REST service with the command: `sudo systemctl restart cloudify-restservice`.
