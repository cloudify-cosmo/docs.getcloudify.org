. ./env

cfy secrets delete openstack_auth_url >/dev/null 2>&1
cfy secrets create openstack_auth_url -s $OS_AUTH_URL

cfy secrets delete openstack_username >/dev/null 2>&1
cfy secrets create openstack_username -s $OS_USERNAME

cfy secrets delete openstack_password >/dev/null 2>&1
cfy secrets create openstack_password -s $OS_PASSWORD

cfy secrets delete region >/dev/null 2>&1
cfy secrets create region -s $OS_REGION_NAME

cfy secrets delete openstack_tenant_name >/dev/null 2>&1
cfy secrets create openstack_tenant_name -s $OS_TENANT_NAME
