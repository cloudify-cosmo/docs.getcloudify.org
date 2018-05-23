---
title: Markdown Cheatsheet
description: Syntax instructions for markdown formatting
favorite_food: ice cream
---
# Tabbed paragraphs

A tabbed paragraph looks like this:

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris efficitur, velit sit amet tempus commodo, orci ipsum laoreet turpis, eu ullamcorper orci enim ut dui.

A tabbed paragraph in a bulleted or numbered list looks like this:

* Lorem

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris efficitur, velit sit amet tempus commodo, orci ipsum laoreet turpis, eu ullamcorper orci enim ut dui.

# Page variables

You can add custom variables to the page metadata and use these variables within the page.

Markdown:
```yaml
---
title: my page
favorite_food: ice cream
---

I love {{</* field "favorite_food" */>}}!
```

HTML: *I love {{< field "favorite_food" >}}!*

# Links to internal pages

* To link to another page in the content directory:

    `[The manager installation page]({{</* relref  "install_maintain/installation/installing-manager.md" */>}})`

    For example: [The manager installation page]({{< relref  "install_maintain/installation/installing-manager.md" >}})

* To link to an anchor on another page in the content directory:

    `[The manager installation instructions]({{</* relref "install_maintain/installation/installing-manager.md#installing-cloudify-manager" */>}})`

    For example: [The manager installation instructions]({{< relref "install_maintain/installation/installing-manager.md#installing-cloudify-manager" >}})

# Text Formatting

| **Description** | **Syntax** | **Output** |
|-------------|----------------|-------------
| Emphasized text | \*emphasized\* | *emphasized* |
| Bold text | \*\*bold\*\* | **bold** |
| Inline code | \`print "hello world!"\` | `print "hello world!"` |

# Code Blocks

To add code blocks of a specific language, e.g. python, type this:

~~~md
```python

# this is python code

def hello_world():

  print "Hello World!"

```
~~~

Output:

```python
# this is python code

def hello_world():
  print "Hello World!"
```

# Links

| **Description** | **Syntax** | **Output** |
|-----------------|--------------|------------|
| Link to external site | `[Cloudify](http://www.cloudify.co)` | [Cloudify](http://www.cloudify.co) |
| Link to a page in docs | `[Cloudify REST Client]({{< relref "install_maintain/installation/installing-manager.md" >}})` | [Cloudify REST Client]({{< relref "install_maintain/installation/installing-manager.md" >}}) |
| Link to an anchor in page | `[Installing Cloudify]({{< relref "install_maintain/installation/installing-manager.md#installing-cloudify-manager" >}})` | [Installing Cloudify]({{< relref "install_maintain/installation/installing-manager.md#installing-cloudify-manager" >}}) |

# Tables

**Syntax**:

```md
| heading 1 | heading 2 |
|-----------|-----------|
| cell 1x1  | cell 1x2  |
| cell 2x1  | cell 2x2  |
```

**Output**:

| heading 1 | heading 2 |
|-----------|-----------|
| cell 1x1  | cell 1x2  |
| cell 2x1  | cell 2x2  |


| **Syntax** | **Output** |
|------------|------------|
| ```![Building with Cloudify]( /images/cfy_complex.png )```<br>where the image is stored at /static/images/cfy_complex.png | ![Building with Cloudify]( /images/cfy_complex.png ) |

# Adding an image

1. Copy the image to a directory in: /static/images
2. In the markdown page, add the alt text and path to the image like this:
`![Alt text]( /images/path/image.png )
`

For example, `![Building with Cloudify]( /images/cfy_complex.png )` shows:

![Building with Cloudify]( /images/cfy_complex.png )

# Panels

## Tip

**Syntax**:

` {{%/*tip title="A friendly tip!" */%}}If you are drunk, go home{{%/* /tip */%}} `

**Output**:

{{%tip title="A friendly tip!" %}}If you are drunk, go home{{% /tip %}}

## Info

**Syntax**:

` {{%/* info title="FYI" */%}}Unicorns are real{{%/* /info */%}} `

**Output**:

{{% info title="FYI" %}}Unicorns are real{{% /info %}}

## Note

**Syntax**:

` {{%/* note title="Here is a note" */%}}Please remember to flush{{%/* note */%}} `

**Output**:

{{% note title="Here is a note" %}}Please remember to flush{{% /note %}}

## Warning

**Syntax**:

` {{%/* warning title="ACHTUNG" */%}}The gorilla bites!{{%/* warning */%}} `

**Output**:

{{% warning title="ACHTUNG" %}}The gorilla bites!{{% /warning %}}