---
title: apply
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/apply/
---

The `cfy apply` command is used to install/update a deployment using {{< param product_name >}} manager without having to manually go through the process of uploading a blueprint, creating a deployment, and executing a workflow.
`cfy apply` command uses `cfy install` or `cfy deployments update` logic depending on the existence of the deployment referenced by `DEPLOYMENT_ID`. 

It is recommended to read about [`cfy install`]({{< relref "cli/orch_cli/install.md" >}}) and [`cfy deployments update`]({{< relref "cli/orch_cli/deployments.md#update" >}}) in order to understand the `cfy apply` command.

`cfy apply` designed to improve blueprints development lifecycle.
For example, during blueprint development and testing, it is useful to be able to quickly deploy and install the updated blueprint, overriding the existing deployment with the new changes.


`cfy apply` logic:

1. Check for `BLUPRINT_PATH` and `DEPLOYMENT_ID`.

2. If `BLUPRINT_PATH` is missing, use the default value and infer `DEPLOYMENT_ID`(explained in the usage section).

3. Check if deployment `DEPLOYMENT_ID` exists.
 
4. Upload blueprint `BLUPRINT_PATH` to the manager.
 
5. If deployment `DEPLOYMENT_ID` exists, perform a deployment update with the uploaded blueprint.
  Else, create a new deployment with the name `DEPLOYMENT_ID`, and execute the `install` workflow.


#### Usage 
`cfy apply [OPTIONS]`

The `cfy apply` command uses the `cfy install` or `cfy deployments update`  
depending on the existence of the deployment specified by `DEPLOYMENT_ID`.

If the deployment exists, the deployment will be updated with the given blueprint.
Otherwise, the blueprint will be installed, and the deployment name will be `DEPLOYMENT_ID`.
In both cases, the blueprint will be uploaded to the manager.

`BLUEPRINT_PATH` can be a:

- local blueprint yaml file.
- blueprint archive.
- URL to a blueprint archive.
- GitHub repo (`organization/blueprint_repo[:tag/branch]`).

Supported archive types are zip, tar, tar.gz, and tar.bz2

`DEPLOYMENT_ID` is the deployment's id to install/update.

Default values:

If `BLUEPRINT_PATH` is not provided, the default blueprint path is
'blueprint.yaml' in the current working directory.
If DEPLOYMENT_ID is not provided, it will be inferred from the `BLUEPRINT_PATH`
in one of the following ways:

- If `BLUEPRINT_PATH` is a local file path, then `DEPLOYMENT_ID` will be the name of the blueprint directory.
- If `BLUEPRINT_PATH` is an archive and --blueprint-filename/-n option is not provided, then `DEPLOYMENT_ID` will be the name of the blueprint directory.
- If `BLUEPRINT_PATH` is an archive and --blueprint-filename/-n option is provided, then `DEPLOYMENT_ID` will be  **\<blueprint directory name>.\<blueprint_filename>**.

#### Optional flags

This command supports the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

*  `-p, --blueprint-path PATH` - 
   The path to the application's blueprint file. 
   Can be a: 
    - local blueprint yaml file 
    - blueprint archive 
    - url to a blueprint archive 
    - github repo(`organization/blueprint_repo[:tag/branch]`)
*  ` -d, --deployment-id TEXT` - The unique identifier for the deployment.

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


* `--blueprint-labels TEXT` - labels list of the form <key>:<value>,<key>:<value>.

* `--deployment-labels TEXT` - labels list of the form <key>:<value>,<key>:<value>.

#### Example using default values
In a folder called `resources` with `blueprint.yaml` inside:
{{< highlight  bash  >}}
$ cfy apply 
No blueprint path provided, using default: /home/..../resources/blueprint.yaml
Trying to find deployment resources
Uploading blueprint /home/..../resources/blueprint.yaml...
 blueprint.yaml |######################################################| 100.0%
Blueprint `resources` upload started.
2021-03-31 14:07:32.306  CFY <None> Starting 'upload_blueprint' workflow execution
2021-03-31 14:07:32.335  LOG <None> INFO: Blueprint archive uploaded. Extracting...
2021-03-31 14:07:32.368  LOG <None> INFO: Blueprint archive extracted. Parsing...
2021-03-31 14:07:33.290  LOG <None> INFO: Blueprint parsed. Updating DB with blueprint plan.
2021-03-31 14:07:33.375  CFY <None> 'upload_blueprint' workflow execution succeeded
Blueprint uploaded. The blueprint's id is resources
Creating new deployment from blueprint resources...
Deployment created. The deployment's id is resources
Executing workflow `install` on deployment `resources` [timeout=900 seconds]
2021-03-31 14:07:36.565  CFY <resources> Starting 'install' workflow execution
2021-03-31 14:07:36.768  CFY <resources> [node_b_cfrr7p] Validating node instance before creation: nothing to do
2021-03-31 14:07:36.769  CFY <resources> [node_b_cfrr7p] Precreating node instance: nothing to do
2021-03-31 14:07:36.771  CFY <resources> [node_b_cfrr7p] Creating node instance: nothing to do
2021-03-31 14:07:36.773  CFY <resources> [node_b_cfrr7p] Configuring node instance: nothing to do
2021-03-31 14:07:36.774  CFY <resources> [node_b_cfrr7p] Starting node instance
2021-03-31 14:07:37.057  CFY <resources> [node_b_cfrr7p.start] Sending task 'script_runner.tasks.run'
2021-03-31 14:07:37.638  LOG <resources> [node_b_cfrr7p.start] INFO: Downloaded install.py to /tmp/C9QFC/install.py
2021-03-31 14:07:37.638  LOG <resources> [node_b_cfrr7p.start] INFO: hi!!
2021-03-31 14:07:37.908  CFY <resources> [node_b_cfrr7p.start] Task succeeded 'script_runner.tasks.run'
2021-03-31 14:07:37.909  CFY <resources> [node_b_cfrr7p] Poststarting node instance: nothing to do
2021-03-31 14:07:37.911  CFY <resources> [node_b_cfrr7p] Node instance started
2021-03-31 14:07:38.120  CFY <resources> [node_a_vfhhzn] Validating node instance before creation: nothing to do
2021-03-31 14:07:38.123  CFY <resources> [node_a_vfhhzn] Precreating node instance: nothing to do
2021-03-31 14:07:38.124  CFY <resources> [node_a_vfhhzn] Creating node instance: nothing to do
2021-03-31 14:07:38.125  CFY <resources> [node_a_vfhhzn] Configuring node instance: nothing to do
2021-03-31 14:07:38.126  CFY <resources> [node_a_vfhhzn] Starting node instance
2021-03-31 14:07:38.432  CFY <resources> [node_a_vfhhzn.start] Sending task 'script_runner.tasks.run'
2021-03-31 14:07:39.101  LOG <resources> [node_a_vfhhzn.start] INFO: Downloaded install.py to /tmp/E6KY5/install.py
2021-03-31 14:07:39.102  LOG <resources> [node_a_vfhhzn.start] INFO: hi!!
2021-03-31 14:07:39.480  CFY <resources> [node_a_vfhhzn.start] Task succeeded 'script_runner.tasks.run'
2021-03-31 14:07:39.481  CFY <resources> [node_a_vfhhzn] Poststarting node instance: nothing to do
2021-03-31 14:07:39.484  CFY <resources> [node_a_vfhhzn] Node instance started
2021-03-31 14:07:39.661  CFY <resources> 'install' workflow execution succeeded
Finished executing workflow install on deployment resources
* Run 'cfy events list 57ad1536-8904-48cf-8521-70abeefa0c60' to retrieve the execution's events/logs
{{< /highlight >}}

In the first invocation, the blueprint was uploaded and `resources` deployment was created and installed. 

Before the second invocation, `node_c` was added to the blueprint.

{{< highlight  bash  >}}
$ cfy apply 
No blueprint path provided, using default: /home/..../resources/blueprint.yaml
Trying to find deployment resources
Deployment resources found, updating deployment.
Uploading blueprint /home/..../resources/blueprint.yaml...
 blueprint.yaml |######################################################| 100.0%
Blueprint `resources-31-03-2021-17-14-09` upload started.
2021-03-31 14:14:10.328  CFY <None> Starting 'upload_blueprint' workflow execution
2021-03-31 14:14:10.357  LOG <None> INFO: Blueprint archive uploaded. Extracting...
2021-03-31 14:14:10.387  LOG <None> INFO: Blueprint archive extracted. Parsing...
2021-03-31 14:14:11.292  LOG <None> INFO: Blueprint parsed. Updating DB with blueprint plan.
2021-03-31 14:14:11.378  CFY <None> 'upload_blueprint' workflow execution succeeded
Blueprint uploaded. The blueprint's id is resources-31-03-2021-17-14-09
Updating deployment resources, using blueprint resources-31-03-2021-17-14-09
2021-03-31 14:14:14.223  CFY <resources> Starting 'update' workflow execution
2021-03-31 14:14:14.542  CFY <resources> [node_c_oh15uc] Validating node instance before creation: nothing to do
2021-03-31 14:14:14.544  CFY <resources> [node_c_oh15uc] Precreating node instance: nothing to do
2021-03-31 14:14:14.545  CFY <resources> [node_c_oh15uc] Creating node instance: nothing to do
2021-03-31 14:14:14.546  CFY <resources> [node_c_oh15uc] Configuring node instance: nothing to do
2021-03-31 14:14:14.549  CFY <resources> [node_c_oh15uc] Starting node instance
2021-03-31 14:14:14.830  CFY <resources> [node_c_oh15uc.start] Sending task 'script_runner.tasks.run'
2021-03-31 14:14:15.371  LOG <resources> [node_c_oh15uc.start] INFO: Downloaded install.py to /tmp/5049J/install.py
2021-03-31 14:14:15.372  LOG <resources> [node_c_oh15uc.start] INFO: hi!!
2021-03-31 14:14:15.729  CFY <resources> [node_c_oh15uc.start] Task succeeded 'script_runner.tasks.run'
2021-03-31 14:14:15.730  CFY <resources> [node_c_oh15uc] Poststarting node instance: nothing to do
2021-03-31 14:14:15.732  CFY <resources> [node_c_oh15uc] Node instance started
2021-03-31 14:14:16.548  CFY <resources> 'update' workflow execution succeeded
Finished executing workflow 'update' on deployment 'resources'
Successfully updated deployment resources. Deployment update id: resources-90a04562-c24e-4088-868d-72c9d46979fc. Execution id: ef0e35e5-4b22-4cae-9608-829377312510

{{< /highlight >}}

In the second invocation, the updated blueprint is uploaded and deployment-update is executed.
