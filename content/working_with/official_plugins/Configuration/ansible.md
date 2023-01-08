---
title: Ansible Plugin
category: Official Plugins
description: The Ansible plugin enables you to configure resources with Ansible and provides an agentless method for executing operations on hosts.
draft: false
weight: 100
aliases: ["/plugins/ansible/", "/developer/official_plugins/ansible/", "/working_with/official_plugins/configuration/ansible/"]
---

The Ansible plugin enables you to configure {{< param product_name >}} resources with Ansible and provides an agentless method for executing operations on hosts.

## Node Types

The primary method to include an Ansible playbook in your {{< param product_name >}} blueprint is to use the `cloudify.nodes.ansible.Executor` node type.

### **cloudify.nodes.ansible.Executor**

Execute playbook lifecycle as stand-alone node template.

#### Node Operations

  * `configure`: Setup the virtual environment. Download packages in `extra_packages` and `galaxy_collections`.
  * `start`: This calls the `ansible-playbook` command.
  * `delete`: Cleans up the virtual environment.

#### Node Properties:

 * `playbook_path`: **required**. The path to a Ansible Playbook YAML or YML file. This file may be relative to blueprint or `playbook_source_path` if `playbook_source_path` is a URL.
 * `playbook_source_path`:  **not required**. A full path or URL to the directory containing the playbook file in `playbook_path`.
 * `additional_playbook_files`: A list of string paths blueprint resources that you would like to download to the playbook directory. If you use this variable, you must list all of the paths that you expect to download.
 * `sources`: **required**. Your Inventory sources. Either YAML or a path to a file. If not provided the inventory will be take from the `sources` runtime property. This property is required if you do not have the cloudify.nodes.ansible.Executor node contained in a compute node.
 * `extra_packages`: **not required**. A list of python packages to install on controller virtual env before running the playbook. Requires internet connection.
 * `galaxy_collections`: **not required**. A list of Ansible galaxy collections to install on controller virtual env before running the playbook. Requires internet connection.
 * `roles`: **not required**. A list of Ansible roles to be installed in working directory.
 * `run_data`: **not required**. Variable values.
 * `options_config`: **not required**. Command-line options, such as `tags` or `skip_tags`.
 * `ansible_env_vars`: **not required**. A dictionary of environment variables to set.
 * `number_of_attempts`: **not required**. Total number of attempts to execute the playbook if exit code represents unreachable hosts\failure.
 * `debug_level`: **not required**. Debug level
 * `log_stdout`: **not required**. Whether to dump output to execution event log. Set to false to speed up long executions.
 * `start_at_task`: **not required**. Start the playbook at the task matching this name
 * `timeout`: **not required**. Override the connection timeout in seconds (default=10)
 * `ansible_become`: **not required**. A boolean value, `true` or `false` whether to assume the user privileges.
 * `scp_extra_args`: **not required**. Specify extra arguments to pass to scp only (e.g. -l)
 * `sftp_extra_args`: **not required**. Specify extra arguments to pass to sftp only (e.g. -f, -l)
 * `ssh_common_args`: **not required**. Specify common arguments to pass to sftp/scp/ssh (e.g. ProxyCommand)
 * `ssh_extra_args`: **not required**. Specify extra arguments to pass to ssh only (e.g. -R)
 * `remerge_sources`: **not required**. update sources on target node
 * `sensitive_keys`: **not required**. keys that you want us to obscure
 * `save_playbook`: **not required**. Save playbook after action
 * `tags`: **not required**. A list of tags, in order of desired execution. If these tags are provided, they will be called, and auto_tags will be ignored.
 * `auto_tags`: **not required**. If set to "true", the plugin will read the playbook and generate a list of tags to execute. This requires that the playbook is written in such a way that the specified tags will produce the desired result. This value is ignored if tags are provided.
 * `additional_args`: **not required**. Additional args that you want to use, for example, '-c local'.
 * `store_facts`: **not required**. Store ansible facts under runtime properties.
 * `ansible_playbook_executable_path`: **not required**. The plugin will build a new virtual environment and install ansible in it. So you do not need to provide ansible. However, if you wish to use your own ansible executable, provide the path in this property.


#### Simple example of cloudify.nodes.ansible.Executor node type:

If you have a playbook, `playbook.yml` that only uses localhost, then you can install that playbook by including it in the same directory as your `blueprint.yaml` like this:

```yaml

  example:
    type: cloudify.nodes.ansible.Executor
    properties:
      sources:
        inventory:
          hosts:
      playbook_path: playbook.yml
      ansible_env_vars:
        ANSIBLE_INVALID_TASK_ATTRIBUTE_FAILED: "False"
        ANSIBLE_HOST_KEY_CHECKING: "False"
        ANSIBLE_STDOUT_CALLBACK: dense

```

### **cloudify.nodes.ansible.Playbook**

Stores Ansible inputs in runtime properties. Does not call `ansible-playbook` command. This node type is designed to be used with the cloudify.ansible.relationships.run_on_host relationship type.

#### Simple example of cloudify.nodes.ansible.Playbook node type:

```yaml
  example:
    type: cloudify.nodes.ansible.Playbook
    properties:
      playbook_source_path: { get_input: playbook_source_path }
      playbook_path: { get_input: playbook_path }
    relationships:
      - type: cloudify.relationships.ansible.run_on_host
        target: vm
        source_interfaces:
          cloudify.interfaces.relationship_lifecycle:
            establish:
              inputs:
                sources:
                  vms:
                    hosts:
                      vm:
                        ansible_host: { get_attribute: [ vm, ip ] }
                        ansible_user: { get_input: agent_user }
                        ansible_ssh_private_key_file: { get_secret: agent_key_private }
                        ansible_become: True
                        ansible_ssh_common_args: -o StrictHostKeyChecking=no
```

### **cloudify.nodes.ansible.Ansible**

Used for sharing ansible installation with extra packages and galaxy collections.
While using `cloudify.nodes.ansible.Ansible` node and setting property `ansbile_external_venv` to { get_attribute: [ansible_node, playbook_venv] } where ansible_node is of type `cloudify.nodes.ansible.Ansible` python virtualenv would not be created for the source node and `cloudify.nodes.ansible.Ansible` node's python virtualenv will be used instead.

#### Node Operations

  * `create`: Setup the virtual environment. Download packages in `extra_packages` and `galaxy_collections`.
  * `delete`: Cleans up the virtual environment.

#### Node Properties:

 * `installation_source`: **not required**. Your Ansible package, `ansible==4.10.0` by default.
 * `extra_packages`: **not required**. A list of python packages to install on controller virtual env before running the playbook. Requires internet connection.
 * `galaxy_collections`: **not required**. A list of Ansible galaxy collections to install on controller virtual env before running the playbook. Requires internet connection.

#### Example:

```yaml
  ansible:
    type: cloudify.nodes.ansible.Ansible
    properties:
      extra_packages:
        - whatever
      galaxy_collections:
        - community.general

  shared_venv_collection:
    type: cloudify.nodes.ansible.Executor
    properties:
      ansible_external_venv: { get_attribute: [ansible, playbook_venv] }
      playbook_path: local/filesize.yml
      galaxy_collections:
        - community.general
      sources: *sources
    relationships:
      - type: cloudify.relationships.depends_on
        target: ansible
```


## Workflows

  * `reload_ansible_playbook`: this workflow provide the capability to reload a playbook given a new playbook path that could be a full path or URL , using `playbook_source_path` and `playbook_path` combined along side node_ids or node_instance_ids that you want to reload

Using the above cloudify.nodes.ansible.Playbook example, you can change the parameters for `playbook_source_path` or `playbook_path`:

```bash
cfy executions start reload_ansible_playbook -d {deployment_id} -p '{"playbook_source_path": "https://github.com/cloudify-community/blueprint-examples/releases/download/latest/hello-world-example.zip","playbook_path":"apache2/playbook.yaml","node_ids": ["hello-world"]}'
```

  * `ansible.update_venv`: this workflow provide the capability of updating shared environment in Ansible node with new extra packages and gallaxy collections

```bash
cfy executions start ansible.update_venv -d {deployment_id} -p '{"extra_packages": ["boto3"],"galaxy_collections": ["community.general"]}'
```

## Playbook Run Operation

The node type cloudify.nodes.ansible.Executor and the relationship type `cloudify.relationships.ansible.run_on_host` both call the same operation `ansible.cloudify_ansible.tasks.run`.

Similar to the Script Plugin and the Fabric Plugin, you do not have to use any specify node type or relationship type. Instead, you may create new node types or modify existing node types to perform one or more of their lifecycle operations using the Ansible plugin and any additional inputs that you provide.

**Operations**

  * `ansible.cloudify_ansible.tasks.run`
    * `description`: Execute the equivalent of `ansible-playbook` on the Ansible Playbook provided in the `site_yaml_path` input.
    * `inputs`:
      * `playbook_source_path`:  A full path/URL that contain playbook specified in playbook_path.
      * `playbook_path`: A path to your `site.yaml` or `main.yaml` in your Ansible Playbook.
      * `additional_playbook_files`: A list of paths (relative to blueprint root) to include in the Playbook directory. Useful when overriding `executor` to `host_agent`.
      * `remerge_sources`: Update sources on target node.
      * `save_playbook`: Save the playbook after writing (do not delete temporary file).
      * `sources`: Your Inventory sources. Either YAML or a path to a file. If YAML, we will write the file and pass the temporary file to `ansible-playbook` command with `-i` flag. If a path, this argument is passed to `ansible-playbook` command with `-i` flag. If If not provided the inventory will be take from the `sources` runtime property.
      * `run_data`: Variable values.
      * `options_config`: Command-line options, such as `tags` or `skip_tags`. For more information on command-line options see [Common Options](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#common-options). Remember, that Ansible CLI options interpolate with a dash `-`, whereas {{< param product_name >}} YAML dictionary keys interpolate words with an underscore `_`. E.g. `skip-tags` becomes `skip_tags`.
      * `ansible_env_vars`: Environment variables in the executor environment.
      * `debug_level`: The debug level for the logging.
      * `additional_args`: Additional `ansible-playbook` CLI arguments.
      * `extra_packages`: List of python packages to install on controller virtual env before running the playbook. If the manager has no internet connection this feature cannot be used.
      * `galaxy_collections`: List of Ansible galaxy collections to install on controller virtual env before running the playbook. If the manager has no internet connection this feature cannot be used.
      * `roles`: A list of Ansible roles to be installed in working directory.
      * `tags`: A list of tags to execute in the order that you would like them executed.
      * `auto_tags`: We will generate a list of tags instead of using provided tags. (Boolean).
      * `number_of_attempts`: Total number of attempts to execute the playbook if exit code represents unreachable hosts\failure.

In addition, you can provide additional key-word args parameters to the AnsiblePlaybookFromFile class, such as `options_config`.

## Ansible Module for Cloudify

You may use the ansible Cloudify module to store runtime properties inside of your Ansible playbooks.

**requirements**

  * Cloudify Ansible Plugin 3.0.0, or higher.
  * Cloudify Manager 6.4, or higher.
  * A Cloudify Manager that supports SSL, or your Cloudify manager rest credentials. You must collect your {{< param product_name >}} manager credentials. The module will try to use environment variables to connect to {{< param product_name >}} Manager, however, if your manager is not configured for SSL or if your security does not permit, you must provide credentials directly in the playbook.  The module will try to load the {{< param product_name >}} rest client from the management worker virtual env, i.e. `/opt/mgmtworker/env/lib/python3.6/site-packages/` in Cloudify 6.4. If this path does not contain `cloudify_rest_client` or if it doesn't exist at all, or if it's not valid anymore, then the module will not work.
  * You must install the Ansible module in one of the appropriate paths for ansible modules, for example `/etc/cloudify/.ansible/plugins/modules.`.

## Using the module:

Assuming you are using the above example for `cloudify.nodes.ansible.Executor` node type, your `playbook.yml` could be this simple:

```yaml
- hosts: localhost
  tasks:
    - name: simple runtime property
      cloudify_runtime_property:
        path: hello
        value: world
```

This will create a property `hello` with the value `world`.

For nesting information in new or preexisting dicts, you could use `.` notation to indicate the dict level and key name.

```yaml
- hosts: localhost
  tasks:
    - name: complex runtime property part I
      cloudify_runtime_property:
        path: foo.bar
        value: baz

    - name: complex runtime property part II
      cloudify_runtime_property:
        path: foo.qux
        value: quux

```

This will create a dict `foo` wth the value: `{'bar': 'baz', 'qux': 'quux'}`.

An example providing credentials instead of letting {{< param product_name >}} attempt to determine them from the environment:

```yaml
- hosts: localhost
  tasks:
    - name: simple runtime property
      cloudify_runtime_property:
        path: hello
        value: world
        client_kwargs:
          username: cooluser
          password: supersecret123
          tenant: nicetenant
          protocol: http
```

## Further information:

**NOTE** there is a special handling for "ANSIBLE_FACT_PATH" environment variable that you can pass to `ansible_env_vars` property, where you could add custom `.fact` files -which could be executable that Ansible expect JSON on stdout. If you include files that are not executable and simply contain raw JSON then Ansible will just read them and use the data inside - when gather facts is triggered they will be part of `runtime_properties.facts.ansible_local.{fact_file_name}`

For example you could do something like this inside your playbook:

```yaml
- hosts: all
  connection: local
  tasks:
    - name: "Set fact: output dictionary"
      set_fact:
        output_dict:
          just_a_test: "my value from ansible gathered fact !!"
    - name: "Creates facts directory if it doesn't exist"
      file:
        path: "{{ lookup('ansible.builtin.env', 'ANSIBLE_FACT_PATH') }}"
        state: directory
    - name: "Insert custom fact file"
      copy:
        content: "{{ output_dict | to_nice_json }}"
        dest: "{{ lookup('ansible.builtin.env', 'ANSIBLE_FACT_PATH') }}/custom.fact"
        mode: 0644
```

## Inventory Sources

** There are also two methods for generating the sources parameter automatically, see [using compute nodes](#using-compute-nodes) and [Relationships](#using-relationships).

For all inventory sources, we require these parameters:

  * `ansible_host`: The hostname or IP address of the host to SSH into.
  * `ansible_user`: The username to SSH with.
  * `ansible_ssh_private_key_file`: The private key file to SSH with.

In addition, we handle these parameters if provided (and highly recommend them):

  * `ansible_become`: A boolean value, `true` or `false` whether to assume the user privileges.
  * `ansible_ssh_common_args`: Additional arguments to the SSH command like, we suggest, `'-o StrictHostKeyChecking=no'`.

For more information on the sources format in YAML, see [Ansible Inventory YAML](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#hosts-and-groups).

## Environment Management

 Python virtualenv:
  - not installed if using provided external ansible binary path
  - not installed if external virtualenv provided by property, relationship or runtime property
  - installed in deployment's node directory

 Collections:
  - if collections available in a node that has local virtual environment collections will be installed in local venv site-packages
  - if collections available in a node that has no local virtual environment will be installed in work directory

 Roles:
   - always installed in local working directory for the node instance

## Using Compute Nodes

If your operation is mapped on the lifecycle operation of a node template derived from `cloudify.nodes.Compute`, we will attempt to generate the `sources` parameter from the node properties.

### Example Compute Node

Provision some component on a VM.

```yaml
  compute_and_component:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: ip }
      agent_config:
        install_method: none
        key: { get_input: private_key_path }
        user: { get_input: username }
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/component/site.yaml
```

## Using Relationships

Use the `cloudify.ansible.relationships.connected_to_host` relationship defined in the plugin to populate the sources parameter, if the target node is derived from `cloudify.nodes.Compute`.

### Example Relationship Usage

```yaml
  component:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/component/site.yaml
            sources: { get_attribute: [ SELF, sources ] }
    relationships:
      - type: cloudify.ansible.relationships.connected_to_host
        target: compute

  compute:
    type: cloudify.nodes.Compute
    properties:
      ip: { get_input: ip }
      agent_config:
        install_method: none
        key: { get_input: private_key_path }
        user: { get_input: username }
```

## More Examples

Basic usage with no special node or relationship type behavior.

```yaml
  my_node:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/my_ansible_playbook/site.yaml
            sources:
              webservers:
                hosts:
                  web:
                    ansible_host: { get_input: ip }
                    ansible_user: { get_input: username }
                    ansible_ssh_private_key_file: { get_input: private_key_path }
                    ansible_become: true
                    ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
```

Passing `run_data` at runtime:

```yaml
  component:
    type: cloudify.nodes.Root
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: ansible.cloudify_ansible.tasks.run
          inputs:
            site_yaml_path: resources/my_ansible_playbook/site.yaml
            sources:
              foo_group:
                hosts:
                  foo_host:
                    ansible_host: { get_input: ip }
                    ansible_user: { get_input: username }
                    ansible_ssh_private_key_file: { get_input: private_key_path }
                    ansible_become: true
                    ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
            run_data:
              foo: bar
```
