---
layout: bt_wiki
title: DSL Import Resolver
category: Blueprints DSL
publish: true
abstract: "Resolving import URLs"
pageord: 300

---
{{% gsSummary %}}
An import resolver can be used to resolve imports during parsing, when uploading a blueprint.
{{% /gsSummary %}}

# DSL Parser import Resolver

An import resolver can be used to resolve imports during parsing, when uploading a blueprint.

The Cloudify parser can accept different resolver implementations.
It's possible to use Cloudify's default import resolver or to specify a new implementation that inherits from [AbstractImportResolver](https://github.com/cloudify-cosmo/cloudify-dsl-parser/blob/master/dsl_parser/import_resolver/abstract_import_resolver.py#L23)
class and implements:

* resolve(import_url) - returns the data of the resolved import url.
	* This method is called by the fetch_import method (implemented by the [AbstractImportResolver](https://github.com/cloudify-cosmo/cloudify-dsl-parser/blob/master/dsl_parser/import_resolver/abstract_import_resolver.py#L23)
	class) during the imports parsing process, on each import url that starts with `http`, `https` or `ftp`.

## Configuring the resolver in the Manager Blueprint
The resolver configuration is located in the manager blueprint under the cloudify configuration:
{{< gsHighlight  yaml  >}}
node_templates
	...
	manager:
		properties:
			cloudify:
			...
			import_resolver:
				implementation: my_module.my_resolver:MyImportResolver
				parameters:
					param1: value1
					param2: value2
{{< /gsHighlight >}}


implementation - the fully qualified name of the module implementing an import resolver, followed by “:” and the resolver class name
parameters - a dictionary of arguments to instantiate the implemeting class.

## The default import resolver

[The default import resolver](https://github.com/cloudify-cosmo/cloudify-dsl-parser/blob/master/dsl_parser/import_resolver/default_import_resolver.py#L28)
is a default implementation of an import resolver.
This resolver uses the rules to replace URL's prefix with another prefix
and tries to resolve the new URL (after the prefix has been replaced).
If there aren't any rules, none of the rules matches or
none of the prefix replacements works,
the resolver will try to use the original URL.

Each rule in the ``rules`` list is expected to be
a dictionary with one (key, value) pair which represents
a prefix and its replacement which can be used to resolve the import url.

The resolver will go over the rules and for each matching rule
(its key is a prefix of the url) it will replace the prefix
with the value and will try to resolve the new url.

For example:

The rules list:

	[
		{'http://prefix1': 'http://prefix1_replacement'},
    	{'http://prefix2': 'http://prefix2_replacement1'},
    	{'http://prefix2': 'http://prefix2_replacement2'}
	]
contains three rules that can be used for resolve URLs that starts with `http://prefix1` and `http://prefix2`.
<br>If the url is `http://prefix2.suffix2.org` than the resolve method will find a match in both the second and the third rules.

It will first try to apply the second rule by replacing the url's prefix with the second rule value (`http://prefix2_replacement1`)
and will try to resolve the new url: `http://prefix2_replacement1.suffix2.org`.

In case this url cannot be resolved, it will try to apply the third rule by replacing the url's prefix with the third rule value
(`http://prefix2_replacement2`) and will try to resolve the url: `http://prefix2_replacement2.suffix2.org`.

If this url, also, cannot be resolved, it will try to resolve the original url, i.e. `http://prefix2.suffix2.org`
In case that all the resolve attempts will fail, a `DSLParsingLogicException` will be raise.

## Configuring custon rules for the default resolver:
If the default resolver is used and a set of rules differnet from the [default ones](# link to default rules from the DefaultImportResolver) is desired, it can be configured as follows:
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
