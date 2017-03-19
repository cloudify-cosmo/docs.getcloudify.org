
---
layout: bt_wiki
title: Evaluating Cloudify
category: Intro
draft: false
weight: 600

---
This section is created to assist you to evaluate the Cloudify product suite. It includes a simple and a more complex deployment.

## Deploying a Simple 'Hello World' Web Server

This procedure enables you to deploy a simple ‘Hello World’ Web server. You must have installed Cloudify in order to run this evaluation process. For more information about installation, [click this link]({{< relref "installation/from-packages.md" >}}).

Now that you have installed Cloudify, it is time to get a glimpse of what it can do. In this procedure you:

* Download a sample blueprint from the Cloudify Sample repository.
* Initialize the blueprint with basic inputs.
* Deploy the Web application blueprint locally by executing an install workflow.
* Retrieve the outputs of the installation.
* List the node instances that are part of the installation.
* Access and confirm the ‘Hello World’ message.
* Remove the Web application by executing an uninstall workflow.

{{% gsNote title="Prerequisites" %}}
You require `wget` and `unzip` to be installed on your Linux server for this procedure.
{{% /gsNote %}}


1. On the Linux server, execute the following commands:   
  ```cd ~
     wget https://github.com/cloudify-examples/simple-python-webserver-blueprint/archive/master.zip
     unzip master.zip```
   This creates a folder called `simple-python-webserver-blueprint-master` in the home directory.<br>

2. Change directory to the ‘`simple-python-webserver-blueprint-master` directory.<br>

3. Execute the following command to initialize the blueprint with the address and port information required for the Web server:   
   ```cfy local init --blueprint-path blueprint.yaml --inputs '{"webserver_port":"8000","host_ip":"localhost"}'```   
   The following output is expected:   
   ![Initialize blueprint output]({{< img "intro/evaluation-simple-1.png" >}})

4. Execute the installation using the install workflow by running:   
   ```cfy local execute --workflow install```.   
   The following output is expected:   
   ![Install workflow]({{< img "intro/evaluation-simple-2.png" >}})

5. If everything executed successfully, you can retrieve the installation outputs.<br>

   Before a blueprint can be implemented, a deployment is created. A deployment is an instance of a blueprint. The deployment is also a part of the model. The deployment model contains every piece of information your application contains, for example information set during runtime, such as IP addresses, or predefined configuration properties such as application ports. These values are called _outputs_.   

   To retrieve the installation outputs, run:   
   ```cfy local outputs```   
   The following output is expected:   
   ![Retrieve installation outputs]({{< img "intro/evaluation-simple-3.png" >}})

6.  Each logical entity in your application that is defined within a blueprint is a called a _node_. After a deployment is created, each logical node becomes a set of one or more _node-instances_, which are instances of that node. A node can have multiple node-instances, such as multiple virtual machines. In the example, there are two nodes, each with one instance.   

   List the node instances:   
   ```cfy local instances```   
   The following output is expected:   
   ![List node instances]({{< img "intro/evaluation-simple-4.png" >}})

7. To confirm the application is working, attempt to access it locally, or remotely. If you are attempting remote access, ensure that the firewall is disabled.   
   
   * To access the application locally, run:     
     ```curl http://localhost:8000```     
     ![Access application locally]({{< img "intro/evaluation-simple-5.png" >}})   

   * To test the application remotely, open a browser on a server that has access to the Linux server and browse to **http://<LINUX_IP>:8000**, as shown in the following screen capture.     
   ![Access application remotely]({{< img "intro/evaluation-simple-6.png" >}})

8. An uninstall workflow that enables you to uninstall a deployed blueprint is built in to Cloudify.   

   To uninstall the application, run:   
   ```cfy local execute -w uninstall```   
   The following output is expected:   
   ![Uninstall workflow]({{< img "intro/evaluation-simple-7.png" >}})

This completes the deployment of your first application. You have processed an entire application lifecycle workflow using Cloudify.

## Deploying a Complex Sample Application

This procedure enables you to deploy the NodeCellar application locally. NodeCellar is a sample application, created by Christophe Coenraets, that demonstrates the usage of various technologies (Backbone.js, Node.js, MongoDB). You must have installed Cloudify in order to run this evaluation process. For more information about installation, see 


1. Download and extract the blueprint to your home directory by executing the following commands on your Linux server:   
   ```cd ~
   curl -L -o nodecellar.zip https://github.com/Cloudify-PS/cloudify-nodecellar-example/archive/3.4-maint.zip   
   unzip nodecellar.zip   
   mv cloudify-nodecellar-example-3.4-maint cloudify-nodecellar-example```

2. Create anad navigate to a working directory for this deployment:   
   ```mkdir ~/cfywork   
   cd ~/cfywork```

3. Install the application using the built-in default inputs:   

   ```cfy local install -p ../cloudify-nodecellar-example/local-blueprint.yaml```

4. View the logs as Cloudify downloads the required packages and executes all the actions necessary to install the NodeCellar application locally and confirm that the install workflow completed successfully. The final line should say `CFY <local> 'install' workflow execution succeeded`.

5. Retrieve the installation outputs by running `cfy local outputs`.   
   ![Retrieve installation outputs]({{< img "intro/evaluation-complex-1.png" >}})

6. (Optional) List all the node instances by running `cfy local instances`.

7. Verify that you can access the application by using `curl http://localhost:8080`, or remotely using `http://<_LINUX_IP_>:8080`.   
   You should see the following webpage:<br>
   ![Nodecellar home page]({{< img "intro/evaluation-complex-2.png" >}})

8.  Uninstall the application from the local server by running the built-in uninstall workflow, which calls the `stop` and `delete` operations on all nodes, and also calls `unlink` on all relationships. To remove the nodecellar app, run:   
   ```cfy local uninstall```.

9. Verify that the uninstall completed successfully. In the final log line, look for `CFY <_local_> 'uninstall' workflow execution succeeded`.

This completes the deployment of your first application using the Cloudify CLI. You have processed an entire application lifecycle workflow using Cloudify.
