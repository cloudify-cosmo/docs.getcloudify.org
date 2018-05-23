---
title: Markdown Cheatsheet
description: Syntax instructions for markdown formatting
favorite_food: ice cream
---
# Tabbed paragraphs

A tabbed paragraph create scrolling code blocks like this:

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris efficitur, velit sit amet tempus commodo, orci ipsum laoreet turpis, eu ullamcorper orci enim ut dui.

A tabbed paragraph in a bulleted or numbered list create indented paragraphs like this:

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

# Adding an image

1. Copy the image to a directory in: /static/images
2. In the markdown page, add the alt text and path to the image like this:
`![Alt text]( /images/path/image.png )
`

For example, `![Building with Cloudify]( /images/cfy_complex.png )` shows:

![Building with Cloudify]( /images/cfy_complex.png )

# Panels

## Info

Info boxes give background information that does not prevent proper use of the product.

**Syntax**:

` {{%/* info title="FYI" */%}}After you do this the first time, it gets easier.{{%/* /info */%}} `

**Output**:

{{% info title="FYI" %}}After you do this the first time, it gets easier.{{% /info %}}

## Tip

Tips give additional information for improved use of the product.

**Syntax**:

` {{%/*tip title="A friendly tip!" */%}}Eating on time prevents hunger.{{%/* /tip */%}} `

**Output**:

{{%tip title="A friendly tip!" %}}Eating on time prevents hunger.{{% /tip %}}

## Note

Notes suggest steps that prevent errors that do not cause data loss.

**Syntax**:

` {{%/* note title="Here is a note" */%}}Make sure you have enough disk space.{{%/* note */%}} `

**Output**:

{{% note title="Here is a note" %}}Make sure you have enough disk space.{{% /note %}}

## Warning

Warnings suggest that users think carefully before doing steps that can cause irresversible data loss.

**Syntax**:

` {{%/* warning title="ACHTUNG" */%}}Backup your data before erasing the hard disk!{{%/* warning */%}} `

**Output**:

{{% warning title="ACHTUNG" %}}Backup your data before erasing the hard disk!{{% /warning %}}