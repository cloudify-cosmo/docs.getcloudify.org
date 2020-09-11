---
layout: bt_wiki
title: Site Management Page
category: Cloudify Console
draft: false
weight: 140
aliases: ["/manager_webui/tenant-management-page/", "/working_with/console/site-management-page/"]
---

The default `Site Management` page displays the Sites widget which provides a list of all sites
and enables you to create, update and delete sites.
You can use **Search** input inside Sites widget to filter the sites list.

![Site Management Page]( /images/ui/sitesPage/sites-page.png )


Each site in the list includes the following:

* **Name**
* **Visibility level** - Represented by the icon next to the name. Permitted users (the sites’s creator, sys admins or tenant managers of the current tenant) can set the site’s visibility by clicking on this icon.
* **Location** - The location of the site, represented by latitude and longitude. Hovering over aim icon opens a popup with small map with marked location. 
* **Created** - Site creation time
* **Creator** - Site creator
* **Tenant** - The name of the tenant the site belongs to (if the site is global, it might belong to a tenant different than the current one).
* **Number of deployments assigned to the site**


The right column of the table allows permitted users to edit the site or delete it.
Also, using the “Create” button on the right top corner of the widget, you will be able to create new sites.


## Creating a Site

![Create Site]( /images/ui/sitesPage/create-site.png )

1. Click the **Create** button.
2. Enter a name for the site. The name must be unique in the scope of the site (tenant/global).
3. Optional, choose the visibility level (the icon of the green man), default: tenant.
4. Optional, enter the location of the site. Expected format: latitude, longitude such as 32.071072, 34.787274. Click on the aim icon to get coordinates by clicking on the world map.
5. Click **Create**.

The site is added to the list.


### Updating a Site

![Update Site]( /images/ui/sitesPage/update-site.png )

1. Click **Update site**.
2. Enter a new name or location for the site.
3. Click **Update**.


### Deleting a Site

Deleting a site will remove the assignment of this site from all assigned deployments.

1. Click **Delete site**.
2. When prompted to verify that you want to remove the site, click **Yes**.
