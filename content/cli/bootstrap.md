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
After bootstrapping a Cloudify Manager, the user and provided SSH-key that are used to perform SSH-related commands (e.g. `cfy logs`, `cfy ssh`) are saved on the machine on which the bootstrap process occurred. Running `cfy use` to control another Cloudify Manager removes those settings and does NOT set the user and SSH key to the Cloudify Manager on which you ran `cfy use`.
{{% /gsNote %}}

See [bootstrapping]({{< relref "installation/installing_manager.md" >}}) for more information.


#### Usage 
`cfy bootstrap [OPTIONS] BLUEPRINT_PATH`

Bootstrap a Cloudify manager

`BLUEPRINT_PATH` -      is a path to the manager-blueprint used to bootstrap the
                        manager.

Note that `--validate-only` validates resource creation without
actually validating the host's OS type, available memory, etc. because the
host does not necessarily exist prior to bootstrapping.

`--skip-validations` skips both resource creation
validation *and* any additional validations performed on the host after it is running.

#### Optional flags

*  `-n --blueprint-filename TEXT`     The name of the archive's main blueprint. Only relevant when uploading an archive. 

*  `-i, --inputs TEXT` -
                        Inputs for the deployment. Can be provided as
                        wildcard-based paths (*.yaml, etc..) to YAML files; a
                        JSON string; or "key1=value1;key2=value2"). This
                        argument can be used multiple times.
*  `--validate-only` -  Only perform resource creation validation
                        without actually bootstrapping
*  `--skip-validations` -  
                        Bootstrap without validating resource
                        creation prior to bootstrapping the manager
*  `--skip-sanity` -    Bootstrap without performing the post-
                        bootstrap sanity test
*  `--install-plugins` -    
                        Install the necessary plugins for the specified blueprint
*  `--task-retries= INTEGER` -
                        Number of times should a task be retried in case of
                        failure (default: 0)
*  `--task-retry-interval= INTEGER` -
                        Number of seconds to wait before each task is retried
                        (default: 30)
*  `--task-thread-pool-size INTEGER` -
                        The size of the thread pool in which to execute tasks
                        [default: 1]
*  `--keep-up-on-failure` - 
                        Do not teardown the Manager, even if the bootstrap fails
*  `--dont-save-password-in-profile` -
                                  After bootstrap is complete, do not save
                                  the password in the profile context.
                                  Regardless, the password is *always*
                                  printed to the console [default: False]
*  `-v, --verbose` -    Show verbose output. You can supply this up
                        to three times (i.e. -vvv)
*  `-h, --help` -       Show this message and exit


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy bootstrap simple-manager-blueprint.yaml -i simple-manager-blueprint-inputs.yaml --install-plugins
...

Initializing profile temp-H7FZZ7...
Initialization completed successfully
Generated password: cQkvEEUW1QM7
Executing manager bootstrap...
Initializing blueprint...
Collecting https://github...
.
.
.
2017-03-29 12:27:12.582  CFY <manager> 'execute_operation' workflow execution succeeded
Bootstrap complete
Manager is up at 35.157.9.188
##################################################
Manager password is cQkvEEUW1QM7
##################################################

...
{{< /gsHighlight >}}
