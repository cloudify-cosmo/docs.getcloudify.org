# docs.getcloudify.org

<!-- [![Circle CI](https://circleci.com/gh/cloudify-cosmo/docs.getcloudify.org/tree/3.4.0-build.svg?style=shield)](https://circleci.com/gh/cloudify-cosmo/docs.getcloudify.org/tree/3.5.0-build) -->

This is a new site based on [Hugo]( https://gohugo.io/ ) and the [DocDock]( https://github.com/vjeantet/hugo-theme-docdock.git ) theme.

# Installing the Cloudify Documentation Center

To run the Cloudify Documentation Center locally:

1. Install the latest Hugo:

    * On CentOS:

        1. Install the copr plugin for yum: `sudo yum install yum-plugin-copr`
        1. Enable the Hugo repository: `sudo yum copr enable daftaupe/hugo`
        1. Install Hugo: `sudo yum install hugo`

    * On Ubuntu:
    
        * Install Hugo: `sudo apt-get install hugo`

    * On Windows:

        1. Install [chocolatey](https://chocolatey.org/install).
        1. Install Hugo: `choco install hugo -confirm`
        
    * On MacOS:

        1. Install [homebrew](https://brew.sh/)
        2. Install Hugo: `brew install hugo`

1. Verify that Hugo is installed: `hugo version`
1. Clone this repository to your local host.
1. Change directory to the docs.getcloudify.org directory.
1. Checkout the docdock branch: `git checkout beta-build`
1. Start the hugo web server: `hugo server`

To access the site, go to: http://localhost:1313

# Staging
=======

Version branches, for example 4.3.0-build, are automatically built to 

All other branches are built to the staging directory when you commit a change so you can preview and share your changes before publishing them in the official public documentation.

Your staging website is available at: https://docs.cloudify.co/staging/<branch_name>

Don't worry about cluttering - staging websites are automatically removed after 21 days.

# Publishing

Official version documentation is published through the version build branches (for example 4.3.0-build).

The master branch is published to https://docs.cloudify.co/staging/dev and represents the latest documentation for the latest publicly available release. This branch is published to the latest official version site once a day.

The next branch is published to https://docs.cloudify.co/staging/next and represents the latest documentation for the upcoming release. This branch is published to the community documentation site https://docs.cloudify.co/community each time a community milestone is released.

<!-- Content organization
====================

* the pages are now divided to directories (e.g. 'plugins', 'intro'), where each directory represents a section on the site's left sidebar. Once a file is within a directory, it's automatically listed under the corresponding section

* the order of pages in a section is determined by the 'weight' parameter, which is stored in each page metadata (Front Matter.) Remember, lower weight == higher priority

* If there's a page you don't want to publish online, you can set ```'draft: true'``` in the page metadata

* To add a new section (directory,) you have to add it to the sidebar menu in the site project's config.toml.
  Currently, this is a site-wide file located at the docs.getcloudify.org-site repo, and cannot be configured per version. -->

# Link to latest 

To create a link that will always direct to the latest version of the docs use 'latest/' syntax:
```
[I'm a link](http://docs.cloudify.co/latest)
```
Will direct to `http://docs.getcloudify.org/LATEST_VERSION_NUMBER`

check it out: [I'm a link](http://docs.getcloudify.org/latest)

# Markdown

## Page variables

You can add custom variables to the page metadata and use these variables within the page.

Example:

page metadata (Front Matter):
```yaml
---
title: my page

favorite_food: icecream
---
```

page content:
```markdown
I love {{< field "favorite_food" >}}!
```

## Links to internal pages

To add a link to another page in the docs:
```markdown
[some text]({{< relref "path/to/page.md" >}})
```
where path/to/page.md is relative to the /content dir

## Adding an image

1. Copy the image to /static/images/some/path/img.png
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