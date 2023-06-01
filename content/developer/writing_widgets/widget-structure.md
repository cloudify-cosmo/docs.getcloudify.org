---
title: Widget Structure
description: Description of widget definition and directory structure.
category: Console
draft: false
weight: 200
---

A widget is made up of these files:

File          | Required | Description
------------- | -------- |  -----------
`widget.js`   | Yes      | Holds the [widget definition]({{< relref "developer/writing_widgets/widget-definition.md" >}})
`widget.png`  | Yes      | The preview image of the widget in the widgets catalog
`backend.js`  | No       | A widget backend that allows widget frontend code to use [backend services]({{< relref "developer/writing_widgets/widget-backend.md#" >}})
`widget.css`  | No       | The CSS file that the widget uses
`widget.html` | No       | A widget template file that is relevant only when you write a widget in plain JavaScript with an HTML template
`widget.js.gz`| No       | Gzipped version of widget.js
`README.md`   | No       | A widget help ReadMe file in [Markdown format](https://en.wikipedia.org/wiki/Markdown)

Let's say you want to create a widget `my-widget`. You should put your `widget.js` file (and optionally `backend.js` file) into the `src` directory along with any other required files.

In the `widget.js` file, you can use `import` to include any additional files. You can split the widget into a number of files. 

The widget directory structure will look as follows:

* **Development package** (only for development)

    with source code not bundled

```
    /widgets
        /my-widget
            /src
                widget.js
                backend.js  // Optional
            widget.html     // Optional
            widget.png
            widget.css      // Optional
            README.md       // Optional
```

* **Output package** (zipped can be installed in {{< param cfy_console_name >}} application) 

    with source code bundled to single file and backend code copied to main folder

```
    /widgets
        /my-widget
            widget.js
            backend.js      // Optional
            widget.js.gz    // Optional
            widget.html     // Optional
            widget.png
            widget.css      // Optional
            README.md       // Optional
```

In the output package (created archive after building), `src` directory and its content don't have to be included.

`my-widget/widget.js` is a single JS bundle file created from `my-widget/src/widget.js` and contains all the code imported by `my-widget/widget.js`.

For real examples of widgets, see [cloudify-stage/widgets](https://github.com/cloudify-cosmo/cloudify-stage/tree/master/widgets).

For details about files content check [Widget Definition]({{< relref "developer/writing_widgets/widget-definition.md" >}}) page.
