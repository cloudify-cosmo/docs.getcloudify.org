# docs.getcloudify.org

<!-- [![Circle CI](https://circleci.com/gh/cloudify-cosmo/docs.getcloudify.org/tree/3.4.0-build.svg?style=shield)](https://circleci.com/gh/cloudify-cosmo/docs.getcloudify.org/tree/3.5.0-build) -->

# Installing the Cloudify Documentation Center

The Cloudify Documentation Center is built with [Hugo]( https://gohugo.io/ ) and is based on the [DocDock]( https://github.com/vjeantet/hugo-theme-docdock.git ) theme.

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
1. Start the hugo web server: `hugo server`

To access the site, go to: http://localhost:1313

# Staging

Version branches, for example 4.3.0-build, are automatically built to https://docs.cloudify.co.

When you commit a change to any other branch, the site is built to the staging directory  so you can preview and share your changes before publishing them in the official public documentation.

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
[Latest home page](http://docs.cloudify.co/latest)
```
Will direct to `http://docs.getcloudify.org/LATEST_VERSION_NUMBER`

For example: [Latest home page](http://docs.cloudify.co/latest)

# Markdown

For more information about markdown syntax, see the [cheatsheet](http://docs.cloudify.co/latest/cheatsheet).