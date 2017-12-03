---
layout: bt_wiki
title: Cheat Sheet
category: internal
draft: true
weight:  700
parent:  none
---

# Text Formatting

{{% table %}}
| **Description** | **Syntax** | **Output** |
|-------------|----------------|-------------
| Emphasized text | \*emphasized\*. | *emphasized*. |
| Bold text | \*\*bold\*\*. | **bold**. |
| Inline code | \`\`\`print "hello world!"\`\`\` | ```print "hello world!"``` |
{{% /table %}}

## Tags

You can add decorative tags:

**Syntax**:

```md
{{</* tag */>}}POODLE{{</* /tag */>}}
```

**Output**:

{{< tag >}}POODLE{{< /tag >}}

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

{{% table %}}
| **Description** | **Syntax** | **Output** |
|-----------------|--------------|------------|
| Link to external site | ```[GigaSpaces](http://www.gigaspaces.com)``` | [GigaSpaces](http://www.gigaspaces.com) |
| Link to a page in docs | ```[Cloudify REST Client]({{< relref "apis/rest-client-python.md" >}})``` | [Cloudify REST Client]({{< relref "apis/rest-client-python.md" >}}) |
| Link to an anchor in page | ```[Text Formatting\](#text-formatting)```, where 'text-formatting' is the anchored DOM element id | [Text Formatting](#text-formatting) |
{{% /table %}}

## Link to latest
To create a link that will always point to the latest version of the docs, use `/latest/`:
```md
[I'm a link](/latest/intro/what-is-cloudify)
```
Will redirect to `http://docs.getcloudify.org/<LATEST_VERSION_NUMBER>/intro/what-is-cloudify

# Tables

**Syntax**:

```md
{{%/* table */%}}
| heading 1 | heading 2 |
|-----------|-----------|
| cell 1x1  | cell 1x2  |
| cell 2x1  | cell 2x2  |
{{%/* /table */%}}
```

**Output**:

{{% table %}}
| heading 1 | heading 2 |
|-----------|-----------|
| cell 1x1  | cell 1x2  |
| cell 2x1  | cell 2x2  |
{{% /table %}}


# Images

To add an image, copy it to a path of your choice within ```/static/images/```

You can then refer to the image path, relative to ```/static/images/```:

{{% table %}}
| **Syntax** | **Output** |
|------------|------------|
| ```![Jon Lovitz]({{</* img "example/jonlovitz.jpg" */>}})```<br>where image is stored at /static/images/example/jonlovitz.jpg | ![Jon Lovitz]({{< img "example/jonlovitz.jpg" >}}) |
{{% /table %}}

# Panels

## Tip

**Syntax**:

``` {{%/* gsTip title="A friendly tip!" */%}}If you're drunk, go home{{%/* /gsTip */%}} ```

**Output**:

{{% gsTip title="A friendly tip!" %}}If you're drunk, go home{{% /gsTip %}}

## Info

**Syntax**:

``` {{%/* gsInfo title="FYI" */%}}Unicorns are real{{%/* /gsInfo */%}} ```

**Output**:

{{% gsInfo title="FYI" %}}Unicorns are real{{% /gsInfo %}}

## Note

**Syntax**:

``` {{%/* gsNote title="Here's a note" */%}}Please remember to flush{{%/* /gsNote */%}} ```

**Output**:

{{% gsNote title="Here's a note" %}}Please remember to flush{{% /gsNote %}}

## Warning

**Syntax**:

``` {{%/* gsWarning title="ACHTUNG" */%}}The gorilla bites!{{%/* /gsWarning */%}} ```

**Output**:

{{% gsWarning title="ACHTUNG" %}}The gorilla bites!{{% /gsWarning %}}

# Page Fields

You can add custom fields to the page metadata and use these fields within the page.

**Syntax**:

In page metadata (Front Matter):
```yaml
---
title: my page

favorite_food: icecream
---
```

In page content:
```md
I love {{</* field "favorite_food" */>}}!
```

**Output**:
```
I love icecream!
```
