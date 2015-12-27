# docs.getcloudify.org

* Master [![Circle CI](https://circleci.com/gh/cloudify-cosmo/docs.getcloudify.org/tree/master.svg?style=shield)](https://circleci.com/gh/cloudify-cosmo/docs.getcloudify.org/tree/master)

documentation web site for cloudify 3.3


IMPORTANT! - We are using Hugo 0.14! Otherwise it won't work.


how to contribute?
===================


to run this project you need to make sure the following is installed:
 - [nodejs](https://nodejs.org/) - version 0.10 and above is fine
 - [grunt](http://gruntjs.com/) - `sudo npm install -g grunt-cli`
 - [bower](http://bower.io/) - `sudo npm install -g bower`
 - [gohugo](https://github.com/spf13/hugo/releases) - version 0.14!
 - clone this repository (the content repository)
 - clone [docs.getcloudify.org-site repository](https://github.com/cloudify-cosmo/docs.getcloudify.org-site) (the framework around the content)


now do the following steps:
 - create a configuration file under `docs.getcloudify.org-site/dev/config.json`
   - alternatively, you can write the file wherever you want and export CONFIG_JSON variable that will point to its location
 - go to root of `docs.getcloudify.org-site` and run:
   - `bower cache clean && bower install`
   - `sudo npm cache clean && npm install` (first command as sudo and second not)

the config file looks like this:

```
{
    "content" :
    {
        "root" : "/full/path/to/content/clone/root/folder"
    }
}
```


and you're done. these things should be done only on the first time you setup your environment.

from time to time, you might need to run the `bower` and `npm` commands again in case the framework has changed.
if you get errors in the next step, running these commands and try again.

now, to start writing documentation, every time you will need to
 - go to `docs.getcloudify.org-site` clone and run `grunt server`

from now on, you work on the `docs.getcloudify.org` clone and push/pull changes from there. the framework will auto-sync



