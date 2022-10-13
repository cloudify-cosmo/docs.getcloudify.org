+++
title = "Services"
description = "Cloudify manager installation and maintanance"
weight = 20
alwaysopen = false
+++

The services that are described in this section are used to run functioning Cloudify Manager.

# Webserver
TBD

# Cloudify Console
Stage is the service responsible for Cloudify Manager Console. It contains of front-end and back-end services. The front-end service provides the web-ui console. The backend has two purposes. The first one is to aggregate multiple API calls to RestAPI behind a single API call. The second on is to provide a layer related to the web-ui console such as widgets and signed-in user layout. The data is stored either in the DB it’s connected to or on the filesystem.

# AMQP-Postgres
TBD

# Management Worker
TBD

# Manager Rest-Service
Is the backend service responsible for all the Rest API endpoints. The service responsible either to fetch data straight from DB or delegating to other services.


# Cloudify API
TBD

# Cloudify Execution Scheduler
TBD

# PostgreSQL
TBD

# RabbitMQ
TBD

# Cloudify Composer
TBD

# Monitoring Service
TBD