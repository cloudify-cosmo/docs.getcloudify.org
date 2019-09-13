---
layout: bt_wiki
title: FAQs
description: Frequently Asked Questions on widget development.
category: Cloudify Console
draft: false
weight: 800
---

### How to present info/warning data to the user?
Use `Message` component.


### How to present error messages to the user?
Use `ErrorMessage` component.


### How to show loading/fetching component?
Use `Loading` component or `loading` prop on specific Semantic UI React component.
Use `Icon` component with `spinner` and `loading` prop set.

### Should I use `propTypes` and `defaultProps`?
Always define `propTypes` and `defaultProps` static’s in new components.

When defining `propTypes` try to be as specific as possible (e.g. when object is expected, then try to specify what kind of fields are expected using `shapeOf` method).


### How to use sorting/pagination/searching DataTable features with external APIs?
`fetchData` prop in `DataTable` executing `toolbox.refresh` gives you access to parameters in fetchData method in widget definition. Complicated from the first sight, snippet would be useful for that case.


### What are the best practices for providing input fields?
1. Use `Form.Field` component as a wrapper for all input fields as it provides a generic way of adding help description, required mark, label and error indication.
2. Don’t use placeholders as labels.
3. Always provide labels for input fields.
4. Mark fields as required when they are mandatory.
5. Provide user friendly field description if possible.


### How to reference static file from widget’s code?
Use `Stage.Utils.Url.widgetResourceUrl` method.