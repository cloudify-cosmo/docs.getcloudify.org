---
title: profiles
description: The `cfy profiles` command is used to manage the product profiles.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/profiles/
---

The `cfy profiles` command is used to manage the {{< param product_name >}} profiles.

Each profile contains a set of credentials and environmental settings for access to the {{< param cfy_manager_name >}}.


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### list

#### Usage
`cfy profiles list [OPTIONS]`

List all profiles.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy profiles list
...

Listing all profiles...

Profiles:
+---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
|      name     |  manager_ip  | ssh_user |             ssh_key_path            | ssh_port | rest_port | rest_protocol | manager_username | manager_tenant | bootstrap_state |
+---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
| *10.239.2.241 | 10.239.2.241 |  centos  | /Users/user/rackspace/key.pem       |    22    |     80    |      http     |      admin       | default_tenant |     Complete    |
+---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+

...
{{< /highlight >}}

### show-current

#### Usage
`cfy profiles show-current [OPTIONS]`

Displays your current active profile and its properties.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy profiles show-current
...

Active profile:
+---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
|      name     |  manager_ip  | ssh_user |             ssh_key_path            | ssh_port | rest_port | rest_protocol | manager_username | manager_tenant | bootstrap_state |
+---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+
| *10.239.2.241 | 10.239.2.241 |  centos  | /Users/user/rackspace/key.pem       |    22    |     80    |      http     |      admin       | default_tenant |     Complete    |
+---------------+--------------+----------+-------------------------------------+----------+-----------+---------------+------------------+----------------+-----------------+

...
{{< /highlight >}}


### export

#### Usage
`cfy profiles export [OPTIONS]`

Export all profiles to a file


{{% warning title="Warning" %}}
Including the ssh keys of your profiles in the archive means that once the profiles are imported, the ssh keys will be put back in their original locations!
{{% /warning %}}

If `-o / --output-path` is omitted, the archive's name will be `cfy-
profiles.tar.gz`.

#### Optional flags

*  `--include-keys` - 	Include SSH key files in the archive.
*  `-o, --output-path TEXT` - The local path for the download.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy profiles export
...

Exporting profiles to /Users/assi/Work/repos/cfy-profiles.tar.gz...
Export complete!
You can import the profiles by running `cfy profiles import PROFILES_ARCHIVE`

...
{{< /highlight >}}

### import

#### Usage
`cfy profiles import [OPTIONS] ARCHIVE_PATH`

Import profiles from a profiles archive.

{{% warning title="Warning" %}}
If a profile exists both in the archive and locally it will be
overwritten (any other profiles will be left intact).
{{% /warning %}}

`ARCHIVE_PATH` is the path to the profiles archive to import.

#### Optional flags

* `--include-keys`  WARNING: Imports exported keys to their original locations.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy profiles import cfy-profiles.tar.gz
...

Importing profiles from cfy-profiles.tar.gz...
Import complete!
You can list profiles using `cfy profiles list`

...
{{< /highlight >}}

### delete

#### Usage
`cfy profiles delete [OPTIONS] PROFILE_NAME`

Delete a profile.

`PROFILE_NAME` is the IP of the {{< param cfy_manager_name >}} the profile manages.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy profiles delete 10.239.2.241
...

Deleting profile 10.239.2.241...
Profile deleted

...
{{< /highlight >}}

### use

#### Usage
`cfy profiles use [OPTIONS] MANAGER_IP`

Control a specific {{< param cfy_manager_name >}}.

`PROFILE_NAME` is the IP of the manager the profile manages.

Additional CLI commands are added after a {{< param cfy_manager_name >}} is used.<br>
To stop using the {{< param cfy_manager_name >}}, you can run `cfy init -r`.

#### Optional flags

*  `--profile-name TEXT` -  Name of the profile to use.
*  `-s, --ssh-user TEXT` -  The SSH user on the host machine with which to
                               SSH into the manager.
*  `-k, --ssh-key TEXT` -   The path to the SSH key-file to use when
                               connecting.
*  `--ssh-port INTEGER` -   The SSH port to use when connecting to the
                               Manager.
*  `-u, --manager-username TEXT` - Manager username used to run commands on the
                               Manager.
*  `-p, --manager-password TEXT` - Manager password used to run commands on the
                               Manager.
*  `-t, --manager-tenant TEXT` -  The tenant associated with the user currently
                               operating the Manager.
*  `--rest-port INTEGER` - The REST server's port.
*  `--ssl` -    Connect to REST server using SSL
*  `-c, --rest-certificate TEXT` - The REST server's external certificate file location (implies --ssl)
*  `--kerberos-env TEXT` - Whether or not to use kerberos while connecting to the manager
* `--skip-credentials-validation` - Do not check that the passed credentials are correct (default: False)


&nbsp;
#### Example

{{< highlight  bash  >}}
cfy profiles use 10.239.2.241 -t default_tenant -u admin -p admin
...

Initializing local profile ...
Initialization completed successfully
Attempting to connect...
Initializing profile 10.239.2.241...
Initialization completed successfully
Using manager 10.239.2.241 with port 80

...
{{< /highlight >}}

### set

#### Usage
`cfy profiles set [OPTIONS]`

Set the profile name, manager username and/or password and/or tenant in
  the *current* profile

#### Optional flags

*  `--profile-name TEXT` -  Name of the profile to use.
*  `-u, --manager-username TEXT` - Manager username used to run commands on the
                                 manager.
*  `-p, --manager-password TEXT` - Manager password used to run commands on the
                                 manager.
*  `-t, --manager-tenant TEXT` - The tenant associated with the current user
*  `-s, --ssh-user TEXT` - The SSH user on the manager host machine
                                 operating the manager.
*  `-k, --ssh-key TEXT` - The path to the ssh key-file to use when connecting
*  `--ssh-port TEXT` - The SSH port to use when connecting to the manager
*  `--ssl TEXT` - Required SSL state (on/off)
*  `-c, --rest-certificate TEXT` - The REST server's external certificate file location (implies --ssl)
*  `--kerberos-env TEXT` - Whether or not to use kerberos while connecting to the manager
*  `--skip-credentials-validation` - Do not check that the passed credentials are
                                 correct (default:False)
&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy profiles set -u admin
...

Validating credentials...
Credentials validated
Setting username to `admin`
Settings saved successfully

...
{{< /highlight >}}

### unset

#### Usage
`cfy profiles unset [OPTIONS]`

Clear the manager username and/or password and/or tenant from the
  *current* profile.

#### Optional flags

*  `-u, --manager-username` - Manager username used to run commands on the
                                 manager.
*  `-p, --manager-password` - Manager password used to run commands on the
                                 manager.
*  `-t, --manager-tenant` - The tenant associated with the current user
                                 operating the manager.
*  `-s, --ssh-user` - The SSH user on the manager host machine
*  `-k, --ssh-key` - The path to the ssh key-file to use when connecting
*  `-c, --rest-certificate` - The REST server's external certificate file location (implies --ssl)
*  `--kerberos-env` - Whether or not to use kerberos while connecting to the manager
* `--skip-credentials-validation` - Do not check that the passed credentials are
                                 correct. (default:False)

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy profiles unset -u
...

Validating credentials...
Credentials validated
Clearing manager username
Settings saved successfully

...
{{< /highlight >}}


### set-cluster

#### Usage
`cfy profiles set-cluster [OPTIONS] CLUSTER_NODE_NAME`

Set connection options for a cluster node.

#### Optional flags

*  `-s, --ssh-user TEXT` - The SSH user on the manager host machine
*  `-k, --ssh-key TEXT` - The path to the ssh key-file to use when connecting
*  `--ssh-port TEXT` - The SSH port to use when connecting to the manager
*  `-c, --rest-certificate TEXT` - The REST server's external certificate file location (implies --ssl)

&nbsp;
