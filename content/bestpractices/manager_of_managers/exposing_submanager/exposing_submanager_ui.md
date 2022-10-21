---
title: "Exposing SubManager via UI"
description: "Exposing SubManager via UI"
weight: 106
alwaysopen: false
---

#### Installation via User Interface
[Upload](https://docs.cloudify.co/latest/working_with/console/widgets/blueprintuploadbutton/) [manager_discovery.yaml](https://github.com/cloudify-community/manager-of-managers/blob/main/submanager_discovery/manager_discovery.yaml) to Spire Manager.

Next, click ***Deploy*** under the blueprint tile. Instead of this, you can also click on the blueprint name and next ***[Create deployment](https://docs.cloudify.co/latest/working_with/console/widgets/blueprintactionbuttons/)***

After that, the following window will appear:
![sub manager exposition]( /images/mom/submanager_exposition.png )

Fill all necessary information and click ***Install*** button at the bottom of the dialog to start the ***Install*** workflow.
To make sure if *Environment* is installed successfully, check the ***Verification of Installation*** chapter in the following part.

### Verification of Installation
To verify if the sub manager Environment is created properly, go to the [Environments tab](https://docs.cloudify.co/latest/working_with/console/pages/environments-page/) and Click on created sub manager.
*Execution Task Graph* must contain **Install completed** tile. You can also check if all tasks are finished with success in *Deployment Events/Logs*.

![Verify 1]( /images/mom/verify_part1.png )

*Deployment Info* tab contains [DEPLOYMENT OUTPUTS/CAPABILITIES](https://docs.cloudify.co/latest/working_with/console/widgets/outputs/) part with information about the sub manager. Check if the information is correct.
![Verify 2]( /images/mom/verify_part2.png )
