Cloudify Documentation Center
=============================

The Cloudify Documentation Center is built with [Hugo]( https://gohugo.io/ ) and is based on the [DocDock]( https://github.com/vjeantet/hugo-theme-docdock.git ) theme.

You can see it available in the [Cloudify Documentation Center](https://docs.cloudify.co/).

[![CircleCI](https://circleci.com/gh/cloudify-cosmo/cloudify-rest-docs/tree/master.svg?style=shield)](https://circleci.com/gh/cloudify-cosmo/cloudify-rest-docs/tree/master)

# Installing the Cloudify Documentation Center

The Cloudify Documentation Center is built with [Hugo]( https://gohugo.io/ ) and is based on the [DocDock]( https://github.com/vjeantet/hugo-theme-docdock.git ) theme.

## Development with Docker

There's several public Docker images shipping Hugo. For development,
`klakegg/hugo` is the most up-to-date one
With it, mount the source code in `/src`, and the `hugo server` command will
run a HTTP server on port 1313.

1. Go to the main directory of this repo
1. `docker run -it --rm -v $(pwd):/src -p 1313:1313 klakegg/hugo server`
1. Go to `http://localhost:1313` in your browser

### Faster iteration

Loading the search index takes a long time when refreshing the site in your
browser. You can skip generating the index, which will make the browser-based
documentation MUCH faster, but search will be unavailable.

To do so:
1. Edit `config.toml`
1. Change `outputs.home` to be just `["HTML", "RSS"]` (without `"JSON"`)

## Development with local Hugo
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

# Content organization

Articles are organized in directories that present the articles in a heirarchy in the site sidebar. When you add a file to a directory, it is automatically listed in that section in the sidebar.

The metadata (front matter) of a page is used to:

* Order the articles in a section by the 'weight' parameter (Remember, lower weight = higher priority
* Mark articles as `draft: true` so that they are not published

To add a new section in the sidebar, you must add a directory and add an `_index.md` file in that directory. The content of the _index.md file is shown when you click on the category in the sidebar, and the `weight` of the _index.md file determines the order in which the category is listed in the sidebar.

# Link to latest 

To create a link that will always direct to the latest version of the docs use 'latest/' syntax:
```
[Latest home page](http://docs.cloudify.co/latest)
```
Goes to: `http://docs.cloudify.co/<latest_version_number>`

For example: [Latest home page](http://docs.cloudify.co/latest)

# Markdown

For more information about markdown syntax, see the [cheatsheet](http://docs.cloudify.co/latest/cheatsheet).
