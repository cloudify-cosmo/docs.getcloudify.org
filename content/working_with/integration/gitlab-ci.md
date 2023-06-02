+++
title = "GitLab CI/CD"
description = "Introduction to GitLab CI/CD integration"
weight = 25
alwaysopen = false
+++

{{< param product_name >}} can be used with GitLab CI/CD jobs, using {{< param cfy_manager_name >}}.

Make sure to read the general [CI/CD Integration](..) documentation for general concepts and terminology.

For more information about GitLab CI/CD refer to the [GitLab CI/CD page](https://docs.gitlab.com/ee/ci/).


# Example


```yaml
# .gitlab-ci.yml file
update-aws-deployment:
  rules:
    - changes:
        - inputs/inputs-aws.yaml
  image: cloudifyplatform/cloudify-cli:6.4.0
  variables:
    GIT_CHECKOUT: "true"
    INPUTS_FILE: "inputs/inputs-aws.yaml" # in inputs file from repo
    SKIP_INSTALL: "false"
    SKIP_UNINSTALL: "false"
    SKIP_REINSTALL: "false"
    INSTALL_FIRST: "false"
    OUTPUTS_FILE: "-"
    DELETE_OLD_BLUEPRINT: "false"
    LABELS: "-"
  script: >
    cfyci install-or-update 
    --name $AWS_EAAS_DEPLOYMENT_ID 
    --blueprint-id $EAAS_BLUEPRINT_ID 
    --delete-old-blueprint $DELETE_OLD_BLUEPRINT 
    --inputs-file $INPUTS_FILE 
    --labels $LABELS 
    --skip-install $SKIP_INSTALL 
    --skip-uninstall $SKIP_UNINSTALL 
    --skip-reinstall $SKIP_REINSTALL 
    --install-first $INSTALL_FIRST 
    --outputs-file $OUTPUTS_FILE
  tags:
    - docker
```
Extra variables need to be set:
- AWS_EAAS_DEPLOYMENT_ID
- CLOUDIFY_HOST
- CLOUDIFY_PASSWORD
- CLOUDIFY_SSL
- CLOUDIFY_SSL_TRUST_ALL
- CLOUDIFY_TENANT
- CLOUDIFY_USERNAME
- EAAS_BLUEPRINT_ID
- CLOUDIFY_TOKEN

{{% note title="Note" %}}
to make use of ``CLOUDIFY_TOKEN`` you must not set ``CLOUDIFY_USERNAME`` and ``CLOUDIFY_PASSWORD``
{{% /note %}}

Instructions how to set [GitLab CI/CD variables](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project).