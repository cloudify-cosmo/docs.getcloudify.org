---
layout: bt_wiki
title: Import Resolver
category: Blueprints
draft: false
weight: 1700

---

An import resolver can be used to resolve imports during blueprint parsing.

The Cloudify parser can accept different resolver implementations. You can use use the Cloudify default import resolver or specify a new implementation that inherits from [AbstractImportResolver](https://github.com/cloudify-cosmo/cloudify-dsl-parser/blob/4.3/dsl_parser/import_resolver/abstract_import_resolver.py#L31)
class and implements:

* resolve(import_url) - returns the content of the resolved import URL.
	* This method is called by the fetch_import method (implemented by the [AbstractImportResolver](https://github.com/cloudify-cosmo/cloudify-dsl-parser/blob/4.3/dsl_parser/import_resolver/abstract_import_resolver.py#L31)
	class) during the imports parsing process, on each import URL that starts with `http`, `https` or `ftp`.

# The default import resolver

[The default import resolver](https://github.com/cloudify-cosmo/cloudify-dsl-parser/blob/4.3/dsl_parser/import_resolver/default_import_resolver.py#L28)
is a default implementation of an import resolver.

<br>This resolver starts with the ``rules`` parameter that you can also use to replace the import URL prefix with another prefix and resolve the new URL (with the altered prefix).

Each rule in the ``rules`` list is expected to be a dictionary with one (key, value) pair. Each rule represents a prefix and its replacement that you can use.

The resolver looks at the rules to find a matching rule. For each matching rule, the resolver replaces the prefix denoted by the rule key with the rule value. The resolver attempts to resolve the new URL. If it successfully resolves, the resolver returns the content of the resolved URL. If it fails to resolve, it tries the next rule.

If there are no rules, no matching rules or none of the prefix replacements resolve, the resolver uses the original URL.

For example:

The rules list:

	[
		{'http://prefix1': 'http://prefix1_replacement'},
    	{'http://prefix2': 'http://prefix2_replacement1'},
    	{'http://prefix2': 'http://prefix2_replacement2'}
	]

contains three rules that can be used to replace URL's prefix that starts with `http://prefix1` and `http://prefix2`.
<br>If the URL is `http://prefix2.suffix2.org` than the resolve method will find a match in both the second and the third rules.

It will first try to apply the second rule by replacing the URL's prefix with the second rule value (`http://prefix2_replacement1`)
and will try to resolve the new URL: `http://prefix2_replacement1.suffix2.org`.

In case this URL cannot be resolved, it will try to apply the third rule by replacing the URL's prefix with the third rule value
(`http://prefix2_replacement2`) and will try to resolve the URL: `http://prefix2_replacement2.suffix2.org`.

If this URL, also, cannot be resolved, it will try to resolve the original URL, i.e. `http://prefix2.suffix2.org`
In case that all the resolve attempts will fail, a `DSLParsingLogicException` will be raise.

## Configuring custom rules for the default resolver

If the default resolver is used and a set of rules differnet from the [default ones](https://github.com/cloudify-cosmo/cloudify-dsl-parser/blob/master/dsl_parser/import_resolver/default_import_resolver.py#L20) is desired, it can be configured as follows:
{{< gsHighlight  yaml  >}}
node_templates
  ...
  manager:
    properties:
      cloudify:
        ...
        import_resolver:
          implementation: dsl_parser.import_resolver.default_import_resolver:DefaultImportResolver
          parameters:
            rules:
              - prefix1: substitution1
              - prefix2: substitution2
              - prefix3: substitution3
{{< /gsHighlight >}}

# Use an import resolver in local workflows

An import resolver can be used to resolve blueprints imports during local workflows such as:
<br>`cfy blueprints validate` -  use an import resolver to resolver the imports of the blueprint to validate.
<br>`cfy local init` - use an import resolver to resolver the imports of the blueprint to init with.

# Declaration in the Cloudify configuration file

To declare a custom import resolver or customize the rules of the default import resolver, the resolver configuration section must be added to the Cloudify configuration file:

- run the `cfy init` command - This will create a folder in the current directory named `.cloudify` and a configuration file named `config.yaml` under it.
- add the `import_resolver` section to the `config.yaml` file.

Here is an example of a `config.yaml` file that includes a custom import resovler configuration section:
{{< gsHighlight  yaml  >}}
colors: false

logging:

  # path to a file where cli logs will be saved.
  filename: /tmp/cloudify-yael/cloudify-cli.log

  # configuring level per logger
  loggers:

    # main logger of the cli. provides basic descriptions for executed operations.
    cloudify.cli.main: info

    # rest client http logs, including headers.
    cloudify.rest_client.http: info

import_resolver:
    implementation: my_module.my_custom_resolver:MyCustomImportResolver
    parameters:
        param1: value1
        param2: value2
{{< /gsHighlight >}}
