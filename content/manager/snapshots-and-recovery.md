---

title: Snapshots & Recovery


weight: 1300
---

# Snapshots

A Snapshot is a Zip archive that contains all relevant data describing the state of a Cloudify Manager the moment the snapshot is created on this Manager. There are basically four operations associated with snapshots: creating, downloading, uploading and restoring them. For detailed information about snapshots related CLI commands, please visit this [link]({{ relRef("cli/snapshots.md") }}).

Common use cases for snapshots are:

* Backing up the Manager to be able to restore its state later on, should it become inconsistent or broken for whatever reason.
* Migrating to a newer Cloudify Manager version, by creating a snapshot on the old manager and restoring it on the new one. In this case, if you have any **installed** deployments, you should also execute the [install_new_agents]({{ relRef("workflows/built-in-workflows.md#the-install-new-agents-workflow") }}) workflow on the new manager so that all hosts agents get updated and connected to the new manager's RabbitMQ.

{% call c.warn("Security") %}
Snapshots are security-sensitive. Broker IP, SSL certificates and credentials are stored in snapshots, as well as keys to agent VMs if an appropriate flag was used on creating the snapshot.
{% endcall %}

{% call c.note("Known issues") %}
* If you create a snapshot on a Cloudify Manager, delete all blueprints and restore the snapshot on the same Manager, events will be duplicated.
* If you try to restore a snapshot to a non clean manager, the operation will not be prevented but will be unsuccessful.
{% endcall %}

{% call c.note("Known Limitation") %}
A snapshot can only be successfully restored to a clean manager, meaning newly created and without blueprints or deployments.
{% endcall %}

## Snapshot Contents

* **agents.json** - this file contains data necessary for the [install_new_agents]({{ relRef("workflows/built-in-workflows.md#the-install-new-agents-workflow") }}) workflow, mainly necessary to connect to the message broker of the Manager the snapshot has been created on.
* **es_data** - Dump of all ElasticSearch data except for provider context, snapshots and the create snapshot execution that created the snapshot.
* **metadata.json** - Helper file with flags telling the restore snapshot workflow how to proceed with its execution.
* **plugins** - Folder containing all plugins uploaded to the Manager.
* **snapshot-credentials** - `.pem` key files for all installed applications VMs.
* **blueprints** - Extracted blueprints uploaded to the Manager.
* **uploaded-blueprints** - Blueprints uploaded to the Manager as `.tar.gz` files.

## Using the Web UI
Snapshots management is done through the settings section in the Web UI.

## Advanced Topics

### Creating a snapshot on a Cloudify Manager 3.2.X

To create a snapshot on a `3.2`/`3.2.1` Cloudify Manager, use the [cloudify-3.2.1-snapshots-tool](https://github.com/cloudify-cosmo/cloudify-3.2.1-snapshots-tool). Its purpose is to make creating snapshots on Cloudify Managers 3.2.X possible - this feature has been introduced in the 3.3 version and is not available on earlier versions out of the box. Please see the [README.md](https://github.com/cloudify-cosmo/cloudify-3.2.1-snapshots-tool/blob/master/README.md) file in the tool's repository for more details.

# Recovery

Think of a scenario where you have already uploaded some blueprints
and created deployment using this manager. If at a certain point, for some
reason, the VM hosting the manager crashes, it would be nice to have the
ability to spin up another VM and use it as our management server.

## How is this possible?

Two crucial types need to be defined in the manager blueprint:

- `cloudify.openstack.nodes.FloatingIP` - Provides a way to have a fixed,
detachable public ip for VMs.

- `cloudify.openstack.nodes.Port` - Provides a way to have a fixed,
detachable private ip for VMs.

{% call c.note("Important") %}
Manager recovery is only supported in an openstack environment. This is due to the fact that the port type above, which is needed in order to have a fixed private ip, is openstack specific.
However, if another way to have a fixed private ip is available in another environment, managers in this environment could be recovered as well.
{% endcall %}

In addition to the two types above, the recovery process requires a valid snapshot of the manager. The snapshot encapsulates
the current state of the manager. After a fresh server will be started as part of the recovery process,
this snapshot will be uploaded to it, and will be used to modify its state to the one encapsulated in the snapshot.
To create a snapshot, use the snapshot create command:
```bash
cfy snapshots create -s my_snapshot
```

{% call c.note("Note") %}
To learn more about the snapshots CLI command, see [here](http://cloudify-cli.readthedocs.org/en/3.3/commands.html).
{% endcall %}

Having all of these available makes recovery a rather straightforward
process:

1. Detach floating ip and port from the server.
2. Terminate the server.
3. Spin up a new server.
4. Attach floating ip and port to new server.
5. Restore the manager state using the given snapshot.

If you think about it, this flow exactly describes a *heal* workflow (excluding step 5), where
the failing node instance is the management server.
In fact, what we do under the hood is simply call the *heal* workflow in
this manner.

{% call c.tip("Tip") %}
The *heal* workflow is a generic workflow that allows for the recovery from
any node instance failure. To learn more see [Heal Workflow]({{ relRef("workflows/built-in-workflows.md#the-heal-workflow") }})
{% endcall %}

## Usage

To use this ability we have added a new command in our [CLI]({{ relRef("cli/reference.html") }}) called *cfy recover*.

You can use this command from any machine, not necessarily the machine you
used to bootstrap your manager. To run it from a different
machine, like all other cloudify commands, you must first execute the *cfy
use* command.
For example, if we have a manager on ip 192.168.11.66:

```bash
cfy use -t 192.168.11.66
```

From this point onwards (given you've previously created a snapshot of
the manager) you can execute the *recover* command if the manager
is malfunctioning.

{% call c.note("Note") %}
The recover command is somewhat destructive, since it will stop and delete
resources, for this reason, using it will require passing the *force* flag.
{% endcall %}

Like we already mentioned, eventually, running the *recover*
will trigger the *heal* workflow, so the output will look something like this:

```bash
cfy recover -f --snapshot-path /path/to/snapshot.zip
Recovering manager deployment
2015-02-17 16:21:21 CFY <manager> Starting 'heal' workflow execution
2015-02-17 16:21:21 LOG <manager> INFO: Starting 'heal' workflow on manager_15314, Diagnosis: Not provided
2015-02-17 16:21:22 CFY <manager> [manager_15314] Stopping node
...
...
2015-02-17 16:22:02 CFY <manager> [manager_server_1eed2->manager_server_ip_3978e|unlink] Task started 'nova_plugin.server.disconnect_floatingip'
2015-02-17 16:22:12 CFY <manager> [manager_server_1eed2->manager_port_ceb8e|unlink] Sending task 'neutron_plugin.port.detach' [attempt 2/6]
2015-02-17 16:22:30 CFY <manager> [manager_server_1eed2->manager_server_ip_3978e|unlink] Task succeeded 'nova_plugin.server.disconnect_floatingip'
2015-02-17 16:22:30 CFY <manager> [manager_server_1eed2->manager_port_ceb8e|unlink] Task started 'neutron_plugin.port.detach' [attempt 2/6]
2015-02-17 16:22:36 LOG <manager> [manager_server_1eed2->manager_port_ceb8e|unlink] INFO: Detaching port 226704ce-fae5-4c2b-aa82-234515ef9e13...
2015-02-17 16:22:37 LOG <manager> [manager_server_1eed2->manager_port_ceb8e|unlink] INFO: Successfully detached port 226704ce-fae5-4c2b-aa82-234515ef9e13
2015-02-17 16:22:37 CFY <manager> [manager_server_1eed2->manager_port_ceb8e|unlink] Task succeeded 'neutron_plugin.port.detach' [attempt 2/6]
...
...
2015-02-17 16:26:42 LOG <manager> [manager_15314.start] INFO: waiting for cloudify management services to restart
2015-02-17 16:27:35 LOG <manager> [manager_15314.start] INFO: Recovering deployments...
...
...
2015-02-17 16:27:42 CFY <manager> 'heal' workflow execution succeeded
...
Uploading snapshot 'snapshot.zip' to management server 185.98.149.170 as restored-snapshot
Restoring snapshot 'restored-snapshot'...
Successfully recovered manager deployment
```


{% call c.warn("Limitations") %}
<br>
There is a scenario where the recovery workflow will not function
properly and is not supported:

If management server VM was terminated using the cloud API, the associated port (or its equivalent in a non-openstack environment) will also be deleted. This means we wont have any way of ensuring the new server will have the same private ip as before, which is necessary for agents to communicate with the manager.
{% endcall %}