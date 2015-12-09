---
layout: bt_wiki
title: Offline manager
category: Blueprints
draft: false
weight: 11000

---
Cloudify enables the deployment of an offline manager. The difference between an online and an offline manager is quite clear.
The manager has no access to any online resource required by itself, or by any blueprint. In order to setup an offline manager, an access to the following resources is needed:

- **Core resources** - This resources are required for the Cloudify manager to run correctly. Some of the resources needed are a part of the manager's core. Without them, different manager modules will simply fail to run. You can find these under the Cloudify Modules and External Components section. 
- **Agent packages** - The agent packages are built per distro - Centos7, Centos 6.5, Ubuntu Trusy, Ubuntu Precise, RHEL and Windows.
- **Deployment resources** - Some blueprints require online resources (e.g. openstack-plugin is a resource required by a blueprint deploying on an openstack environment).

In order to resolve this issue, Cloudify manager starts up a file server on port 53229 which would hold any resource needed by any blueprint.
Cloudify manager blueprint provides a simple api for uploading resources, and resolving resources paths:

<a id="uploading-resources"></a>
### Uploading resources 
Cloudify provides you with a simple way for uploading resources to the manager. In the example below you can see that an `upload_resource` section comprises two resource types: 
 
#### DSL resources
The `dsl_resources` section enables you to upload any resource needed for parsing blueprints. Every resource comprises `source_path` and `destination_path`. The source path 
is either a local path or a URL, and the destination path is relative to the home dir of the file server.
#### Plugin resources
The `plugin_resources` section uses the [Plugins]({{< relref "plugins/overview/" >}}) api to upload any plugin path specified. Every resource is a string representing
either a local path or a URL. 
{{% gsNote title="Note" %}}
All plugins uploaded to the manager blueprint should be in [wgn](https://github.com/cloudify-cosmo/wagon) format. 
{{% /gsNote %}}

**Example:**
{{< gsHighlight  yaml  >}}
upload_resources:
plugin_resources: 
 - 'http://www.my-plugin.com/path/to/plugin.wgn'
dsl_resources: 
 - 'source_path': 'http://www.my-plugin.com/path/to/plugin.yaml'
   'destination_path': '/path/to/local/plugin.yaml'
{{< /gsHighlight >}}

<a id="resolving-inputs"></a>
### Resolving inputs 
Cloudify uses the [Import resolver]({{< relref "blueprints/import-resolver.md" >}}) section in the manager blueprint, to create a mapping between URLs.
Below we can see and example of an `import_resolver` section: 

 {{< gsHighlight  yaml  >}}
 import_resolver:
   parameters:
     rules:
     - {'http://www.my-plugin.com/path': 'http://localhost:53229/path'}
 {{< /gsHighlight >}}
The rule specifies a mapping between the source address ('http://www.my-plugin.com/path') as the dictionary key, and the destination address ('http://localhost:53229/path') as the dictionary value.
Once the manager parses the blueprint's `import` section, it first tries the new value supplied. If it fails, it falls back to the source address. 
Below we can see and example of an `import` section: 

{{< gsHighlight  yaml  >}}
imports:
  - http://www.my-plugin.com/path/to/plugin.yaml
{{< /gsHighlight >}}

Upon parsing the blueprint file, the manager tries to resolve each and every resource in the imports list according to the specified rules. In our example, the 
URL http://www.my-plugin.com/path/to/plugin.yaml is first mapped to http://localhost:53229/path/to/local/plugin.yaml, and the manager would try to retrieve 
the resource from the resolved URL. If that fails, the manager would fall back to the original URL.
