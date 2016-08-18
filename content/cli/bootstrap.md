---
layout: bt_wiki
title: bootstrap
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 30
---

The `cfy bootstrap` command is used to bootstrap Cloudify manager.

{{% gsNote title="Note" %}}
After bootstrapping a manager, the user and ssh-key provided to use it will be used to perform ssh related commands (e.g. `cfy logs`, `cfy ssh`) are saved on the machine which performed the bootstrap process. Running `cfy use` to control another manager will remove those settings and will NOT set the user and ssh-key to the manager you ran `cfy use` on.
{{% /gsNote %}}

See [bootstrapping]({{< relref "manager/bootstrapping.md" >}}) for more information.


Usage: `cfy bootstrap [OPTIONS] BLUEPRINT_PATH`

Bootstrap a Cloudify manager

`BLUEPRINT_PATH` -      is a path to the manager-blueprint used to bootstrap the
                        manager.

Note that `--validate-only` will validate resource creation without
actually validating the host's OS type, Available Memory, etc.. as the
host doesn't necessarily exist prior to bootstrapping.

`--skip-validations`, on the other hand, will skip both resource creation
validation AND any additional validations done on the host once it is up.

#### Optional flags

*  `-i, --inputs=INPUTS` -
                        Inputs for a Manager blueprint (Can be provided as
                        wildcard based paths (*.yaml, etc..) to YAML files, a
                        JSON string or as "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--validate-only` -  Only perform resource creation validation
                        without actually bootstrapping
*  `--skip-validations` -  
                        BBootstrap without validating resource
                        creation prior to bootstrapping the manager
*  `--skip-sanity` -    Bootstrap without performing the post-
                        bootstrap sanity test
*  `--install-plugins` -    
                        Install the necessary plugins for the given blueprint
*  `--task-retries= INTEGER` -
                        How many times should a task be retried in case of
                        failure (default: 0)
*  `--task-retry-interval= INTEGER` -
                        How many seconds to wait before each task is retried
                        (default: 30)
*  `--task-thread-pool-size INTEGER` -
                        The size of the thread pool to execute tasks
                        in [default: 1]
*  `--keep-up-on-failure` - 
                        Do not teardown the Manager even if the bootstrap fails
*  `-v, --verbose -     Show verbose output. You can supply this up
                        to three times (i.e. -vvv)
*  `-h, --help          Show this message and exit


&nbsp;
#### Example

```markdown
$ cfy bootstrap --install-plugins cloudify-manager-blueprints/aws-ec2-manager-blueprint.yaml -i cloudify-manager-blueprints/aws-ec2-manager-blueprint-inputs.yaml --task-retries 20
...

Initializing profile FDWQC0...
Initialization completed successfully
Executing bootstrap validation...
Initializing blueprint...
.
.
.
Bootstrap validation completed successfully
Executing manager bootstrap...
Initializing blueprint..
.
.
.
2016-08-02 12:25:29.438  LOG <manager> [sanity_sq7n1e.start] INFO: Saving sanity input configuration to /opt/cloudify/sanity/node_properties/properties.json
2016-08-02 12:25:31.774  CFY <manager> [sanity_sq7n1e.start] Task succeeded 'fabric_plugin.tasks.run_script'
2016-08-02 12:25:33.364  CFY <manager> 'install' workflow execution succeeded
.
.
.
Uploading resources from /var/folders/p3/xrjr1c953yv5fnk719ndljnr0000gn/T/tmpSt_0Hn/types.yaml to /opt/manager/resources/spec/cloudify/3.5m1
[52.51.21.53] run: sudo mkdir -p /opt/manager/resources/spec/cloudify/3.5m1
[52.51.21.53] put: /var/folders/p3/xrjr1c953yv5fnk719ndljnr0000gn/T/tmpSt_0Hn/types.yaml -> /opt/manager/resources/spec/cloudify/3.5m1/types.yaml
Bootstrap complete
Manager is up at 52.51.21.53

...
```