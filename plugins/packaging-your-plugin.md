---

title: Packaging Your Plugin


weight: 10050

---

### Creating A Plugin Package

The official Cloudify tool used to create plugin packages is named [Wagon](https://github.com/cloudify-cosmo/wagon). In addition to wheels, plugin packages created by Wagon also contain metadata regarding the plugin such as package name, the distribution the plugin was compiled on (if applicable), plugin package version and more.
The plugin's metadata will be used to determine the compatibility of the plugin with the host it is about to be installed on. Wagon allows creating packages directly from PyPI or using the actual plugin's source code, for example:

```bash
$ wagon create -s cloudify-script-plugin
...

INFO - Creating archive for cloudify-script-plugin...
INFO - Package name: cloudify-script-plugin
INFO - Package version: 1.3
INFO - Downloading Wheels for cloudify-script-plugin...
INFO - Creating tar.gz archive: ./cloudify_script_plugin-1.3-py27-none-linux_x86_64-none-none.wgn...
INFO - Process complete!
...

$ ls -l
total 1.7M
-rw-r--r-- 1 nir0s users 1.7M Jan 18 18:09 cloudify_script_plugin-1.3-py27-none-linux_x86_64-none-none.wgn

...
```

To learn more about how to use wagon, see the [Wagon documentation](https://github.com/cloudify-cosmo/wagon).

After packaging your plugin, you can now [use it](/plugins/using-plugins).