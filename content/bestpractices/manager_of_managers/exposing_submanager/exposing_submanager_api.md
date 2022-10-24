---
title: "Exposing SubManager via API"
description: "Exposing SubManager via API"
weight: 104
alwaysopen: false
---

#### Installation with API Call

To use Cloudify API, you can refer to [official API documentation.](https://docs.cloudify.co/latest/developer/apis/rest-service/)

##### Uploading example

```
curl -X PUT \
    --header "Tenant: default_tenant" \
    --header "Content-Type: application/json" \
    -u admin:adminpw \
    "http://localhost/api/v3.1/blueprints/submanager_blueprint?application_file_name=blueprint.yaml&visibility=tenant&blueprint_archive_url=https://url/to/archive/master.zip&labels=customer=EXL"
```

##### Create deployment example
```
curl -X PUT \
    --header "Tenant: default_tenant" \
    --header "Content-Type: application/json" \
    -u admin:adminpw \
    -d '{"blueprint_id": "sub manager_blueprint", "inputs": {"cloudify_username": "admin", "cloudify_manager_ip": "10.0.10.10", "cloudify_port": "80", "cloudify_protocol": "http", "cloudify_tenant": "default_tenant"}, "visibility": "tenant", "site_name": "LONDON", "labels": [{"customer": "EXL"}]}' \
    "http://localhost/api/v3.1/deployments/submanager1?_include=id"
```

##### Install example
```
curl -X POST \
    --header "Tenant: default_tenant" \
    --header "Content-Type: application/json" \
    -u admin:admin \
    -d '{"deployment_id":"sub manager1", "workflow_id":"install"}' \
    "http://localhost/api/v3.1/deployments/submanager1?_include=id"
```


### Verification of Installation
To verify if the sub manager Environment is created properly, check the deployments list:
```
curl -X GET \
    --header "Tenant: default_tenant" \
    --header "Content-Type: application/json" \
    -u admin:admin \
    "http://localhost/api/v3.1/deployments?_include=id"
```
Next, check the deployments details
```
curl -X GET \
    --header "Tenant: default_tenant" \
    --header "Content-Type: application/json" \
    -u admin:admin \
    "http://localhost/api/v3.1/deployments?id=<deployment-id>&_include=id"
```