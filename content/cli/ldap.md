---
layout: bt_wiki
title: ldap
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 105
---

The `cfy ldap` command is used to set LDAP authentication to enable you to integrate your LDAP users and groups with Cloudify.


#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

## Commands

### set

#### Usage 
`cfy LDAP set [OPTIONS]`

Set Cloudify Manager to use the LDAP authenticator.

#### Required flags

  ```-s, --ldap-server TEXT          The LDAP server address to authenticate
                                  against  [required]
  -u, --ldap-username TEXT        The LDAP admin username to be set on the
                                  Cloudify manager  [required]
  -p, --ldap-password TEXT        The LDAP admin password to be set on the
                                  Cloudify manager  [required]
```


#### Optional flags


 ``` -d, --ldap-domain TEXT          The LDAP domain to be used by the server
  -a, --ldap-is-active-directory  Specify whether the LDAP used for
                                  authentication is Active-Directory.
  -e, --ldap-dn-extra TEXT        Extra LDAP DN options.
 ```

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy ldap set -s [SERVER ADDRESS] -u [SERVER ADMIN USERNAME] -p [SERVER ADMIN PASSWORD]
{{< /gsHighlight >}}

