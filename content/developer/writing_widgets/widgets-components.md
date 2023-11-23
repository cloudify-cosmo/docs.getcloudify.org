---
title: Widget Components Reference
description: Documentation for all ReactJS components developed by Cloudify team.
category: Cloudify Console
draft: false
weight: 700
aliases: ["/apis/widgets-components/", "/developer/custom_console/widgets-components/"]
ui_components_link: "https://docs.cloudify.co/ui-components/2.34.0"
---

You can find here documentation for all [ReactJS](https://reactjs.org/) components developed by the  {{< param product_name >}} team.
All of those components can be accessed in custom widget development using `Stage.Basic` global object. They are divided in this page into 3 sections depending on the source:

1. **[{{< param product_name >}} UI Components]({{< field "ui_components_link" >}})**  - Shared React components developed by the {{< param product_name >}} team (**[GitHub repository](https://github.com/cloudify-cosmo/cloudify-ui-components)**)
1. **[React-Leaflet](https://react-leaflet.js.org)** - React components for [Leaflet](https://leafletjs.com/) maps
1. **[Semantic UI React](https://react.semantic-ui.com)** - The official [Semantic UI](https://semantic-ui.com/) React integration.


## {{< param product_name >}} UI Components

Components from {{< param product_name >}} UI Components library can be accessed using `Stage.Basic` global object. For example if you want to use DataTable component use `Stage.Basic.DataTable`. 


## React Leaflet

The following components from React-Leaflet library v2 can be accessed using `Stage.Basic.Leaflet` global object:

* [CircleMarker](https://github.com/PaulLeCam/react-leaflet/blob/v2/docs/components.md#circlemarker)
* [FeatureGroup](https://github.com/PaulLeCam/react-leaflet/blob/v2/docs/components.md#featuregroup)
* [Map](https://github.com/PaulLeCam/react-leaflet/blob/v2/docs/components.md#map)
* [Marker](https://github.com/PaulLeCam/react-leaflet/blob/v2/docs/components.md#marker)
* [MarkerClusterGroup](https://github.com/YUzhva/react-leaflet-markercluster#readme)
* [Popup](https://github.com/PaulLeCam/react-leaflet/blob/v2/docs/components.md#popup)
* [TileLayer](https://github.com/PaulLeCam/react-leaflet/blob/v2/docs/components.md#tilelayer)
* [Tooltip](https://github.com/PaulLeCam/react-leaflet/blob/v2/docs/components.md#tooltip)

For example if you want to use Map component, access it with `Stage.Basic.Leaflet.Map`.


## Semantic UI React

The following components from Semantic-UI-React can be accessed using `Stage.Basic` global object:

* [Accordion](https://react.semantic-ui.com/modules/accordion)
* [Breadcrumb](https://react.semantic-ui.com/collections/breadcrumb)
* [Button](https://react.semantic-ui.com/elements/button)
* [Card](https://react.semantic-ui.com/views/card)
* [Checkbox](https://react.semantic-ui.com/modules/checkbox)
* [Container](https://react.semantic-ui.com/elements/container)
* [Divider](https://react.semantic-ui.com/elements/divider)
* [Grid](https://react.semantic-ui.com/collections/grid)
* [Header](https://react.semantic-ui.com/elements/header)
* [Icon](https://react.semantic-ui.com/elements/icon)
* [Image](https://react.semantic-ui.com/elements/image)
* [Input](https://react.semantic-ui.com/elements/input)
* [Item](https://react.semantic-ui.com/views/item)
* [Label](https://react.semantic-ui.com/elements/label)
* [List](https://react.semantic-ui.com/elements/list)
* [Loader](https://react.semantic-ui.com/elements/loader)
* [Message](https://react.semantic-ui.com/collections/message)
* [Modal](https://react.semantic-ui.com/modules/modal)
* [Portal](https://react.semantic-ui.com/addons/portal)
* [Progress](https://react.semantic-ui.com/modules/progress)
* [Radio](https://react.semantic-ui.com/addons/radio)
* [Segment](https://react.semantic-ui.com/elements/segment)
* [Sidebar](https://react.semantic-ui.com/modules/sidebar)
* [Step](https://react.semantic-ui.com/elements/step)
* [Tab](https://react.semantic-ui.com/modules/tab)
* [Table](https://react.semantic-ui.com/collections/table)

For example if you want to use Message component, access it with `Stage.Basic.Message`.
