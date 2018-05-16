
---
layout: bt_wiki
title: Evaluating Cloudify
category: Introduction
draft: false
weight: 600
aliases: /intro/evaluating-cloudify/
---
This section will assist you in evaluating Cloudify through the deployment of a simple web application.

## Deploying a Simple 'Hello World' Web Server

This procedure enables you to deploy a simple ‘Hello World’ Web server. You must have Cloudify CLI installed in order to run this evaluation process.

Now that you have installed Cloudify CLI, it is time to get a glimpse of what it can do. In this procedure you:

* Download and extract a sample blueprint from the Cloudify Sample repository.
* Deploy the Web application blueprint locally by executing an install workflow.
* Access and confirm the ‘Hello World’ message.
* Optional: Retrieve the outputs of the installation.
* Optional: List the node instances that are part of the installation.
* Remove the Web application by executing an uninstall workflow.

PREREQUISITES:

* Git installed: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
* Ensure port 8000 is open

### 1. Downloading and Extracting the Blueprint

Use the following command to clone the repo and extract the installation.<br>
   ```$ git clone https://github.com/cloudify-examples/local-simple-python-webserver-blueprint.git```<br>
The process creates a directory called ```local-simple-python-webserver-blueprint```.

### 2. Installing the Blueprint

Use the following commands to change directory and begin the install process:<br> 
```cd local-simple-python-webserver-blueprint```<br>
```cfy install blueprint.yaml```

*  You might be prompted to provide permission to listen on the localhost.
*  If the install fails, or the Website does not appear, you might need to open your firewall.

You should see the following output once done.   
   ```$ cfy install blueprint.yaml```<br>
   ```Initializing local profile ...```<br>
   ```Initialization completed successfully```<br>
   ```Initializing blueprint...```<br>
   ```Initialized blueprint.yaml```<br>

   ```2017-03-28 10:53:01.736  CFY <local-simple-python-webserver-blueprint> 'install' workflow execution succeeded```

### 3. Confirming the Application is Working

To confirm the application is working, try accessing it.   
      
   * To access the application locally, run:     
     ```curl http://localhost:8000```     
     
     You should see the following output in your terminal:
     ```<html>```    <br>
     ```    <header>```    <br>
     ```        <title>Cloudify Hello World</title>```<br>
     ```    </header>```<br>
     ```<body>```    <br>
     ```    <h1>Hello, World!</h1>```<br>
     ```    <img src="cloudify-logo.png">```<br>
     ```</body>```<br>
     ```</html>```

   * To test the application in a browser go to http://localhost:8000, and you should see the following:     
     
     ![Access application remotely]( /images/intro/evaluation-simple-6.png )

### 4. Optional: Retrieving Node Instances

Each logical entity in your application that is defined within a blueprint is a called a _node_. After a deployment is created, each logical node becomes a set of one or more _node-instances_, which are instances of that node. A node can have multiple node-instances, such as multiple virtual machines.

Run the following command to view each node that is defined in the blueprint, and its attributes.
```cfy node-instances list -b local-simple-python-webserver-blueprint```

### 5. Optional: Retrieving the Installation Outputs

When you install a blueprint with Cloudify, a deployment is created. A deployment is a model of the application that will be modified over the Application lifecycle, including all of the node-instances and their runtime properties. A deployment also has outputs, which can be the IP addresses, ports, or other runtime-properties generated during Cloudify workflows, that you want to take and use somewhere else.

Run the following command to retrieve the outputs:<br>
```cfy deployments outputs -b local-simple-python-webserver-blueprint```

### 6. Uninstalling a Deployed Blueprint

An uninstall workflow that enables you to uninstall the application.

To uninstall the application, run ```cfy uninstall -b local-simple-python-webserver-blueprint```.<br> 
The following output is expected:
   ```$ cfy uninstall```<br>
   ```2017-03-28 10:53:12.765  CFY <local-simple-python-webserver-blueprint> Starting 'uninstall' workflow execution```<br>

   ```2017-03-28 10:53:15.154  CFY <local-simple-python-webserver-blueprint> 'uninstall' workflow execution succeeded```

This completes the deployment of your first application. You have processed an entire application lifecycle workflow using Cloudify.

To try Cloudify in a hosted environment for more complex applications, check out the [Cloudify Labs](https://cloudify.co/HostedCloudify)
