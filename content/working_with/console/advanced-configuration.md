---
layout: bt_wiki
title: Advanced Configuration
category: Cloudify Console
draft: false
abstract: Advanced Configuration of Cloudify Console
weight: 170
---

You can configure more advanced customization of Cloudify Console by modifing user configuration file residing on Cloudify Manager machine.

Configuration file path is `/opt/cloudify-stage/conf/userConfig.json`. You can see a list of available settings and default values in [cloudify-cosmo/cloudify-stage repository](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/conf/userConfig.json).

Please be aware that for changes to make effect, you have to restart Cloudify Console service on Cloudify Manager machine by executing:

```
service cloudify-stage.service restart 
```
