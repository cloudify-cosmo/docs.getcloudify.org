---
layout: bt_wiki
title: How to install
category: Docs
draft: false
weight: 500

---

# Installing using RPM
 - [Get the composer rpm file]
 - Open a terminal at the directory where you downloaded the file.
 - install it using following command (replacing `[pkg.rpm]` with the path to the file you downloaded):

 ```sh
  sudo rpm -Uvh [pkg.rpm]
 ```

 After the installation is complete, run `sudo start_composer` in your terminal.

# Change the default types

If you want to change some default types, you can change it in `default_resources_fetch.json`

The `default_resources_fetch.json` is located at `/opt/composer/embedded/composer/backend/StencilsAndImports/default_resources_fetch.json`


 [Get the composer rpm file]: http://getcloudify.org/cloudify-3.3-nfv-hybrid-cloud-workloads-orchestration-openstack-murano-kubernetes.html#composer
