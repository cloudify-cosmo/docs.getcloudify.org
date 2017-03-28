
---
layout: bt_wiki
title: Evaluating Cloudify
category: Intro
draft: false
weight: 600

---
This section is created to assist you to evaluate the Cloudify product suite. It includes a simple and a more complex deployment.

## Deploying a Simple 'Hello World' Web Server

This procedure enables you to deploy a simple ‘Hello World’ Web server. You must have installed Cloudify in order to run this evaluation process. For more information about installation, [click here]({{< relref "installation/from-packages.md" >}}).

Now that you have installed Cloudify, it is time to get a glimpse of what it can do. In this procedure you:

* Download and extract a sample blueprint from the Cloudify Sample repository.
* Deploy the Web application blueprint locally by executing an install workflow.
* Retrieve the outputs of the installation.
* List the node instances that are part of the installation.
* Access and confirm the ‘Hello World’ message.
* Remove the Web application by executing an uninstall workflow.

{{% gsNote title="Prerequisites" %}}
You require `wget` and `unzip` to be installed on your Linux server for this procedure.
{{% /gsNote %}}


### 1. Downloading and Extracting the Blueprint

Use the following command to download and extract the installation.<br>
   ```(tmp-353452adfec2bcbb)$ curl -L https://github.com/cloudify-examples/simple-python-webserver-blueprint/archive/4.0.tar.gz | tar zx```<br>
The process creates a directory called ```simple-python-webserver-blueprint-4.0```.


### 2. Installing the Blueprint

On the Linux server, use the following command to change directory and begin the install process:<br> 
```cd simple-python-webserver-blueprint-4.0/cfy install blueprint.yaml```

*  You might be prompted to provide permission to listen on the localhost.
*  If the install fails, or the Website does not appear, you might need to open your firewall.

You should see the following output.<br><br>
![Install Simple Blueprint]({{< img "intro/evaluate/install-simple.png" >}})

### 3. Retrieving the Installation Outputs

Before a blueprint can be implemented, a deployment is created. A deployment is an instance of a blueprint. The deployment is also a part of the model. The deployment model contains every piece of information your application contains, for example information set during runtime, such as IP addresses, or predefined configuration properties such as application ports. These values are called _outputs_. 

Run the following command to retrieve the outputs:<br>
```cfy deployments outputs simple-python-webserver-blueprint-4.0```

### 4. Retrieving Node Instances

Each logical entity in your application that is defined within a blueprint is a called a _node_. After a deployment is created, each logical node becomes a set of one or more _node-instances_, which are instances of that node. A node can have multiple node-instances, such as multiple virtual machines. 

Run the following command to view each node that is defined in the blueprint, and its attributes.
```cfy node-instances list```


### 5. Confirming the Application is Working

To confirm the application is working, attempt to access it locally, or remotely. If you are attempting remote access, ensure that the firewall is disabled.   
      
   * To access the application locally, run:     
     ```curl http://localhost:8000```     
     
     ![Access application locally]({{< img "intro/evaluation-simple-5.png" >}})   

   * To test the application remotely, open a browser on a server that has access to the Linux server and browse to **http://<LINUX_IP>:8000**, as shown in the following screen capture.     
     
     ![Access application remotely]({{< img "intro/evaluation-simple-6.png" >}})

### 6. Uninstalling a Deployed Blueprint

An uninstall workflow that enables you to uninstall a deployed blueprint is built in to Cloudify.   

To uninstall the application, run ```cfy uninstall```.<br> 
The following output is expected: 

![Uninstall workflow]({{< img "intro/evaluate/uninstall-simple.png" >}})

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
   You should see the following webpage:   

   ![Nodecellar home page]({{< img "intro/evaluation-complex-2.png" >}})

### Uninstalling a Deployed Blueprint

1.  Uninstall the application from the local server by running the built-in uninstall workflow, which calls the `stop` and `delete` operations on all nodes, and also calls `unlink` on all relationships. To remove the nodecellar app, run:   
   ```cfy local uninstall```.

9. Verify that the uninstall completed successfully. In the final log line, look for `CFY <_local_> 'uninstall' workflow execution succeeded`.

This completes the deployment of your first application using the Cloudify CLI. You have processed an entire application lifecycle workflow using Cloudify.
