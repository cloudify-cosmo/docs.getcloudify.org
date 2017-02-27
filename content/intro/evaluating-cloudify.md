---
layout: bt_wiki
title: Evaluating Cloudify
category: Intro
draft: false
weight: 600

---
This section enables you to deploy a simple ‘Hello World’ Web server so that you can evaluate the Cloudify product suite. You need to have installed Cloudify in order to run this evaluation process. For more information about installation, see 

Now that you have installed Cloudify, it is time to get a glimpse of what it can do. In this step you:

* Download a sample blueprint from the Cloudify Sample repository.
* Initialize the blueprint with basic inputs.
* Deploy the Web application blueprint locally by executing an install workflow.
* Retrieve the outputs of the installation.
* List the node instances that are part of the installation.
* Access and confirm the ‘Hello World’ message.
* Remove the Web application by executing an uninstall workflow.

**Downloading a Sample Blueprint**

{{% gsNote title="Note" %}}
You require `wget` and `unzip` to be installed on your Linux server for this step..
{{% /gsNote %}}


1. On the Linux server, execute the following commands:   
  ```cd ~   
   wget https://github.com/cloudify-examples/simple-python-webserver-blueprint/archive/master.zip   
   unzip master.zip```   

   This creates a folder called `simple-python-webserver-blueprint-master` in the home directory.<br>
2. Change directory to the ‘`simple-python-webserver-blueprint-master` directory.
3. Execute the following command to initialize the blueprint with the address and port information required for the Web server:   
   ```cfy local init --blueprint-path blueprint.yaml --inputs '{"webserver_port":"8000","host_ip":"localhost"}'```   
   The following output is expected:   

 4. Execute the installation using the install workflow by running:   
   ```cfy local execute --workflow install```.   
   The following output is expected:

If everything executed successfully, you can retrieve the installation outputs.

Before a blueprint can be implemented, a deployment is created. A deployment is an instance of a blueprint. The deployment is also a part of the model. The deployment model contains every piece of information your application contains - for example, information set during runtime, such as IP addresses or predefined configuration properties such as application ports. These values are called outputs. To retrieve the installation outputs, run:
cfy local outputs
The following output is expected:

Each logical entity in your application that is defined within a blueprint is a called a node. After a deployment is created, Blueeach logical node becomes a set of one or more node-instances, which are instances of that node. A node can have multiple node-instances--such as multiple virtual machines. In this example, there are two nodes, each with one instance. List the node instances:
cfy local instances
The following output is expected:

To confirm the application is working, try to access it locally, or remotely. If you are attempting remote access, make sure that the Firewall is disabled. To access the application locally, run:
curl http://localhost:8000

To test the application remotely, open a browser on a server that has access to the Linux server and browse to http://<LINUX_IP>:8000 - as shown in the following screen capture:

An uninstall workflow is also built-in to Cloudify, which enables you to uninstall a deployed blueprint. To uninstall the application, run:
cfy local execute -w uninstall
The following output is expected:


Congratulations! You just deployed your first application and processed an entire application lifecycle workflow using Cloudify. We hope you enjoyed it!

Now let’s deploy something a bit more complex…
Deploying a Complex Sample Application (NodeCellar)
In this step you deploy a more-complex application locally. NodeCellar is a sample application, created by Christophe Coenraets, which demonstrates the usage of various technologies (Backbone.js, Node.js, MongoDB).

Let’s get to it!

Download and extract the blueprint to your home directory by executing the following commands on your Linux server:
cd ~
curl -L -o nodecellar.zip https://github.com/Cloudify-PS/cloudify-nodecellar-example/archive/3.4-maint.zip
unzip nodecellar.zip
mv cloudify-nodecellar-example-3.4-maint cloudify-nodecellar-example
Create a working directory for this deployment and navigate to it:
mkdir ~/cfywork
cd ~/cfywork
Install the application using the built in default inputs:
cfy local install -p ../cloudify-nodecellar-example/local-blueprint.yaml
View the logs as Cloudify downloads the required packages and executes all the actions necessary to install the NodeCellar application locally and confirm that the install workflow completed successfully. The final line should say ‘CFY <local> 'install' workflow execution succeeded’.
Retrieve the installation outputs by running cfy local outputs

Optionally, list all the node instances by running cfy local instances
Confirm that you can access the application by using curl http://localhost:8080 or remotely by http://<LINUX_IP>:8080 . You should see the following webpage:

Remove (uninstall) the application from the local server by running the built-in uninstall workflow, which calls the stop and delete operations on all nodes, and also calls unlink on all relationships. To remove the nodecellar app, run:
cfy local uninstall
Confirm the uninstall completed successfully. The final log line should say ‘CFY <local> 'uninstall' workflow execution succeeded’.

That’s it, we hope you had enjoyed your experience with Cloudify CLI. Now it is time to get serious and use Cloudify Manager!

