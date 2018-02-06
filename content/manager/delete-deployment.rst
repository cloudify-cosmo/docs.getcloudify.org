Deleting a Deployment
%%%%%%%%%%%%%%%%%%%%%

After you have uninstalled an application, you can delete it from
Cloudify Manager. After you uninstall an application, all of its static
and runtime properties are still stored in the Manager’s database and
the deployment-specific agents continue to consume resources on the
Manager. Deleting a deployment enables you to clean the environment of
those excess artifacts.

To remove the information related to a deployment on the Manager, run
the following command.

.. code:: bash

        cfy deployments delete nodecellar

What’s Next
===========

You can now [delete the application’s blueprint]({{< relref
“manager/delete-blueprint.md” >}}) if it is no longer required.
