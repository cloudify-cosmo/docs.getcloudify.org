
---
layout: bt_wiki
title: Evaluating Cloudify
category: Intro
draft: false
weight: 600

---
This section is created to assist you to evaluate the Cloudify product suite. It includes a simple and a more complex deployment.

## Deploying a Simple 'Hello World' Web Server

This procedure enables you to deploy a simple ‘Hello World’ Web server. You must have installed Cloudify in order to run this evaluation process. For more information about installation, [click here]({{< relref "installation/bootstrapping.md" >}}).

Now that you have installed Cloudify, it is time to get a glimpse of what it can do. In this procedure you:

* Download and extract a sample blueprint from the Cloudify Sample repository.
* Deploy the Web application blueprint locally by executing an install workflow.
* Retrieve the outputs of the installation.
* List the node instances that are part of the installation.
* Access and confirm the ‘Hello World’ message.
* Remove the Web application by executing an uninstall workflow.


### 1. Downloading and Extracting the Blueprint

Use the following command to download and extract the installation.<br>
   ```$ curl -L https://github.com/cloudify-examples/simple-python-webserver-blueprint/archive/4.0.tar.gz | tar zx```<br>
The process creates a directory called ```simple-python-webserver-blueprint-4.0```.


### 2. Installing the Blueprint

On the Linux server, use the following command to change directory and begin the install process:<br> 
```cd simple-python-webserver-blueprint-4.0/```<br>
```cfy install blueprint.yaml```

*  You might be prompted to provide permission to listen on the localhost.
*  If the install fails, or the Website does not appear, you might need to open your firewall.

You should see the following output.   
   ```$ cfy install blueprint.yaml```<br>
   ```Initializing local profile ...```<br>
   ```Initialization completed successfully```<br>
   ```Initializing blueprint...```<br>
   ```Initialized blueprint.yaml```<br>
   ```If you make changes to the blueprint, run `cfy init blueprint.yaml` again to apply them```<br>
   ```2017-03-28 10:52:58.234  CFY <local> Starting 'install' workflow execution```<br>
   ```2017-03-28 10:52:58.363  CFY <local> [host_bd1n1g] Creating node```<br>
   ```2017-03-28 10:52:58.776  CFY <local> [host_bd1n1g] Configuring node```<br>
   ```2017-03-28 10:52:59.185  CFY <local> [host_bd1n1g] Starting node```<br>
   ```2017-03-28 10:53:00.243  CFY <local> [http_web_server_1fa7ij] Creating node```<br>
   ```2017-03-28 10:53:00.299  CFY <local> [http_web_server_1fa7ij.create] Sending task 'script_runner.tasks.run'```<br>
   ```2017-03-28 10:53:00.319  CFY <local> [http_web_server_1fa7ij.create] Task started 'script_runner.tasks.run'```<br>
   ```2017-03-28 10:53:00.324  LOG <local> [http_web_server_1fa7ij.create] INFO: Running WebServer locally on port: 8000```<br>
   ```2017-03-28 10:53:00.330  LOG <local> [http_web_server_1fa7ij.create] INFO: Setting `pid` runtime property: 59537```<br>
   ```2017-03-28 10:53:00.332  CFY <local> [http_web_server_1fa7ij.create] Task succeeded 'script_runner.tasks.run'```<br>
   ```2017-03-28 10:53:00.625  CFY <local> [http_web_server_1fa7ij] Configuring node```<br>
   ```2017-03-28 10:53:01.145  CFY <local> [http_web_server_1fa7ij] Starting node```<br>
   ```2017-03-28 10:53:01.736  CFY <local> 'install' workflow execution succeeded```


### 3. Retrieving Node Instances

Each logical entity in your application that is defined within a blueprint is a called a _node_. After a deployment is created, each logical node becomes a set of one or more _node-instances_, which are instances of that node. A node can have multiple node-instances, such as multiple virtual machines.

Run the following command to view each node that is defined in the blueprint, and its attributes.
```cfy node-instances list```


### 4. Retrieving the Installation Outputs

When you install a blueprint with Cloudify, a deployment is created. A deployment is a model of the application that will be modified over the Application lifecycle, including all of the node-instances and their runtime properties. A deployment also has outputs, which can be the IP addresses, ports, or other runtime-properties generated during Cloudify workflows, that you want to take and use somewhere else.

Run the following command to retrieve the outputs:<br>
```cfy deployments outputs simple-python-webserver-blueprint-4.0```


### 5. Confirming the Application is Working

To confirm the application is working, attempt to access it locally, or remotely. If you are attempting remote access, ensure that the firewall is disabled.   
      
   * To access the application locally, run:     
     ```curl http://localhost:8000```     
     
     ```[cloudify@cloudify-manager]# curl http://localhost:8000```<br>
     ```<html>```    <br>
     ```    <header>```    <br>
     ```        <title>Cloudify Hello World</title>```<br>
     ```    </header>```<br>
     ```<body>```    <br>
     ```    <h1>Hello, World!</h1>```<br>
     ```    <img src="cloudify-logo.png">```<br>
     ```</body>```<br>
     ```</html>[root@centos7 simple-python-webserver-blueprint]#```

   * To test the application remotely, open a browser on a server that has access to the Linux server and browse to **http://<LINUX_IP>:8000**, as shown in the following screen capture.     
     
     ![Access application remotely]({{< img "intro/evaluation-simple-6.png" >}})

### 6. Uninstalling a Deployed Blueprint

An uninstall workflow that enables you to uninstall the application.

To uninstall the application, run ```cfy uninstall```.<br> 
The following output is expected:   
   ```$ cfy uninstall```<br>
   ```2017-03-28 10:53:12.765  CFY <local> Starting 'uninstall' workflow execution```<br>
   ```2017-03-28 10:53:12.899  CFY <local> [http_web_server_1fa7ij] Stopping node```<br>
   ```2017-03-28 10:53:13.494  CFY <local> [http_web_server_1fa7ij] Deleting node```<br>
   ```2017-03-28 10:53:13.593  CFY <local> [http_web_server_1fa7ij.delete] Sending task 'script_runner.tasks.run'```<br>
   ```2017-03-28 10:53:13.620  CFY <local> [http_web_server_1fa7ij.delete] Task started 'script_runner.tasks.run'```<br>
   ```2017-03-28 10:53:13.637  LOG <local> [http_web_server_1fa7ij.delete] INFO: Running process PID: 59537```<br>
   ```2017-03-28 10:53:13.637  LOG <local> [http_web_server_1fa7ij.delete] INFO: Python Webserver Terminated!```<br>
   ```2017-03-28 10:53:13.638  CFY <local> [http_web_server_1fa7ij.delete] Task succeeded 'script_runner.tasks.run'```<br>
   ```2017-03-28 10:53:13.910  CFY <local> [host_bd1n1g] Stopping node```<br>
   ```2017-03-28 10:53:14.765  CFY <local> [host_bd1n1g] Deleting node```<br>
   ```2017-03-28 10:53:15.154  CFY <local> 'uninstall' workflow execution succeeded```



This completes the deployment of your first application. You have processed an entire application lifecycle workflow using Cloudify.

## Deploying a Complex Sample Application

This procedure enables you to deploy the NodeCellar application locally. NodeCellar is a sample application, created by Christophe Coenraets, that demonstrates the usage of various technologies (Backbone.js, Node.js, MongoDB). You must have installed Cloudify in order to run this evaluation process. For more information about installation, [click here]({{< relref "manager/bootstrapping/.md" >}}). 

{{< gsHighlight >}}
Prerequisites: This blueprint is intended to be run on a linux machine.
{{< /gsHighlight >}}


### 1. Downloading and Extracting the Blueprint

Download and extract the blueprint to your home directory by executing the following commands on your Linux server:   
   ```$ curl -L https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/4.0.tar.gz | tar zx```<br>
   ```cd cloudify-nodecellar-example-4.0```

### 2. Installing the Application

Install the application using the built-in default inputs:   <br>
   ```$ cfy install local-blueprint.yaml```

You can view the logs as Cloudify downloads the required packages and executes all the actions necessary to install the NodeCellar application locally, and confirm that the install workflow completed successfully. The final line should say `CFY <local> 'install' workflow execution succeeded`.

Installation might take some time, particularly when executing the following:   <br>
   ```2017-03-28 11:10:03.369  LOG <local> [mongod_g5vfgo.create] INFO: Downloading http://downloads.mongodb.org/linux/mongodb-linux-x86_64-2.4.9.tgz to /tmp/mongodb-linux-x86_64-2.4.9.tgz```<br><br>
   ```2017-03-28 08:16:21.107  LOG <local> [nodecellar_jxl3wz.configure] INFO: Installing nodecellar dependencies using npm```<br><br>
   ```2017-03-28 08:16:09.145  LOG <local> [mongod_expwi7.start] INFO: Running MongoDB liveness detection on port 28017```<br>
   ```2017-03-28 08:16:09.463  LOG <local> [mongod_expwi7.start] INFO: [GET] http://localhost:28017 000```<br>
   ```2017-03-28 08:16:09.769  LOG <local> [mongod_expwi7.start] INFO: MongoDB has not started. waiting...```<br>

### 3. Listing Node Instances

This procedure enables you to deploy the NodeCellar application locally. NodeCellar is a sample application, created by Christophe Coenraets, that demonstrates the usage of various technologies (Backbone.js, Node.js, MongoDB). You must have installed Cloudify in order to run this evaluation process. For more information about installation, [click here]({{< relref "manager/bootstrapping/.md" >}}). 


Run the following command to view each node that is defined in the blueprint, and its attributes.
```cfy node-instances```

### 4. Retrieving Installation Outputs

You can retrieve the installation outputs by running `$ cfy deployments outputs`.<br>
Depending on the inputs that have been defined, the output will be similar to the following:   <br>
   ```$ cfy deployments outputs```<br>
   ```{```<br>
   ```  "endpoint": {```<br>
   ```    "ip_address": "localhost", ```<br>
   ```    "port": 8080```<br>
   ```  }```<br>
   ```}```


### 5. Confirming the Application is Working

To confirm the application is working, attempt to access it locally, or remotely. If you are attempting remote access, ensure that the firewall is disabled.   

Navigate in a browser to the endpoint defined the deployments outputs: http://localhost:8080/.

   You should see the following webpage:

   ![Nodecellar home page]({{< img "intro/evaluation-complex-2.png" >}})

### 6. Uninstalling a Deployed Blueprint
You can uninstall the application by running the built-in uninstall workflow, which calls the `stop` and `delete` operations on all nodes, and also calls `unlink` on all relationships. To remove the nodecellar app, run ```cfy uninstall```.

To verify that the uninstall completed successfully, look for `CFY <_local_> 'uninstall' workflow execution succeeded` in the final log line.

This completes the deployment of your first application using the Cloudify CLI. You have processed an entire application lifecycle workflow using Cloudify.
