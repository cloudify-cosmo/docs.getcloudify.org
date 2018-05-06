---
layout: bt_wiki
title: Upgrading to a newer version
category: Manager
draft: false
weight: 900

---

This topic describes how to upgrade Cloudify Manager.
It is also applicable when restoring snapshots onto a new Cloudify Manager (e.g. to move to a larger host).

{{% tip title="Version Relevance" %}}
You can use this process to replace an existing Cloudify Manager 3.4.2 or 4.x with a new one of version 4.2, or higher.
{{% /tip %}}

Upgrading Cloudify Manager is possible in one of two ways:<br>
1. In place, tearing down the existing manager and bootstrapping over the top (only supported in 4.0.1+ with simple manager blueprints).<br>
2. On a new manager, migrating agents from the existing manager.<br>

{{% note title="Caution" %}}
If you are upgrading to a new manager (rather than in place), do not delete the old manager until you are told to do so or you will be likely to require support.
{{% /note %}}

{{% note title="Caution" %}}
Ensure that during the upgrade process no other users are connecting to any manager services (e.g. to the web UI or the composer).
Having users connected to these services while the snapshot restore is in progress may cause problems with the restore (e.g. missing blueprints in composer).
{{% /note %}}

{{% note title="Cloudify Consoles" %}}
Please note that Composer and Stage (the Cloudify Consoles) will only be restored to the state they were in in the snapshot if the snapshot is from a 4.2 manager.<br>
If you have a snapshot and have made any modifications to these components (e.g. creating blueprints in composer or adding widgets to Stage), please discuss with your support contact.
{{% /note %}}

{{% note title="Premium users" %}}
If you are a premium user and are at any point uncertain about the process please discuss with your support contact before proceeding.
{{% /note %}}

# Preparation

{{% note title="Caution" %}}
If you are restoring a 4.0.1 manager please ensure you have applied update-3 to the manager. Contact support for information.
{{% /note %}}

1. To keep your existing data, take a snapshot on your old manager and download it. For example (consult documentation for the manager you are upgrading from if these commands are invalid):<br>
    ```cfy snapshots create upgrade_snapshot```<br>
    ```cfy snapshots download upgrade_snapshot```<br>

2. If you are upgrading a Cloudify 4.0.0 manager in-place you must manually copy the certificates from the manager. By default they are located in `/etc/cloudify/ssl`<br>
   If this is the case, please contact support for assistance in restoring them.


Once you have your snapshot, proceed to either [In-place upgrade](#in-place-upgrade) or [New host upgrade](#new-host-upgrade)

# In-place upgrade

{{% note title="Caution" %}}
4.0.1+ with simple manager blueprints only!
{{% /note %}}

1. If you are upgrading a Cloudify 4.x manager prior to 4.2.0 and are using multiple Cloudify users, ensure that you copy the rest security configuration. By default this is in `/opt/manager/rest-security.conf`<br>
   If you do not do this then you will need to reset the password of every user after the snapshot is restored.

2. Tear down the old manager- consult the documentation for the old version of the manager for the correct procedure.

3. Upload and restore the snapshot, e.g.:<br>
  ```cfy snapshots upload -s upgrade_snapshot upgrade_snapshot.zip```<br>
  ```cfy snapshots restore upgrade_snapshot --restore-certificates```<br>
  The manager will reboot once the restore process is complete.

4. If you backed up the rest security configuration in the first step you will now need to restore it to the manager. Please contact support for this.

5. Update the agents:<br>
  ```cfy agents install --all-tenants```

# New host upgrade

1. Update your cloudify CLI to version 4.2, e.g.:<br>
   ```pip install cloudify==4.2```

2. Make sure cloudify is using your new manager:<br>
  ```cfy profiles use --manager-username <username of new manager> --manager-password <password of new manager> --manager-tenant default_tenant <manager ip address>```

3. Upload and restore the snapshot, e.g.<br>
  ```cfy snapshots upload -s upgrade_snapshot upgrade_snapshot.zip```<br>
  ```cfy snapshots restore upgrade_snapshot```<br>
  If this was a 4.2 snapshot then the manager rest service will restart a few seconds after the workflow finishes. You should wait at least 10 seconds after the workflow completes in this case.

4. If you are updating from a pre-4.2 snapshot and using multiple users you will now need to restore the old users. Please contact support for this.<br>
   Alternatively, you may reset the passwords of all old users to make them work again.

5. Update the agents:<br>
  ```cfy agents install --all-tenants```

6. Shut down the old manager. It may now be deleted. If you intend to keep the old manager for any purposes and you use auto heal policies then the old manager MUST be disconnected entirely from any networks it would use to conduct healing workflows.

{{% note title="Caution" %}}
If you are using auto-heal policies then from the moment the new agents are installed until the old manager is deleted any heal workflows that execute are likely to duplicate VMs.
You will be able to see if this has happened using ```cfy executions list --all-tenants``` to check for heal workflows run during that time.
If you are a premium user support can assist you in disabling riemann on the old manager during the upgrade process, but please be aware that this will cause any healing or scaling to be disabled entirely during the restore process. This may result in nodes that fail during the upgrade process to remain in a failed state  as the new manager will only attempt to heal nodes once it has received some events from them.
{{% /note %}}
