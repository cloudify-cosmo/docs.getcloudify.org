---
layout: bt_wiki
title: Integrating with LDAP
draft: false
weight: 1450
---
{{< param product_name >}} provides a user management mechanism, so you can define different users with different permissions, and upon login perform authentication and authorization to control the users’ access to resources. 

The users can be either defined and managed in {{< param product_name >}} itself, or you can configure your {{< param cfy_manager_name >}} to integrate with an LDAP-based user-management system. You must select one of these options, as you cannot do both.

If LDAP integration is enabled, {{< param product_name >}} system role membership should be configured using [user-groups]({{< relref "cli/maint_cli/usergroups.md" >}}).

If you enable LDAP with existing users already on the {{< param cfy_manager_name >}} those users will continue to exist but cannot be used to log in unless they match an LDAP username.
e.g. if a user jbloggs exists on the {{< param cfy_manager_name >}} before LDAP is enabled then after LDAP is enabled a login is made by LDAP user jbloggs, the LDAP user jbloggs will be shown as the creator of any entities (e.g. blueprints, secrets, deployments) that were created by the original jbloggs user.

The initial admin user (by default called 'admin') will still be authenticated using local authentication.

User management can be performed using the CLI or the {{< param cfy_console_name >}}.

Note that for Active Directory currently only one domain is supported- attempting to log in with any other domains in a forest is unsupported.

{{% tip title="User Management Credentials" %}}
You must have {{< param cfy_manager_name >}} administrator permissions to perform user-management related actions.
{{% /tip %}}

## Basic integration
In order to enable LDAP user integration you must know:
* The LDAP server address, e.g. ldap://192.0.2.1 or ldaps://192.0.2.4
* The domain the LDAP server is associated with, e.g. local.example. For active directory, this will be used when formatting the username for authentication (e.g. jbloggs will authenticate as jbloggs@local.example). This will also be used for the base DN of lookups, e.g. as dc=local,dc=example.
* If using LDAPS to authenticate over TLS (recommended) you must provide the PEM encoded CA certificate.

A basic setup assumes that authenticated users will be able to query the directory for their group membership and that there is no nesting of groups.

{{% tip title="Basic Active Directory LDAP integration" %}}
Assuming no TLS, with a server address of 192.0.2.1, and domain of ad.example:
`cfy ldap set --ldap-server ldap://192.0.2.1 --ldap-domain ad.example --ldap-is-active-directory`
or
`cfy ldap set -s ldap://192.0.2.1 -d ad.example -a`
{{% /tip %}}

{{% tip title="Basic non-AD LDAP integration" %}}
Assuming TLS, with a server address of 192.0.2.4, a domain of slapd.example, and a CA cert located in /home/centos/ldapca.crt:
`cfy ldap set --ldap-server ldaps://192.0.2.4 --ldap-domain slapd.example --ldap-ca-path /home/centos/ldapca.crt`
or
`cfy ldap set -s ldaps://192.0.2.4 -d slapd.example -c /home/centos/ldapca.crt`
{{% /tip %}}

## Advanced integration

Defaults for active directory and non-active directory setups are given below. If your settings differ, or you need nested group lookups, consult the command options below to determine the correct settings to supply.

Examples given assume a user attempting to log in as 'jbloggs' and an LDAP domain of 'local.example'.

For details of variables (e.g. {username}), see below.

**For active directory:**

* Base DN for lookups is the domain, split on '.', as a series of dc LDAP entities- e.g. dc=local,dc=example
* Users bind as {username}@{domain} - e.g. jbloggs@local.example
* Accounts are located by searching with the query (|(sAMAccountName={username})(uid={username})) - e.g. (|(sAMAccountName=jbloggs)(uid=jbloggs))
* LDAP objects are expected to have the following attributes:
  - uid (required)- The username of the user, e.g. jbloggs
  - givenName (optional)- The given name of the user- this may be blank. If not blank, it will be stored as part of the user details on the {{< param cfy_manager_name >}}.
  - sn (optional)- The surname of the user- this may be blank. If not blank, it will be stored as part of the user details on the {{< param cfy_manager_name >}}.
  - email (optional)- The e-mail address of the user- this may be blank. If not blank, it will be stored as part of the user details on the {{< param cfy_manager_name >}}.
  - memberOf (required)- If the user is a member of no groups other than their primary group (usually Domain Users) then they will be effectively unusable with {{< param product_name >}}, so this should be populated with the group membership.
* Groups are looked up by consulting the memberOf attribute on a user (or, with nested lookups, on the groups).

**For other directories (e.g. openldap):**

* Base DN for lookups is the domain, split on '.', as a series of dc LDAP entities- e.g. dc=local,dc=example
* Users bind as uid={username},ou=users,{base_dn}- e.g. uid=jbloggs,ou=users,dc=local,dc=example
* Accounts are located by searching with the query (uid={username})- e.g. (uid=jbloggs)
* Groups which the user is a member of are located by searching with the query (uniqueMember={object_dn})- e.g. (uniqueMember=uid=jbloggs,ou=users,dc=local,dc=example)
* LDAP objects are expected to have the following attributes:
  - uid (required)- The username of the user, e.g. jbloggs
  - givenName (optional)- The given name of the user- this may be blank. If not blank, it will be stored as part of the user details on the {{< param cfy_manager_name >}}.
  - sn (optional)- The surname of the user- this may be blank. If not blank, it will be stored as part of the user details on the {{< param cfy_manager_name >}}.
  - email (optional)- The e-mail address of the user- this may be blank. If not blank, it will be stored as part of the user details on the {{< param cfy_manager_name >}}.
  - memberOf (optional)- If groups are present on user objects using this attribute they must also be on group objects if using nested lookups.
* Groups are looked up using either the memberOf attribute (if present), or the group membership lookup query above.

To override the above options, please consult the LDAP set command options below.

**Variables**

Some of the options can accept variables which will be substituted. Such variables are provided enclosed in braces, e.g. "{base_dn}".
The available variables for each option will be listed in the options below, and all come from the following list:

* {base_dn}- The base DN for all LDAP searches. By default this is the same as the domain DN.
* {domain_dn}- The domain name converted to LDAP format, e.g. local.example becomes dc=local,dc=example.
* {object_dn}- The DN of the object (user or group) that is being checked for membership of groups.
* {username}- The username of the user attempting to bind (for bind format) or the user attempting to log on (for all lookups).
* {domain}- The raw domain, e.g. local.example.

**Usage**

`cfy ldap set [OPTIONS]`

**Options**

`-s, --ldap-server TEXT` The LDAP server address to authenticate against, e.g. ldap://192.0.2.1  [required]
`-d, --ldap-domain TEXT` The LDAP domain to be used by the server, e.g. local.example [required]
`-a, --ldap-is-active-directory` Specify that the LDAP used for authentication is Active-Directory
`-c, --ldap-ca-path TEXT` Path to the CA certificate for LDAPS communications. Must be provided when using LDAPS, and not when using LDAP.

If the username and password options are used they should be used with a minimally privileged account as the credentials are necessarily stored unhashed in the database. If at all possible, it is recommended that username and password are not set.
`-u, --ldap-username TEXT` The LDAP username to bind with for lookups. Only required if standard users cannot look up their user object and groups.
`-p, --ldap-password TEXT` The LDAP password to bind with for lookups. Only required if standard users cannot look up their user object and groups.

`-e, --ldap-dn-extra TEXT` (Deprecated) Extra LDAP DN organisation. This should not be used, use --ldap-base-dn instead.

`--ldap-base-dn TEXT` The base DN for searches, etc.
`--ldap-group-dn TEXT` The base DN for searching for groups when performing user group lookups. This will only be used if the group membership is not available on the user object's group membership attribute. Defaults to 'ou=groups,{base_dn}'.
Can accept {base_dn} and {domain_dn}  variables.
                                
`--ldap-bind-format TEXT` The format to use when binding to the LDAP server. Defaults depend on active directory setting, see above.
Can accept {username}, {domain}, {domain_dn}, and {base_dn} variables.

`--ldap-user-filter TEXT` The search filter when searching for the LDAP user. Defaults depend on active directory setting, see above. Can accept {username}, {domain_dn}, and {base_dn} variables.
`--ldap-group-member-filter TEXT` The filter used when searching recursively for group membership. Can accept {object_dn}, {username}, {domain_dn}, and {base_dn} variables.

`--ldap-nested-levels TEXT` How many levels of group membership to check to find the groups the LDAP user is in.
If set to 1 (the default), only the groups the user is directly a member of will be available.
This setting directly affects the amount of LDAP lookups performed- one extra lookup will be performed if this is increased to 2, for example.

`--ldap-attribute-email TEXT` The name of the LDAP attribute giving the user's e-mail address. Defaults to 'email'.
If this attribute is missing or empty then no e-mail address will be set for the user in the database.
`--ldap-attribute-first-name TEXT` The name of the LDAP attribute giving the user's first name. Defaults to 'givenName'.
If this attribute is missing or empty then no first name will be set for the user in the database.
`--ldap-attribute-last-name TEXT` The name of the LDAP attribute giving the user's last name. Defaults to 'sn'.
If this attribute is missing or empty then no last name will be set for the user in the database.
`--ldap-attribute-uid TEXT` The name of the LDAP attribute giving the user's uid. This attribute must not be missing or empty. Defaults to 'uid'.
`--ldap-attribute-group-membership TEXT` The name of the LDAP attribute giving the user's group membership. Defaults to 'memberOf'.
If this attribute is missing, lookup will be performed using the group-member-filter on the group-dn and its subtrees.
If this attribute is present but empty, the user will not be able to be associated with any groups on the {{< param cfy_manager_name >}}.

**Example**

`cfy ldap set -s ldaps://192.0.2.4 -d slapd.example -c /home/centos/ldapca.crt --ldap-nested-levels 3 --ldap-user-filter '(username={username})' --ldap-group-dn 'ou=departments,o=myorg,{base_dn}' --ldap-attribute-uid username --ldap-bind-format 'username={username},ou=users,{base_dn}'`
This will configure the {{< param cfy_manager_name >}} to use LDAP with TLS, binding and performing lookups on server 192.0.2.4.
The CA cert from /home/centos/ldapca.crt will be used to validate the server certificate.
The slapd.example domain will be used, leading to a base DN of dc=slapd,dc=example.

Binding will be performed using username={username},ou=users,dc=slapd,dc=example.
For example, if the user jbloggs tries to log in then a bind will be performed as username=jbloggs,ou=users,dc=slapd,dc=example. This bind will use the password jbloggs supplies.

Users will be looked up by searching for objects where the username attribute is set to the username being used for login.
Groups will be looked up under ou=departments,o=myorg,dc=slapd,dc=example.
The uid for an object will be retrieved by consulting the username attribute on the returned user.

Group lookup will be performed up to three levels. For example, if jbloggs is in the Development group, which is in the Technical group and the Research group, both of which are in the IT group then jbloggs will be considered to be in the Development, Technical, Research, and IT groups. Note that these groups will actually be provided with their full LDAP DN- e.g. cn=Development,ou=departments,o=myorg,dc=slapd,dc=example. These DNs must be used when assigning group membership on the {{< param cfy_manager_name >}}.


### How {{< param cfy_manager_name >}} Works with the LDAP Service

When integrating with an LDAP system, {{< param product_name >}} will not allow you to manage users from the {{< param cfy_manager_name >}}, to prevent conflicts between the two systems. Instead, users will log into {{< param product_name >}} with their LDAP credentials, and the {{< param cfy_manager_name >}} will authenticate them against the LDAP service. To finish the authorization process into {{< param product_name >}}, the users will have to belong (directly, or via nested groups) to an LDAP group connected to one or more {{< param product_name >}} Tenants.

#### Connecting {{< param product_name >}} user-groups with the LDAP groups
To create this connection between the LDAP system and {{< param product_name >}} you must create user-groups in {{< param product_name >}} that represent your LDAP user groups.
You then assign those {{< param product_name >}} groups to tenants (where applicable) in {{< param cfy_manager_name >}}, with the desired roles. When a user logs into {{< param product_name >}}, a request is sent to the LDAP system for authentication and identification of the groups to which the user belongs (including groups that contains groups that eventually contains the user - aka nested groups).
{{< param product_name >}} then identifies the tenants that the {{< param product_name >}} groups (that represent the LDAP groups) can access, and allows user access according to the permissions the roles of the groups provide.

For more information on creating a user group, see either the [CLI command]({{< relref "cli/maint_cli/usergroups.md" >}}), or the [{{< param cfy_console_name >}}]({{< relref "working_with/console/pages/tenant-management-page.md" >}}).


In case a user belongs to multiple groups which are assigned to the same tenant with different roles, the user’s permissions in the tenant will be a sum of all the permission it receives from the different groups.
For example, let’s say jbloggs is a member of two Groups in LDAP – “team_leaders”, and “devs”. The team_leaders group is associated in {{< param product_name >}} with the group “all_tenants_viewers”, which is assigned to all of the {{< param cfy_manager_name >}}'s tenants with the role “Viewer”. The “devs” group is associated in {{< param product_name >}} with the group “dev_users”, which is assigned to dev_tenant with the role “User”.

So, jbloggs is now assigned to dev_tenant twice – once as a Viewer and once as a User. Upon logging into this tenant, the permissions jbloggs will have will be a sum of the permissions of the two roles. For more information regaring the user-roles, see [Managing Roles.]({{< relref "working_with/manager/roles-management.md" >}})
After users have logged in to {{< param product_name >}}, they are visible in the users list, but you cannot perform any management actions on their profiles.

![User/LDAP relationship]( /images/manager/multi-tenancy-ldap-relationship.png )

{{% tip title="LDAP Passwords" %}}
LDAP passwords are not saved in {{< param cfy_manager_name >}}.
{{% /tip %}}

{{% tip title="Tokens and LDAP" %}}
Changes to a user's password on non-LDAP setups will invalidate tokens.

When using LDAP, tokens will not be invalidated by password changes, they will only be invalidated by their expiry (10 hours, or the duration of the associated execution).
{{% /tip %}}
