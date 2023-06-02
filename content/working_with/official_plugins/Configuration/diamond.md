---
title: Diamond Plugin
category: Official Plugins
draft: false
abstract: "Diamond plugin description and configuration"
description: "DEPRECATED: The Diamond plugin is used to install & configure a Diamond monitoring agent (version 3.5) on hosts."
weight: 120
aliases:
  - /plugins/diamond/
  - /developer/official_plugins/diamond/
---

**Diamond Plugin was deprecated in {{< param product_name >}} 5.0. It is no longer supported.**

The Diamond plugin is used to install & configure a [Diamond](https://github.com/BrightcoveOS/Diamond) monitoring agent (version 3.5) on hosts.

Diamond is a Python daemon that collects system metrics and publishes them to multiple destinations. It can collect CPU, memory, network, I/O, load and disk metrics, and many other metrics, as specified in the [documentation](https://github.com/BrightcoveOS/Diamond/wiki/Collectors).
Additionally, it features an API for implementing custom collectors for gathering metrics from almost any source.
