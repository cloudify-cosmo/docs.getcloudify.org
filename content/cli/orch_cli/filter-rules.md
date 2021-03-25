---
layout: bt_wiki
title: filter-rules
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/filter-rules/
---

The `cfy <resource> filters` command is used to manage Cloudify resource's filters.
A filter is defined as a set of filter-rules that can be used to filter a list of objects, based on their labels and certain attributes.

Labels' filter-rules can be of the following forms:

* `x=y`: All objects with the label `x:y`. 

* `x=[y,z]`: All objects with the label `x:y or x:z`.

* `x!=y`: All objects with the label `x:<any value other than y>`.  

* `x!=[y,z]`: All objects with the label `x:<any value other than y and z>`.

* `x is null`: All objects that don’t have the label `x:<any value>`.

* `x is not null`: All objects that have the label `x:<any value>`.


Attributes' filter-rules can be of the following forms:

* `x=y`: All objects that their attribute `x` is `y`. 

* `x=[y,z]`: All objects that their attribute `x` is one of `y` or `z`. 

* `x!=y`: All objects that their attribute `x` is not `y`. 

* `x!=[y,z]`: All objects that their attribute `x` is not one of `y` or `z`. 

* `x contains y`: All objects that their attribute `x` contains `y`.

* `x contains [y, z]`: All objects that their attribute `x` contains `y` or `z`.

* `x does-not-contain y`: All objects that their attribute `x` does not contain `y`.

* `x does-not-contain [y, z]`: All objects that their attribute `x` does not contain `y` or `z`.

* `x starts-with y`: All objects that their attribute `x` starts with `y`.

* `x starts-with [y,z]`: All objects that their attribute `x` starts with `y` or `z`.

* `x ends-with y`: All objects that their attribute `x ends with y`. 

* `x ends-with [y, z]`: All objects that their attribute `x` ends with `y` or `z`.

* `x is not empty`: All objects that their attribute `x` is not empty. “empty” means either of null, an empty string, an empty list, or an empty dictionary. 
