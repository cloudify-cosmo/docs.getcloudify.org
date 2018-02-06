Uploading a Blueprint
%%%%%%%%%%%%%%%%%%%%%

Before Cloudify Manager can deploy your blueprint, you must upload it.
You can upload a blueprint using the CLI or (for Premium users) the
Cloudify Web interface.

Either use a blueprint that you have written or download an `example
blueprint <https://github.com/cloudify-cosmo/cloudify-nodecellar-example>`__
to upload.

Uploading via the CLI
---------------------

From the Cloudify command-line interface, you can upload your blueprint
to Cloudify Manager. You must specify a path to a blueprint file.
Cloudify compresses the folder and its contents.

The following is an example of ``upload``:

.. code:: bash

        $ cfy blueprints upload -b BLUEPRINT_ID -p BLUEPRINT_FILE_LOCATION
        ...
        
        ...

Uploading a Blueprint via the Cloudify Web Interface
----------------------------------------------------

If you are a Premium version user, you can upload a pre-packaged
blueprint archive, such as *.tar, *.tar.gz, *.tar.bz, *.zip., using the
Cloudify Manager UI.

1. On the **Blueprints** widget, click **Upload**.
   [The blueprint upload button]({{< img
   “manager/ui_upload_blueprint_button.png” >}})
2. In the Upload blueprint dialog, either specify the URL of the
   blueprint archive, or select it from the filesystem.
   [The blueprint upload dialog]({{< img
   “manager/ui-upload-blueprint.png” >}})
3. Specify a distinguishing name for the blueprint.
   For example, you might want to specify one instance of the blueprint
   upload as ``blueprint-template`` and another as a
   ``blueprint-with-input``.
4. (Optional) Specify the YAML filename.
   This field refers to to the \*.yaml file that contains the
   application topology. If left blank, the default ``blueprint.yaml``
   file is used.
5. Click **Upload** to upload the upload the blueprint package.

Uploading a Blueprint via the Command Line
------------------------------------------

The following scenario describes how to use the CLI to upload the
Nodecellar blueprint.

If you have downloaded cloudify-nodecellar-example from github and want
to use that blueprint for your specific IaaS, the appropriate command
from the following:

{{% gsInitTab %}} **OpenStack**

{{% gsTabContent “OpenStack” %}}

.. code:: bash

          cfy blueprints upload -b nodecellar -p openstack-blueprint.yaml

{{% /gsTabContent %}}

**SoftLayer** {{% gsTabContent “SoftLayer” %}}

.. code:: bash

          cfy blueprints upload -b nodecellar -p softlayer-blueprint.yaml

{{% /gsTabContent %}}

**Amazon Web Service** {{% gsTabContent “AWS EC2” %}}

.. code:: bash

          cfy blueprints upload -b nodecellar -p aws-ec2-blueprint.yaml

{{% /gsTabContent %}}

**vCloud** {{% gsTabContent “vCloud” %}}

.. code:: bash

          cfy blueprints upload -b nodecellar -p vcloud-blueprint.yaml

{{% /gsTabContent %}}

{{% /gsInitTab %}}

 The ``-b`` flag assigns a unique name to the blueprint on Cloudify
Manager. Before creating a deployment, review this blueprint.

Navigate to the Cloudify Manager URL and refresh the screen. The
nodecellar blueprint widget is displayed.

[Blueprints table]({{< img “manager/blueprints_table.png” >}})

Click the blueprint to view its topology. A topology consists of
elements called *nodes*.

In this case, the following nodes exist:

-  Two VM’s (one for mongo and one for nodejs)
-  A nodejs server
-  A MongoDB database
-  A nodejs application called nodecellar (which is a sample nodejs
   application backed by mongodb).

[Nodecellar Blueprint]({{< img
“manager/nodecellar_openstack_topology.png” >}})

What’s Next
===========

You can now [deploy]({{< relref “manager/create-deployment.md” >}}) your
blueprint.
