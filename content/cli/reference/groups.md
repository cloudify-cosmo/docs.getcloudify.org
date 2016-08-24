---

title: groups



weight: 80
---

The `cfy groups` command is used to view information on the different groups of a deployment.

You can use the command to list all groups.


## Commands


### list

Usage: `cfy groups list -d DEPLOYMENT_ID`

Lists all groups for a deployment.

#### Required flags

* `-d, --deployment-id=DEPLOYMENT_ID` - The ID of the deployment to list groups for


&nbsp;
#### Example

```markdown
$ cfy groups list -d hello_world
...

Listing groups for deployment hello_world...
No groups defined for deployment hello_world

...
```