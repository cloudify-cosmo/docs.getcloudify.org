---

title: The Deployment Creation Flow



weight: 500
---


![Cloudify Create Deployment]({{ c.img("architecture/cloudify_flow_create_deployment.png" ) }})

* The REST service will retrieve the blueprint document from Elasticsearch and create a "phyical" manifestation of it by expanding nodes to node-instances, attaching node-instance ID's to them, and so forth.