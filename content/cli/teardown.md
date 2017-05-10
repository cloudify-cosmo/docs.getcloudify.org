---
layout: bt_wiki
title: teardown
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 220
---

The `cfy teardown` command is used to teardown a Cloudify Manager and all its attached resources. The command deletes the Manager, including all resources and components that were installed during bootstrapping.

{{% gsNote title="Note" %}}
The teardown process does not remove the VM on which Cloudify Manager is installed.
{{% /gsNote %}}

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

#### Usage 
`cfy teardown [OPTIONS]`

Teardown a Cloudify Manager.

#### Required flags

* `-f, --force` - 		This is mandatory for performing the teardown.


#### Optional flags


* `--ignore-deployments` -	
						Tear down even if there are existing
                        deployments on the manager
* `--task-retries INTEGER` - 
						Deprecated
* `--task-retry-interval INTEGER` - 
						Deprecated
* `--task-thread-pool-size INTEGER` - 
                      	Deprecated


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy teardown -f --ignore-deployments
...

Using manager 10.239.0.243 with port 80
2017-05-09 13:53:30.512  CFY <manager> Starting 'uninstall' workflow execution
2017-05-09 13:53:30.661  CFY <manager> [syncthing_jopub5] Stopping node
2017-05-09 13:53:30.662  CFY <manager> [sanity_nobz4v] Stopping node
2017-05-09 13:53:30.662  CFY <manager> [stage_si8ij2] Stopping node
2017-05-09 13:53:30.662  CFY <manager> [manager_ip_setter_dz9wjz] Stopping node
.
.
.
---
layout: bt_wiki
title: teardown
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 220
---

The `cfy teardown` command is used to teardown a Cloudify Manager and all its attached resources. The command deletes the Manager, including all resources and components that were installed during bootstrapping. You can bootstrap a new Cloudify Manager on the same VM after the teardown is complete.

{{% gsNote title="Note" %}}
The teardown process does not remove the VM on which Cloudify Manager is installed.
{{% /gsNote %}}

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

#### Usage 
`cfy teardown [OPTIONS]`

Teardown a Cloudify Manager.

#### Required flags

* `-f, --force` - 		This is mandatory for performing the teardown.


#### Optional flags


* `--ignore-deployments` -	
						Tear down even if there are existing
                        deployments on the Manager
* `--task-retries INTEGER` - 
						Deprecated
* `--task-retry-interval INTEGER` - 
						Deprecated
* `--task-thread-pool-size INTEGER` - 
                      	Deprecated


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy teardown -f 
...

Using manager 10.239.0.243 with port 80
2017-05-09 13:53:30.512  CFY <manager> Starting 'uninstall' workflow execution
2017-05-09 13:53:30.661  CFY <manager> [syncthing_jopub5] Stopping node
2017-05-09 13:53:30.662  CFY <manager> [sanity_nobz4v] Stopping node
2017-05-09 13:53:30.662  CFY <manager> [stage_si8ij2] Stopping node
2017-05-09 13:53:30.662  CFY <manager> [manager_ip_setter_dz9wjz] Stopping node
.
.
.
2017-05-09 13:54:32.133  CFY <manager> [rest_service_mr22ky] Stopping node
2017-05-09 13:54:32.288  CFY <manager> [rest_service_mr22ky.stop] Sending task 'fabric_plugin.tasks.run_script'
2017-05-09 13:54:32.298  CFY <manager> [rest_service_mr22ky.stop] Task started 'fabric_plugin.tasks.run_script'
2017-05-09 13:54:32.965  LOG <manager> [rest_service_mr22ky.stop] INFO: Stopping Cloudify REST Service...
2017-05-09 13:54:33.467  CFY <manager> [rest_service_mr22ky.stop] Task succeeded 'fabric_plugin.tasks.run_script'
2017-05-09 13:54:34.313  CFY <manager> [rest_service_mr22ky] Deleting node
2017-05-09 13:54:34.413  CFY <manager> [rest_service_mr22ky.delete] Sending task 'fabric_plugin.tasks.run_script'
2017-05-09 13:54:34.427  CFY <manager> [rest_service_mr22ky.delete] Task started 'fabric_plugin.tasks.run_script'
2017-05-09 13:54:35.320  LOG <manager> [rest_service_mr22ky.delete] INFO: Uninstalling restservice
2017-05-09 13:54:36.954  LOG <manager> [rest_service_mr22ky.delete] INFO: yum removing cloudify-rest-service...
2017-05-09 13:54:38.934  CFY <manager> [rest_service_mr22ky.delete] Task succeeded 'fabric_plugin.tasks.run_script'
.
.
.
2017-05-09 13:55:06.354  CFY <manager> [manager_resources_x1i341.delete] Task succeeded 'fabric_plugin.tasks.run_script'
2017-05-09 13:55:06.648  CFY <manager> [manager_configuration_bwssw0] Stopping node
2017-05-09 13:55:07.346  CFY <manager> [manager_configuration_bwssw0] Deleting node
2017-05-09 13:55:07.742  CFY <manager> [manager_host_qgj0gc] Stopping node
2017-05-09 13:55:08.538  CFY <manager> [manager_host_qgj0gc] Deleting node
2017-05-09 13:55:08.923  CFY <manager> 'uninstall' workflow execution succeeded

{{< /gsHighlight >}}