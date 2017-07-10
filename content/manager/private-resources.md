---
layout: bt_wiki
title: Making Resources Private
category: Manager
draft: false
weight: 625
---

To separate resources and provide robust access control, Cloudify supports the upload of blueprints, deployments, plugins and snapshots as private resources, using the `--private-resource` flag. 
When you specify this flag the uploaded resource, and its related logs and events, are only accessible and visible to its creator, and to Admin users-- who can see all the resources in a tenant, including private ones. 
 
The default for this value is `false`, meaning the resource is accessible to all users who can access the tenant on which it is uploaded. 
 
Using the private resources flag enables you to create internal resource separation--even within the tenants, meaning that not all users of a tenant can necessarily access all of its resources. 
 
In addition, executions of public deployments are public, whereas those of private deployments are private. 
 
In the Cloudify UI, private resources are indicated with a red lock icon in the top right corner, as shown below.

![Private Resources]({{< img "manager/private-resources-1.png" >}})

### Marking a Resource as Private

To upload or create a private resource from the user interface, click the grey lock icon in the top right of the upload/creation dialog box.