JavaScript Client
%%%%%%%%%%%%%%%%%

In this section we will talk about our javascript client and show how
you can overcome CORS problems and use it to build your own UI. Read our
technical documentation for more information.

.. note::
    :class: summary

    For using the javascript client from    frontend, you will need to setup CORS manually. Read below to see how.

NodeJS Client
=============

To use this client run the command
``npm install cloudify-cosmo/cloudify-js#3.2.0 --save``

Here is an example of how to get blueprints

.. code:: js

        
        var CloudifyClient = require('cloudify-js').CloudifyClient;
        
        var client = new CloudifyClient({'endpoint' : 'http://cloudify.localhost.com'});
        var logger = require('log4js').getLogger('index.nodejs');
        
        client.blueprints.list(null, function( err, response, body){
        logger.info('this is body',body);
        });
        

For more examples on how to use in front end please read the official
javascript documentation

JavaScript Client - How to enable CORS
======================================

If you wish to use the cloudify javascript client, you will run into
CORS issues.

CORS happens when you generate requests from one origin (protocol +
domain + port) to another.

However you can easily configure your nginx server to enable CORS for
you while keeping your network safe.

.. code:: text

        location ^/restapi {
          add_header 'Access-Control-Allow-Origin' 'customui.example.com';
          add_header 'Access-Control-Allow-Credentials' 'true';
          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
          add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        
          proxy_pass http://manager.example.com;
        }
        

The example above references 2 origins. The first is
``customui.example.com`` which is the domain you serve your UI from. The
second, ``manager.example.com`` is cloudify’s manager host that you have
set up earlier.

You need to replace these 2 values with the ones that suite you best.

We begin with ``location /restpi`` which means this rule will only
affect routes that begin with ``/restapi``. you need to change this
value according to your client’s configuration. Our example suites the
following use case:

``var client = new CloudifyClient({'endpoint' : 'http://customui.example.com/restapi'});``

We then start to add headers to add cross origin requests which will
resolve the problem.

The configuration ends with the line
``proxy_pass http://manager.example.com;``. This line is responsible for
the calls actually reaching the cloudify manager.

{{% gsTip title=“Using a wild card” %}}

You can also replace ``customui.example.com`` with ``*``

This means that every website can write javascript that has access to
your cloudify manager.

This might be the right use case for you, it is also easier to use to
see first results, however using it when it is not your use-case opens a
security breach and is not recommended so make sure not to leave it open
on your production environment

{{% /gsTip %}}
