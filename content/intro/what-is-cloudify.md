---

title: What Is Cloudify?


weight: 100

---

Cloudify is an open source cloud orchestration framework. Cloudify allows you to model applications and services and automate their entire life cycle, including deployment on any cloud or data center environment, monitoring all aspects of the deployed application, detecting issues and failure, manually or automatically remediating them and handle on going maintenance tasks.


# Application Orchestration

Your application in its entirety (Infrastructure, Middleware, Application Code, Scripts, Tool Configuration, Metrics and Logs) can be described in a Blueprint.
Written in a human readable YAML format, a blueprint allows for high granularity of configuration of your application.

You can define the complete lifecycle of each part of your application in a blueprint. Cloudify can deploy your application and manage it by utilizing the tools of your choice.

Cloudify will launch the compute instances, and configure network, storage and security in order to provide the required infrastructure resources to your application.
Then, it will execute scripts (remotely via SSH or locally on the machines) or invoke configuration management tools to configure your servers and deploy your middleware and code.

# Application Maintenance

Cloudify’s custom workflows make it simple to change your application’s structure.

Cloudify provides metrics and log collection capabilities to stream data to Cloudify so that you can act upon it.

Data aggregation and visualization within Cloudify will allow you to execute the different workflows so that either you or Cloudify itself can make smart, actionable decisions based on business/application KPIs.

Those decisions can either manually or automatically trigger workflows (such as scaling or healing) on the tactical front; or as application behavior analysis on the strategic front.


# Pluggability

Cloudify's plugins complete the framework.

Cloudify-specific plugins can run scripts, CM tools, metrics and logs aggregators, or any other tool for that matter.

A plugin is an abstraction below which a tool is installed, configured and executed. Plugins are written in Python which makes them rather easy to write.

For example, Cloudify's [Script Plugin]({{< relref "plugins/script.md" >}}) allows you to execute scripts at different times throughout the application's lifecycle (creation, configuration, stable state, etc.)

Another example would be the [Diamond plugin]({{< relref "plugins/diamond.md" >}}) which allows users to send back metrics after the application was deployed.

Users can write and deploy their own plugins and import them in their blueprints.

# Standardization

Cloudify's DSL (Domain Specific Language) is based on [TOSCA](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=tosca) (Topology and Orchestration Specification for Cloud Applications) - an emerging standard led by Oasis.


# Open-Source

Cloudify comprises several open-source tools and our Python code which allows for easy composability.

The main open-source components behind Cloudify are:

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

And many more...

Cloudify itself is open-source and accepts contributions.
