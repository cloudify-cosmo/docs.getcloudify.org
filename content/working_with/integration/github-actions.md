+++
title = "GitHub Actions"
description = "Introduction to Cloudify's GitHub Actions"
weight = 25
alwaysopen = false
+++

Cloudify offers a variety of GitHub Actions, providing seamless integration with Cloudify Manager.

You can list all Cloudify-provided GitHub Actions in the GitHub Marketplace:
https://github.com/marketplace?type=actions&query=cloudify

Make sure to read the general [CI/CD Integration](_index.md) documentation for general concepts and terminology.

# Outputs

Each GitHub Action that results in a Cloudify environment to be created, will set the output
`environment-data` to a JSON string containing the environment data, in a structure identical to that
of the "Environment Outputs and Capabilities File" (see [CI/CD Integration](_index.md)).
