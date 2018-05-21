# How to make your markdown look GREAT!

## Page variables

You can add custom variables to the page metadata and use these variables within the page.

Page metadata (Front Matter):
```yaml
---
title: my page
favorite_food: icecream
---
```

Page content:
```markdown
I love {{< field "favorite_food" >}}!
```

## Links to internal pages

To link to another page in the content directory:
```markdown
[What is Cloudify]({{< relref "install_maintain/installation/installing-manager.md" >}})
```

To link to an anchor on another page in the content directory:
```markdown
[What is Cloudify]({{< relref "install_maintain/installation/installing-manager.md#installing-cloudify-manager" >}})
```

## Adding an image

1. Copy the image to: /static/images/some/path/img.png
2. In the markdown page, add:
```markdown
![some alt text]( /images/some/path/img.png )
```

## Text Formatting

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

## Code Blocks

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

## Links

{{% table %}}
| **Description** | **Syntax** | **Output** |
|-----------------|--------------|------------|
| Link to external site | ```[GigaSpaces](http://www.gigaspaces.com)``` | [GigaSpaces](http://www.gigaspaces.com) |
| Link to a page in docs | ```[Cloudify REST Client]({{< relref "apis/rest-client-python.md" >}})``` | [Cloudify REST Client]({{< relref "apis/rest-client-python.md" >}}) |
| Link to an anchor in page | ```[Text Formatting\](#text-formatting)```, where 'text-formatting' is the anchored DOM element id | [Text Formatting](#text-formatting) |
{{% /table %}}

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

{{% table %}}
| **Syntax** | **Output** |
|------------|------------|
| ```![Jon Lovitz]({{</* img "example/jonlovitz.jpg" */>}})```<br>where image is stored at /static/images/example/jonlovitz.jpg | ![Jon Lovitz]({{< img "example/jonlovitz.jpg" >}}) |
{{% /table %}}

## Panels

### Tip

**Syntax**:

``` {{%/*tip title="A friendly tip!" */%}}If you're drunk, go home{{%/* /tip */%}} ```

**Output**:

{{%tip title="A friendly tip!" %}}If you're drunk, go home{{% /tip %}}

### Info

**Syntax**:

``` {{%/* info title="FYI" */%}}Unicorns are real{{%/* /info */%}} ```

**Output**:

{{% info title="FYI" %}}Unicorns are real{{% /info %}}

### Note

**Syntax**:

``` {{%/* note title="Here's a note" */%}}Please remember to flush{{%/* note */%}} ```

**Output**:

{{% note title="Here's a note" %}}Please remember to flush{{% /note %}}

### Warning

**Syntax**:

``` {{%/* warning title="ACHTUNG" */%}}The gorilla bites!{{%/* warning */%}} ```

**Output**:

{{% warning title="ACHTUNG" %}}The gorilla bites!{{% /warning %}}