+++
title = "Cloudify CLI"
description = "Installing the Cloudify CLI"
weight = 95
alwaysopen = false
+++

{{%children style="h2" description="true"%}}


### Other deployment options and CLI packages

Current Version: 5.0.5         [Release Notes](https://cloudify.co/cloudify-5-0-5-release-notes/)

#### Downloads

Cloudify Manager Images:  [RPM](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-manager-install-5.0.5-ga.x86_64.rpm)	|	[Docker](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-docker-manager-5.0.5.tar)	|	[QCOW](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-manager-5.0.5ga.qcow2)

Cloudify CLI: [RPM](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli-5.0.5.1~ga.el6.x86_64.rpm)	|	[DEB](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli_5.0.5.1~ga_amd64.deb)	|	[EXE](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli-5.0.5.1ga.exe)	|	[OSX](http://repository.cloudifysource.org/cloudify/5.0.5/ga-release/cloudify-cli-5.0.5.1-ga.pkg)

One more option for installing CLI for python users is using PyPI library :

Prerequisites to have a successful installation:

**NOTE** [ if you encounter problems, depending on OS user permissions, you might need to run the commands as sudo-er by adding `sudo` in front of the command ]

  * python 2.7 [ if you don't have it installed, you can install it depending on your OS, you can use `apt-get install -y python` , on ubuntu for example ]
  * pip [ if you don't have it installed, you can install it depending on your OS , you can use `yum install -y epel-release && yum install -y pip` on centos for example ]
  * virtualenv [ if you don't have it installed, you can install it using `pip install virtualenv=={ver}` , you can use `15.1.0` for example ]
  * if you are here , that means the above is done , you can create a new virtual environment for `cfy` , using :
    * `virtualenv cfy` that will create a folder with `cfy` name in the current directory
    * you can activate this virutalenv `source {path_to_that_created_folder_above}/bin/activate`
    * if source worked out, you can just run this command now `pip install cloudify=={ver}`, for example here you can use `5.0.5.1`

if everything is ok , it should be as simple as this :

```
~ virtualenv cfy5.0.5.1
New python executable in /Users/me/cfy5.0.5.1/bin/python
Installing setuptools, pip, wheel...
done.
~ source cfy5.0.5.1/bin/activate
(cfy5.0.5.1) ~ cfy --version
Premium edition

Cloudify CLI 5.0.5
Cloudify Manager 5.0.5 [ip=10.239.3.28]

(cfy5.0.5.1) ~
```



By downloading Cloudify, you agree to the [End User License Agreement](https://cloudify.co/license).
Cloudify is available for an evaluation period of 60-days.

Read about the differences between our [Cloudify versions](https://cloudify.co/product/community-enterprise-editions).
