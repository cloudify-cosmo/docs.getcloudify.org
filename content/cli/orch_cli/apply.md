---
layout: bt_wiki
title: apply
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/apply/
---

The `cfy apply` command is used to install/update a deployment of application using a {{< param product_name >}} manager without having to manually go through the process of uploading a blueprint, creating a deployment and executing a workflow.
`cfy apply` command using `cfy install` or `cfy deployments update` logic depends on existence of `DEPLOYMENT_ID`.  

It is recommended to read about `cfy install` and `cfy deployments update` in order to understand `cfy apply` command.

`cfy apply` logic:

Given `BLUPRINT_PATH` and `DEPLOYMENT_ID`:

1. Check if deployment `DEPLOYMENT_ID` exists.
   
2. Upload blueprint `BLUPRINT_PATH` to the manager.
   
3. If deployment `DEPLOYMENT_ID` exists,perform deployment update with the uploaded blueprint. 
   Else, create new deployment `DEPLOYMENT_ID` and execute install workflow.
   
#### Usage 
`cfy apply [OPTIONS] BLUEPRINT_PATH DEPLOYMENT_ID`

Apply command uses `cfy install` or `cfy deployments update` depends on
existence of DEPLOYMENT_ID deployment.

If the deployment exists, the deployment will be updated with the
given blueprint.
Otherwise the blueprint will installed (the deployment name will be
DEPLOYMENT_ID).
In both cases the blueprint is being uploaded to the manager.

`BLUEPRINT_PATH` can be a:
    - local blueprint yaml file
    - blueprint archive
    - url to a blueprint archive
    - github repo (`organization/blueprint_repo[:tag/branch]`)

Supported archive types are: zip, tar, tar.gz and tar.bz2

`DEPLOYMENT_ID` is the deployment's id to install/update.
Install an application via the manager


#### Optional flags
This command supports the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

*  `-n, --blueprint-filename TEXT ` -
   The name of the archive's main blueprint file. 
   This is only relevant if uploading an archive.

*  `-b, --blueprint-id TEXT` - The unique identifier for the blueprint.
   
*  `-i, --inputs TEXT` - Inputs for the deployment (Can be provided as
   wildcard based paths (*.yaml, /my_inputs/, etc..) to YAML files, a JSON
   string or as 'key1=value1;key2=value2'). This argument can be used multiple times.

*  `-r, --reinstall-list TEXT` - Node instances ids to be reinstalled as part
   of deployment update. They will be reinstalled even if the flag --skip-reinstall
   has been supplied.

*  `-w, --workflow-id TEXT` - The workflow to execute [default: None]
   
*  `--skip-install` - Skip install lifecycle operations.
   
*  `--skip-uninstall` - Skip uninstall lifecycle operations.
   
*  ` --dont-skip-reinstall` - Reinstall node-instances that their
   properties has been modified, as part of a deployment update.
   Node instances that were explicitly given to the reinstall list will
   be reinstalled too.

*  `--ignore-failure` -  Supply the parameter `ignore_failure` with
  the value `true` to the uninstall workflow.

*  `--install-first` - In deployment update, perform install workflow and
   then uninstall workflow. default: uninstall and then install.

*  `--preview` - Preview the deployment update, stating what changes will be
   made without actually applying any changes.

*  `--dont-update-plugins` - Don't update the plugins.
   
*  `-f, --force` - Force running update in case a previous update on this
   deployment has failed to finish successfully [This option is deprecated].

*  `-l, --visibility TEXT` - Defines who can see the resource, can be set
   to one of ['private', 'tenant', 'global'] [default: tenant].

*  `--validate` - Validate the blueprint first.
   
*   `--include-logs / --no-logs` - Include logs in returned events [default:True].

*  `--json-output` - Output events in a consumable JSON format.
   
*  `--manager TEXT`- Connect to a specific manager by IP or host.


* `--runtime-only-evaluation` - If set, all intrinsic functions will only be
  evaluated at runtime, and no intrinsic functions will be evaluated at parse
  time(such as get_input, get_property).

*  `--auto-correct-types` - If set, before creating plan for a new deployment,
   an attempt will be made to cast old inputs' values to the valid types
   declared in blueprint.

*  `--reevaluate-active-statuses` - If set, before attempting to update, the
   statuses of previous active update operations will be reevaluated based on
   relevant executions' statuses.  `terminated` executions will be mapped to
   `successful` updates, while `failed` and any `*cancel*` statuses will be
   mapped to `failed`.

*  `--skip-plugins-validation` - Determines whether to validate if the
   required deployment plugins exist on the manager. If validation is skipped,
   plugins containing source URL will be installed from source.

*  `-p, --parameters TEXT` - Parameters for the workflow (Can be provided
   as wildcard based paths (*.yaml, /my_inputs/, etc..) to YAML files, a JSON
   string or as 'key1=value1;key2=value2'). This argument can be used multiple times.

*  `--allow-custom-parameters` - Allow passing custom parameters (which were
   not defined in the workflow's schema in the blueprint) to the execution.



#### Example

{{< highlight  bash  >}}
$ cfy apply  blueprint.yaml demo-deployment 
Uploading blueprint blueprint.yaml...
 blueprint.yaml |######################################################| 100.0%
Blueprint `resources` upload started.
2021-03-21 06:45:17.078  CFY <None> Starting 'upload_blueprint' workflow execution
2021-03-21 06:45:17.104  LOG <None> INFO: Blueprint archive uploaded. Extracting...
2021-03-21 06:45:17.137  LOG <None> INFO: Blueprint archive extracted. Parsing...
2021-03-21 06:45:17.731  LOG <None> INFO: Blueprint parsed. Updating DB with blueprint plan.
2021-03-21 06:45:17.813  CFY <None> 'upload_blueprint' workflow execution succeeded
Blueprint uploaded. The blueprint's id is resources
Creating new deployment from blueprint resources...
Deployment created. The deployment's id is demo-deployment
Executing workflow `install` on deployment `demo-deployment` [timeout=900 seconds]
2021-03-21 06:45:21.168  CFY <demo-deployment> Starting 'install' workflow execution
2021-03-21 06:45:21.349  CFY <demo-deployment> [node_b_perev1] Validating node instance before creation: nothing to do
2021-03-21 06:45:21.350  CFY <demo-deployment> [node_b_perev1] Precreating node instance: nothing to do
2021-03-21 06:45:21.352  CFY <demo-deployment> [node_b_perev1] Creating node instance: nothing to do
2021-03-21 06:45:21.353  CFY <demo-deployment> [node_b_perev1] Configuring node instance: nothing to do
2021-03-21 06:45:21.355  CFY <demo-deployment> [node_b_perev1] Starting node instance
2021-03-21 06:45:21.633  CFY <demo-deployment> [node_b_perev1.start] Sending task 'script_runner.tasks.run'
2021-03-21 06:45:22.270  LOG <demo-deployment> [node_b_perev1.start] INFO: Downloaded install.py to /tmp/UXNNP/install.py
2021-03-21 06:45:22.575  CFY <demo-deployment> [node_b_perev1.start] Task succeeded 'script_runner.tasks.run'
2021-03-21 06:45:22.576  CFY <demo-deployment> [node_b_perev1] Poststarting node instance: nothing to do
2021-03-21 06:45:22.579  CFY <demo-deployment> [node_b_perev1] Node instance started
2021-03-21 06:45:22.772  CFY <demo-deployment> [node_a_5s612r] Validating node instance before creation: nothing to do
2021-03-21 06:45:22.774  CFY <demo-deployment> [node_a_5s612r] Precreating node instance: nothing to do
2021-03-21 06:45:22.775  CFY <demo-deployment> [node_a_5s612r] Creating node instance: nothing to do
2021-03-21 06:45:22.776  CFY <demo-deployment> [node_a_5s612r] Configuring node instance: nothing to do
2021-03-21 06:45:22.778  CFY <demo-deployment> [node_a_5s612r] Starting node instance
2021-03-21 06:45:23.063  CFY <demo-deployment> [node_a_5s612r.start] Sending task 'script_runner.tasks.run'
2021-03-21 06:45:23.678  LOG <demo-deployment> [node_a_5s612r.start] INFO: Downloaded install.py to /tmp/RXNC6/install.py
2021-03-21 06:45:23.998  CFY <demo-deployment> [node_a_5s612r.start] Task succeeded 'script_runner.tasks.run'
2021-03-21 06:45:23.999  CFY <demo-deployment> [node_a_5s612r] Poststarting node instance: nothing to do
2021-03-21 06:45:24.000  CFY <demo-deployment> [node_a_5s612r] Node instance started
2021-03-21 06:45:24.176  CFY <demo-deployment> 'install' workflow execution succeeded
Finished executing workflow install on deployment demo-deployment
* Run 'cfy events list 1ae4af9f-d7b5-4c2c-b657-0de150ad665b' to retrieve the execution's events/logs

{{< /highlight >}}

On the first invoke the blueprint uploaded and `demo-deployment` deployment created and installed. 

Before the second invocation, `node_c` added to the blueprint.

{{< highlight  bash  >}}
$ cfy apply  blueprint.yaml demo-deployment --dont-skip-reinstall
Deployment demo-deployment found, updating deployment.
Uploading blueprint blueprint.yaml...
 blueprint.yaml |######################################################| 100.0%
Blueprint `demo-deployment-21-03-2021-08-51-26` upload started.
2021-03-21 06:51:27.734  CFY <None> Starting 'upload_blueprint' workflow execution
2021-03-21 06:51:27.759  LOG <None> INFO: Blueprint archive uploaded. Extracting...
2021-03-21 06:51:27.788  LOG <None> INFO: Blueprint archive extracted. Parsing...
2021-03-21 06:51:28.376  LOG <None> INFO: Blueprint parsed. Updating DB with blueprint plan.
2021-03-21 06:51:28.459  CFY <None> 'upload_blueprint' workflow execution succeeded
Blueprint uploaded. The blueprint's id is demo-deployment-21-03-2021-08-51-26
Updating deployment demo-deployment, using blueprint demo-deployment-21-03-2021-08-51-26
2021-03-21 06:51:31.360  CFY <demo-deployment> Starting 'update' workflow execution
2021-03-21 06:51:31.637  CFY <demo-deployment> [node_c_7i8sj4] Node instance started (nothing to do)
2021-03-21 06:51:32.471  CFY <demo-deployment> 'update' workflow execution succeeded
Finished executing workflow 'update' on deployment 'demo-deployment'
Successfully updated deployment demo-deployment. Deployment update id: demo-deployment-122e55ed-8616-4ad4-94fc-8aea8ef7d356. Execution id: f2c199cd-e3c7-43d6-a579-5e3d075c2b18

{{< /highlight >}}

In second invocation the updated blueprint uploaded and deployment-update is executed.
