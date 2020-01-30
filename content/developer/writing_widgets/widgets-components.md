---
layout: bt_wiki
title: Widget Components API Reference
category: APIs
draft: false
weight: 700
aliases: ["/apis/widgets-components/", "/developer/custom_console/widgets-components/"]
uiComponentsLink: "//docs.cloudify.co/ui-components/1.0.0"
---

## Widgets Components Reference

Welcome to [Cloudify](http://cloudify.co)’s widgets basic components reference documentation!

You can find here documentation for all [ReactJS](https://reactjs.org/) components developed by Cloudify team. 

All of those components can be used in custom widget development.

### Cloudify UI Components

There is [Cloudify UI Components repository](https://github.com/cloudify-cosmo/cloudify-ui-components) containing shared React components developed internally by Cloudify team. 

Visit [Cloudify UI Components documentation]({{ .Params.uiComponentsLink }}) for details about available components.

Components from Cloudify UI Components library can be accessed using `Stage.Basic` global object. For example if you want to use DataTable component use `Stage.Basic.DataTable`. 

### React Leaflet

The following components from [React-Leaflet](https://react-leaflet.js.org) library can be accessed using `Stage.Basic.Leaflet` global object: 
* [Map](https://react-leaflet.js.org/docs/en/components#map) 
* [TileLayer](https://react-leaflet.js.org/docs/en/components#tilelayer) 
* [Marker](https://react-leaflet.js.org/docs/en/components#marker) 
* [Popup](https://react-leaflet.js.org/docs/en/components#popup) 

For example if you want to use Map component, access it with `Stage.Basic.Leaflet.Map`.

### Semantic UI React

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
* [Table](https://react.semantic-ui.com/collections/table) 

For example if you want to use Message component, access it with `Stage.Basic.Message`. 
