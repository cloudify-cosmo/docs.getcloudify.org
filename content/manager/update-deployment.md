---
layout: bt_wiki
title: Updating a Deployment
category: Manager Intro
draft: false
weight: 650
---

Cloudify enables updating an existing deployment. In order to update an existing deployment,
a blueprint which describes the modification is needed. The Cloudify Manager will
extract any difference between the original deployment blueprint and the modified deployment 
blueprint, execute any required operations and update the data model.

## Updating a Deployment via the CLI
Updating a deployment requires the deployment id of the deployment to update, 
and the update source. Cloudify's CLI support updating an existing deployment from two sources.

### Updating from an archive
Cloudify allows you to update a deployment from a pre-packaged archive such as *.tar, *.tar.gz, *.tar.bz, *.zip.

Follows an example of deployment update from an archive:
{{< gsHighlight  bash >}}
cfy deployments update -d <DEPLOYMENT_ID> --archive-location <ARCHIVE_LOCATION>
{{< /gsHighlight >}}

In case the main application file isn't *blueprint.yaml*, you can supply a different file name. Follows an example of such a usecase:

{{< gsHighlight  bash >}}
cfy deployments update -d <DEPLOYMENT_ID> --archive-location <ARCHIVE_LOCATION> --blueprint-filename <BLUEPRINT_FILENAME>
{{< /gsHighlight >}}

### Updating from a blueprint file
Allows you to specify a path to a Blueprint file, and the Cloudify will take care of compressing the folder and its contents for you.

Follows an example of deployment update from a blueprint:
{{< gsHighlight  bash >}}
cfy deployments update -d <DEPLOYMENT_ID> --blueprint-path <BLUEPRINT_FILE>
{{< /gsHighlight >}}


### Providing inputs
Cloudify supports providing inputs to the deployment update. Supplied inputs will override any existing
inputs with the same name, and append any previously non-existent inputs. 

Follows an example for deployment update using a blueprint file and additional inputs
{{< gsHighlight  bash >}}
cfy deployments update -d <DEPLOYMENT_ID> --blueprint-path <BLUEPRINT_FILE> --inputs <INPUTS>
{{< /gsHighlight >}}
