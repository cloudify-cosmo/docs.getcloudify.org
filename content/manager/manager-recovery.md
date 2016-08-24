---

title: Recovery


weight: 900

---


## What is recovery?

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