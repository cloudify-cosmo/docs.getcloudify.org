---
layout: bt_wiki
title: Installation
category: Docs
draft: false
weight: 10

---

# Script Installation


Installing Cloudify's Composer is currently done via a script which can be downloaded [here](http://getcloudify.org/downloads/get_cloudify.html).


## Prerequisites

### Supported Operating Systems

Currently the composer server can only be installed on Linux and OS X. The script has been verified with: 

* Ubuntu 14.04 
* CentOS 7.1
* OS X 10.11 (El Capitan). 

It should work on other Linux distributions as well, although it wasn't tested on them. 

### Installed Software

The script requires that you have the following installed:

* Python 2.7.x
* pip 1.5+
* Virtualenv 1.12+
* sudo privileges
* An active internet connection.

# Usage

```
$ sudo python get-cloudify-composer.py -h
...

usage: get-cloudify-composer.py [-h] [-v | -q]
                                [--composer-source COMPOSER_SOURCE]
                                [--uninstall] [--nodejs-source NODEJS_SOURCE]
                                [--dsl-cli-source DSL_CLI_SOURCE]

This script installs Cloudify's Composer on Linux and OS X.
This requires that you have Python 2.7, pip 1.5+ and virtualenv 12+ installed.
pip and virtualenv should be accessible within the $PATH.

The installation process requires an internet connection.

optional arguments:
  -h, --help            show this help message and exit
  -v, --verbose         Verbose level logging to shell.
  -q, --quiet           Only print errors.
  --composer-source COMPOSER_SOURCE
                        A URL or local path to Cloudify's Composer package.
  --uninstall           Uninstalls the composer.
  --nodejs-source NODEJS_SOURCE
                        A URL or local path to a nodejs archive for your distro. This defaults to the official URL.
  --dsl-cli-source DSL_CLI_SOURCE
                        A URL or local path to the cloudify-dsl-parser-cli archive.
```

To install run:

```
$ sudo python get-cloudify-composer.py
...

09:39:37 [INFO] [get-cloudify-composer.py] Downloading http://nodejs.org/dist/v0.10.35/node-v0.10.35-linux-x64.tar.gz to /tmp/tmpr6V_At
09:40:29 [INFO] [get-cloudify-composer.py] Downloading https://s3.amazonaws.com/cloudify-ui/composer-builds/3.3.0/blueprintcomposer-3.3.0.tgz to /tmp/tmpyxi6gh
09:41:10 [INFO] [get-cloudify-composer.py] Creating Virtualenv /opt/cloudify-composer/cloudify-dsl-parser...
09:41:11 [INFO] [get-cloudify-composer.py] Installing https://github.com/cloudify-cosmo/cloudify-dsl-parser-cli/archive/3.3.zip...
09:41:21 [INFO] [get-cloudify-composer.py] You can now run: sudo /opt/cloudify-composer/nodejs/bin/node /opt/cloudify-composer/blueprint-composer/package/server.js to run Cloudify Blueprint Composer.
...
```

And follow the instructions to run it.

Note that if the `python` executable in your path is not python2.7 by default, you can run the script using `python2` instead:

```
sudo python2.7 get-cloudify-composer.py
```

to uninstall run:

```
$ sudo python get-cloudify-composer.py --uninstall
...

09:37:20 [INFO] [get-cloudify-composer.py] Uninstalling Cloudify Blueprint Composer.
Note that this will remove the following: 
/opt/cloudify-composer/nodejs
/opt/cloudify-composer/blueprint-composer
/opt/cloudify-composer/cloudify-dsl-parser
Are you should you want to continue? (yes/no): yes
09:37:21 [INFO] [get-cloudify-composer.py] Uninstall Complete!
...
```

This should remove whatever folders the installer created.
If the composer is running during the uninstall process, it will not be killed.

## Installing another version

Currently, the script installs the latest stable release. To install another version you must use the `--composer-source` and `--dsl-cli-source` flags and provide links to the relevant versions.

# Running the composer

Once the installation has finished, you can run composer with:

```
sudo /opt/cloudify-composer/nodejs/bin/node /opt/cloudify-composer/blueprint-composer/package/server.js
```

And then point your browser to http://localhost:3000/ to start working with the composer.

{{% gsNote title="Running as a Service" %}}
To run in the background and detach from the current shell, prefix the command with `nohup` and end it with `&`. You can also use [Serv](http://github.com/nir0s/serv) to install it as a service.
{{% /gsNote %}}

# Composer ver 2.3 default username
Composer 2.3 requires you to provide a username and password upon login in. The default username and password are: 
USERNAME: composer, PASSWORD: composer. 

