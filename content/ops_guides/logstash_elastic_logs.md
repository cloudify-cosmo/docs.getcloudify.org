# Logstash Cloudify setup

## Installing the logstash in the cloudify host environment

The configuration of the logstash needs to be done on the Cloudify hosting environment.

### adding the logstash repo

As a prerequisite, you should have installed Java 8 on your server. Firstly, lets install logstash with yum. We need to add a repo in /etc/yum.repos.d directory named as example logstash.repo and paste this text to file.

```
[logstash-7.x]
name=Elastic repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
```

After this, we can install logstash using command.

```
yum install logstash
```

Logstash has a lot of input plugins that enables to read data from specific sources. In example, JDBC is a Java based API that allows access and execute queries. Oracle, PostgreSQL and MySQL are compatible with jdbc and you can use this input to read from these providers. So here we will install jdbc plugin as follows;

```
/usr/share/logstash/bin/logstash-plugin install logstash-input-jdbc
```

Finally you will need a JDBC library for reading data from postgresql. Please, download the latest jdbc in our case: 4.2 version from [here](https://jdbc.postgresql.org/download/postgresql-42.5.0.jar), and put into this folder;

```
/usr/share/logstash/logstash-core/lib/jars
```

Next you just need to modify the support_escapes settings in /etc/logstash/logstash.yml file, so we can use escape characters in our postgresql queries in logstash.

```
config.support_escapes: true
```

## Setting up pipelines & configs

### adding logs & events (Postgres) & syslog monitoring

Create the /etc/logstash/conf.d/events.conf and /etc/logstash/conf.d/logs.conf files

events.conf
```
input {
  jdbc {
    jdbc_connection_string => "jdbc:postgresql://localhost:5432/cloudify_db"
    jdbc_user => "<user_secret>"
    jdbc_password => "<password_secret>"
    jdbc_driver_class => "org.postgresql.Driver"
    statement => "SELECT * from events"
    schedule => "* * * * *"
 }
}

output {
  elasticsearch {
    hosts => ["http://<elastic_ip>:9200"]
    index => "events"
    document_id => "%{timestamp}"
    action => "create"
    #user => "es_user" //eventually when your elastic is protected
    #password => "es_password"
 }
}
```

logs.conf
```
input {
  jdbc {
    jdbc_connection_string => "jdbc:postgresql://localhost:5432/cloudify_db"
    jdbc_user => "<user_secret>"
    jdbc_password => "<password_secret>"
    jdbc_driver_class => "org.postgresql.Driver"
    statement => "SELECT * from logs"
    schedule => "* * * * *"
 }
}

output {
  elasticsearch {
    hosts => ["http://<elastic_ip>:9200"]
    index => "events"
    document_id => "%{timestamp}"
    action => "create"
    #user => "es_user" //eventually when your elastic is protected
    #password => "es_password"
 }
}
```

syslogs.conf
```
input {

  file {
    path => "/var/log/cloudify/mgmtworker/mgmtworker.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/rest/*.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/composer/*.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/execution-scheduler/*.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/nginx/*.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/stage/*.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/rabbitmq/log/*.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/prometheus/*.log"
    start_position => "beginning"
  }

  file {
    path => "/var/log/cloudify/ampq-postgres/*.log"
    start_position => "beginning"
  }
}

output {
  elasticsearch {
    hosts => ["http://<elastic_ip>:9200"]
    index => "syslogs"
    document_id => "%{@timestamp}"
    doc_as_upsert => true
    #user => "es_user" //eventually when your elastic is protected
    #password => "es_password"
 }
}
```

Next, you will need to add the pipelines in the /etc/logstash/pipelines.yml
```
- pipeline.id: logs
  path.config: "/etc/logstash/conf.d/logs.conf"

- pipeline.id: events
  path.config: "/etc/logstash/conf.d/events.conf"

- pipeline.id: syslogs
  path.config: "/etc/logstash/conf.d/syslogs.conf"
```

## Creating the logstash service

Please create the /etc/supervisord.d/cloudify-logstash.cloudify.conf
```
[program:cloudify-logstash]
user=root
group=root
stopasgroup=true
command=/usr/share/logstash/bin/logstash --path.settings /etc/logstash
```

Next run, the command
supervisorctl start cloudify-logstash

### Notes

Please remember that under your kibana instance you will need to configure the index patterns to be able to see the logs under the Discover tab. For details please check [here](https://www.elastic.co/guide/en/kibana/7.17/index-patterns.html)
