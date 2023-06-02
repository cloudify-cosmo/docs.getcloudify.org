+++
title = "GitHub Actions"
description = "Introduction to GitHub Actions"
weight = 25
alwaysopen = false
+++

{{< param product_name >}} offers a variety of GitHub Actions, providing seamless integration with the {{< param cfy_manager_name >}}.

You can list all {{< param product_name >}}-provided GitHub Actions in the GitHub Marketplace:
https://github.com/marketplace?type=actions&query=cloudify

Make sure to read the general [CI/CD Integration](..) documentation for general concepts and terminology.

# Outputs

Each GitHub Action that results in a {{< param product_name >}} environment to be created, will set the output
`environment-data` to a JSON string containing the environment data, in a structure identical to that
of the "Environment Outputs and Capabilities File" (see [CI/CD Integration](..)).
