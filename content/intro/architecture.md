---
layout: bt_wiki
title: Cloudify Architecture
category: Intro
draft: false
weight: 400

---

Cloudify is an open source cloud orchestration framework. Cloudify enables you to model applications and services and automate their entire life cycle, including deployment on any cloud or data center environment, monitoring all aspects of a deployed application, detecting issues and failure, manually or automatically remediating such issues, and performing ongoing maintenance tasks.


# Application Orchestration

Your application in its entirety (infrastructure, middleware, application code, scripts, tool configuration, metrics, and logs) aree described in a blueprint. Written in a human-readable YAML format, a blueprint enables high granularity in the configuration of your application.

You can define the complete lifecycle of each part of your application in a blueprint. Cloudify can deploy your application, then manage it by utilizing your preferred tools.

Cloudify launches the compute instances, and configures network, storage and security, to provide the necessary infrastructure resources to your application. Cloudify then executes scripts (remotely via SSH, or locally on the host), or invokes configuration management tools to configure your servers and deploy your middleware and code.

# Application Maintenance

The Cloudify custom workflows make it simple to change your application’s structure.

Cloudify provides metrics and log collection capabilities, to stream data to the Cloudify environment so that you can act on it.

Data aggregation and visualization within Cloudify enables you to execute the different workflows, so that either you or Cloudify itself can make smart, actionable decisions based on business/application KPIs. Those decisions can either manually or automatically trigger workflows such as scaling or healing on the tactical front, or as application behavior analysis on the strategic front.


# Pluggability

A plugin is an abstraction within which a tool is installed, configured and executed. Cloudify plugins complete the framework. Cloudify-specific plugins can run scripts, CM tools, metrics and log aggregators, or any other tool.

For example, the Cloudify [Script plugin]({{< relref "plugins/script.md" >}}) enables scripts to be executed at different times throughout an application's lifecycle (creation, configuration, stable state, and so on.) The [Diamond plugin]({{< relref "plugins/diamond.md" >}}) enables metrics to be returned after an application is deployed.

Plugins are written in Python, meaning that writing them is straightforward. You can write and deploy your own plugins and import them in your blueprints.

# Standardization

Cloudify's DSL (Domain Specific Language) is based on [TOSCA](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=tosca) (Topology and Orchestration Specification for Cloud Applications) - an emerging standard led by Oasis.


# Open Source Tools

Cloudify comprises several open-source tools, and our Python code, which enables easy composition.

The main open-source components within Cloudify are:

* [Nginx](http://nginx.com/)
* [Elasticsearch](https://www.elastic.co/products/elasticsearch)
* [Logstash](https://www.elastic.co/products/logstash)
* [RabbitMQ](http://www.rabbitmq.com/)
* [Riemann](http://riemann.io/)
* [InfluxDB](http://influxdb.com/)
* [Grafana](http://grafana.org/)
* [Flask](http://flask.pocoo.org/)
* [Gunicorn](http://gunicorn.org/)
* [Celery](http://www.celeryproject.org/)
* [Fabric](http://www.fabfile.org/)
* [Diamond](http://diamond.readthedocs.io/)
* [Jinja2](http://jinja.pocoo.org/docs/dev/)

Other open-source components are also used. Cloudify itself is open-source and accepts contributions.
