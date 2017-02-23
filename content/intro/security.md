---
layout: bt_wiki
title: Cloudify Security Features
category: Intro
draft: false
weight: 400

---

In Cloudify, configuration is not exposed to the user. 

All communications between agents and Cloudify Manager are secured in two ways:<br>
* **Authentication** All requests are sent using related user credentials.
* **Encryption** All communications are encrypted using the ??? algorithm.

There are two certificates that Cloudify uses, one for the agent to Cloudify Manager communication and the other to enable the client to connect to Cloudify Manager.

###User Passwords
When a new user is created, a default password is set by the `admin` who creates the user. The user can change the password using `-p [_new-password_].<br>
Passwords are encrypted using the ??? algorithm and stored in the PostgreSQL database.

###Security for High Availability
Each Cloudify Manager in a cluster uses the same certificate to enable a smooth transition if the active Cloudify Manager becomes unavailable. There is no need to save individual certificates for each Cloudify Manager in the cluster.<br>
