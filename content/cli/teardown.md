---
layout: bt_wiki
title: teardown
category: Docs
draft: true
abstract: Cloudify's Command-Line Interface
weight: 220
---

The `cfy teardown` command is used to teardown a manager and all its attached resources.

{{% gsNote title="Note" %}}
The teardown process removes the Cloudify Manager VM and any security groups, IP addresses, key pairs that were provisioned during the bootstrap process. Note that, if you used the simple-manager-blueprint to bootstrap Cloudify Manager, no resources are deleted but Cloudify Manager becomes non-functional after the teardown.
{{% /gsNote %}}


Usage: `cfy teardown [OPTIONS]`

Teardown Cloudify Manager.

#### Required flags

* `-f, --force` - 		This is mandatory for performing the teardown.


#### Optional flags


* `--ignore-deployments` -	
						Tear down even if there are existing
                        deployments on the manager
* `--task-retries INTEGER` - 
						How many times should a task be retried in
                        case of failure [default: 0]
* `--task-retry-interval INTEGER` - 
						How many times should a task be retried in
                        case of failure [default: 1]
* `--task-thread-pool-size INTEGER` - 
                      	The size of the thread pool to execute tasks
                        in [default: 1]


&nbsp;
#### Example

```markdown
$ cfy teardown -f --ignore-deployments
...

Using manager 52.31.106.71 with port 80
2016-06-29 14:11:10 CFY <manager> Starting 'uninstall' workflow execution
2016-06-29 14:11:10 CFY <manager> [sanity_dee2c] Stopping node
2016-06-29 14:11:10 CFY <manager> [webui_ef68c] Stopping node
.
.
.
2016-06-29 14:11:25 CFY <manager> [rest_service_fd6df.stop] Task succeeded 'fabric_plugin.tasks.run_script'
2016-06-29 14:11:26 CFY <manager> [rest_service_fd6df] Deleting node
2016-06-29 14:11:26 CFY <manager> [elasticsearch_8d1cf] Stopping node
2016-06-29 14:11:26 CFY <manager> [rabbitmq_023a2] Stopping node
.
.
.
2016-06-29 14:12:56 LOG <manager> [agents_security_group_c58f4.delete] INFO: Attempted to delete Security Group: sg-2f503548.
2016-06-29 14:12:56 CFY <manager> [agents_security_group_c58f4.delete] Task succeeded 'ec2.securitygroup.delete'
2016-06-29 14:12:56 CFY <manager> 'uninstall' workflow execution succeeded

...
```