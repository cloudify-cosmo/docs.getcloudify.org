---
title: filter-rules
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/filter-rules/
---

A filter is defined as a set of filter-rules that can be used to filter a list of objects, based on their labels and certain attributes.
Filters are currently supported for deployments and blueprints.   
Filtering deployments is supported in the UI, CLI, and API. The allowed deployments' attributes to filter by are: `blueprint_id`, `site_name`, and `created_by`.    
Filtering blueprints is supported only in the CLI and API. The allowed blueprints' attribute to filter by is `created_by`.


<table>
  <thead>
    <th width="20%">UI</th>
    <th width="15%">API</th>
    <th width="15%">CLI</th>
    <th width="50%">Applied logic</th>
  </thead>
  <tbody>
    <tr>
      <td>is one of</td>
      <td>any_of</td>
      <td>=</td>
      <td>The label key matches the specified key and the label value matches one of the specified values.</td>
    </tr>
    <tr>
      <td>is not one of</td>
      <td>not_any_of</td>
      <td>!=</td>
      <td>The label key matches the specified key and the label value does not match any of the specified values.</td>
    </tr>
    <tr>
      <td>is not one of (or no such key)</td>
      <td>is_not</td>
      <td>is-not</td>
      <td>No label key matches the specified key, or the label key matches the specified key and the label value does not match any of the specified values.</td>
    </tr>
    <tr>
      <td>key is not</td>
      <td>is_null</td>
      <td>is null</td>
      <td>No label key matches the specified key.</td>
    </tr>
    <tr>
      <td>key is</td>
      <td>is_not_null</td>
      <td>is not null</td>
      <td>The label key matches the specified key.</td>
    </tr>
  </tbody>
  <caption style="caption-side: bottom; text-align: left"><strong>Table 1.</strong> Labels operators mapping</caption>
</table>


<table>
  <thead>
    <th width="20%">UI</th>
    <th width="15%">API</th>
    <th width="15%">CLI</th>
    <th width="50%">Applied logic</th>
  </thead>
  <tbody>
    <tr>
      <td>is one of</td>
      <td>any_of</td>
      <td>=</td>
      <td>The resource attribute matches one of the specified values.</td>
    </tr>
    <tr>
      <td>is not one of</td>
      <td>not_any_of</td>
      <td>!=</td>
      <td>The resource attribute does not match any of the specified values.</td>
    </tr>
    <tr>
      <td>contains</td>
      <td>contains</td>
      <td>contains</td>
      <td>The resource attribute contains the specified value.</td>
    </tr>
    <tr>
      <td>does not contain</td>
      <td>not_contains</td>
      <td>does-not-contain</td>
      <td>The resource attribute does not contain the specified value.</td>
    </tr>
    <tr>
      <td>starts with</td>
      <td>starts_with</td>
      <td>starts-with</td>
      <td>The resource attribute starts with the specified value.</td>
    </tr>
    <tr>
      <td>ends with</td>
      <td>ends_with</td>
      <td>ends-with</td>
      <td>The resource attribute ends with the specified value.</td>
    </tr>
  </tbody>
  <caption style="caption-side: bottom; text-align: left"><strong>Table 2.</strong> Attributes operators mapping</caption>
</table>
