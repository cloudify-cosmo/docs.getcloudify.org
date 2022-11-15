#!/bin/bash

STAGE_BRANCH=$1
STAGE_REPOSITORY="cloudify-stage"
DOCS_REPOSITORY="docs.getcloudify.org"
UI_COMPONENTS_PACKAGE_NAME="cloudify-ui-components"
UI_COMPONENTS_LINK_PARAM="ui_components_link"
STAGE_FILENAME="package-lock.json"
STAGE_FILE_URL="https://raw.githubusercontent.com/cloudify-cosmo/cloudify-stage/${STAGE_BRANCH}/${STAGE_FILENAME}"
WIDGETS_COMPONENTS_PATH="content/developer/writing_widgets/widgets-components.md"

wget ${STAGE_FILE_URL} -O ${STAGE_FILENAME}
VERSION_IN_STAGE=$(cat ${STAGE_FILENAME} | grep -Pzo ".*\"${UI_COMPONENTS_PACKAGE_NAME}\".*\n.*version.*" | sed 's/.*version": "\(.*\)",/\1/' | tail -1)
VERSION_IN_DOCS=$(cat ${WIDGETS_COMPONENTS_PATH} | grep ${UI_COMPONENTS_LINK_PARAM}: | sed 's/.*ui-components\/\(.*\)"/\1/')

echo "Checking version of ${UI_COMPONENTS_PACKAGE_NAME} package in official Cloudify documentation ..."
if [ "$VERSION_IN_DOCS" == "$VERSION_IN_STAGE" ]; then
  echo "Version of ${UI_COMPONENTS_PACKAGE_NAME} is in sync with ${STAGE_REPOSITORY}."
else
  echo "Version of ${UI_COMPONENTS_PACKAGE_NAME} is not in sync with ${STAGE_REPOSITORY}."
  echo "- in ${STAGE_REPOSITORY}: '${VERSION_IN_STAGE}'"
  echo "- in ${DOCS_REPOSITORY}: '${VERSION_IN_DOCS}'"
  echo "Please update ${UI_COMPONENTS_LINK_PARAM} in ${WIDGETS_COMPONENTS_PATH} file."
  exit 1
fi
