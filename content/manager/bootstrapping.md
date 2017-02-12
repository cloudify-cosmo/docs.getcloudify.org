---
layout: bt_wiki
title: Installing Cloudify Manager
category: Manager Intro
draft: false
weight: 300
---

Cloudify Manager consists of the Cloudify code and [a number of underlying open-source tools]({{< relref "manager_architecture/components.md" >}}) that have been integrated to create a dynamic environment to support the different operational flows that you might utilize when deploying and managing your application.

Using different Cloudify plugins, the bootstrap process creates the infrastructure (servers, networks, security groups and rules, and so on) that are required to enable the Cloudify Manager to run in a specific environment.

{{% gsNote title="In This Topic" %}}

This topic includes the following key sections:
* Bootstrapping a Cloudify Manager
* Deploying a Cloudify Manager Image
* Deploying a Cloudify Manager Image from the Web Interface
* Deploying a Cloudify Manager Image from the Command

{{% /gsNote %}}

# Cloudify Manager Blueprints

Bootstrapping a Cloudify Manager requires the installation of a blueprint. The blueprint is designed to create the infrastructure for Cloudify Manager, and to deploy its applicative requirements.

By utilizing blueprints, you can design your own Cloudify Managers to provide additional scalability or functionality.

`Manager blueprints` for different IaaS providers are provided by the Cloudify team. The blueprints are located in the [cloudify-manager-blueprints repository](https://github.com/cloudify-cosmo/cloudify-manager-blueprints).

See the YAML files for [Simple Manager Blueprints]({{< relref "manager/simple-manager-blueprint.yaml" >}}) or [Simple Manager Blueprint Inputs]({{< relref "simple-manager-blueprint-inputs.yaml" >}}) for information on the environment specific requirements.

# Bootstrapping a Cloudify Manager
The process of bootstrapping a Cloudify Manager comprises the following tasks, which are described later in this section.

1. Initializing a working directory
2. Preparing the bootstrap configuration.
3. Configuring inputs.
4. Bootstrapping Cloudify Manager.
5. Validating the installation.
6. Deploying a Cloudify Manager image.


## Initializing a Working Directory

Navigate to your preferred directory and initialize it as a Cloudify working directory using this command:

{{< gsHighlight  sh  >}}
$ cfy init
Initialization completed successfully

...
{{< /gsHighlight >}}

A folder named `.cloudify` is created in the current directory .

## Preparing the Bootstrap Configuration

{{% gsNote title="Note" %}}
Verify the [prerequisites]({{< relref "manager/prerequisites.md" >}}) before bootstrapping.
{{% /gsNote %}}

If you installed Cloudify using one of the premade packages, the manager blueprints should already be available to you.

* On Linux under /opt/cfy/cloudify-manager-blueprints
* On Windows under c:\Program Files (x86)\Cloudify\cloudify-manager-blueprints-commercial

If you didn't install using premade packages, download and extract the [cloudify-manager-blueprints](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/archive/3.4.zip) repository from GitHub.

#####Windows#####
Download and extract the archive.

#####Linux or OSX#####

{{< gsHighlight  bash  >}}
$ mkdir -p ~/cloudify-manager
$ cd ~/cloudify-manager
$ curl -L https://github.com/cloudify-cosmo/cloudify-manager-blueprints/archive/3.4.tar.gz -o cloudify-manager-blueprints.tar.gz
$ tar -xzvf cloudify-manager-blueprints.tar.gz
$ cd cloudify-manager-blueprints-3.4
$ ls -l
...

-rw-r--r--  aws-ec2-manager-blueprint-inputs.yaml
-rw-r--r--  aws-ec2-manager-blueprint.yaml
-rw-r--r--  openstack-manager-blueprint-inputs.yaml
-rw-r--r--  openstack-manager-blueprint.yaml
-rw-r--r--  simple-manager-blueprint-inputs.yaml
-rw-r--r--  simple-manager-blueprint.yaml
-rw-r--r--  vcloud-manager-blueprint-inputs.yaml
-rw-r--r--  vcloud-manager-blueprint.yaml
-rw-r--r--  vsphere-manager-blueprint-inputs.yaml
-rw-r--r--  vsphere-manager-blueprint.yaml
...

{{< /gsHighlight >}}

Note that there are Cloudify Manager blueprints for different environments. Each of these blueprints provision resources (such as a VM, security groups, IP addresses, and so on) that are required for the Cloudify Manager to run, and install the different components on the VM.

##Configuring Inputs##

Each manager blueprint has an `inputs.yaml` file associated with it. That inputs file is the configuration for the environment the manager should be bootstrapped on and general configuration for the manager itself.

While defaults are provided for most inputs, some inputs are required since they relate to your specific provider's account like credentials for example.

The inputs file contains a description of each input. You should modify the inputs file to contain the relevant information for your environment.

For example, for AWS:
```
{{< gsHighlight yaml >}}

# Credentials and identification in order to connect to ec2
aws_access_key_id: my_access_key_id
aws_secret_access_key: my_secret_access_key

# This is the Amazon AMI that you will run and install the manager components on.
# The default value is matched to the default instance_type and ec2_region_name.
# This may also vary by account.
image_id: 'ami-61bbf104'

# This is the Amazon instance type.
# The default value is matched to the default image_id and ec2_region_name.
# This may also vary by account.
instance_type: 'm4.xlarge'

...
{{< /gsHighlight >}}```

After providing all required inputs, you can now go on to bootstrap your manager.

###Bootstrap Validation###

During the first steps of the bootstrap process, some validations occur. By default, if any validations fail the bootstrap process also fails. The process validates items such as the volume of physical memory and disk space available on the host, the download vailability of the resources required for the bootstrap process , that supported OS distributions are being used for the Cloudify Manager host, and so on.

To override validation preferences, see the `Bootstrap Validations` section in the `inputs.yaml` file corresponding with the selected Cloudify Manager blueprint.

{{% gsNote title="Note" %}}
Although validations can be ignored or have their defaults changed, it is not a recommended practice, unless there is a good reason to do so.
{{% /gsNote %}}


###Offline Environment###

To bootstrap a Cloudify Manager instance in an environment without an internet connenction, you must download the Cloudify Manager resources package and store it on a fileserver that is accessible by the Cloudify Manager VM. The URL for the Cloudify Manager resources package is located in the Cloudify Manager blueprint inputs file:

{{< gsHighlight yaml >}}
...

#############################
# Manager Resources Package
#############################
#manager_resources_package: http://repository.cloudifysource.org/org/cloudify3/3.4.0/ga-RELEASE/cloudify-manager-resources_3.4.0-ga-b400.tar.gz

...
{{< /gsHighlight >}}

After downloading the manager resources package, and placing it in an accessible fileserver, change its URL in the inputs file to point to the accessible location, for example:

{{< gsHighlight yaml >}}
#############################
# Manager Resources Package
#############################
manager_resources_package: http://my-fileserver:8080/cloudify-manager-resources_3.4.0-ga-b400.tar.gz
{{< /gsHighlight >}}


##Bootstrapping Cloudify Manager

To bootstrap Cloudify Manager, run the `cfy bootstrap` command, pointing it to the Cloudify Manager blueprint file and the inputs YAML file, as follows:

{{< gsHighlight  sh  >}}
$ cfy bootstrap --install-plugins -p /path/to/manager/blueprint/file -i /path/to/inputs/yaml/file
...

{{< /gsHighlight >}}

Depending on the cloud environment and the server specifications you provided, this process takes between 10 to 20 minutes to complete.
After validating the configuration, `cfy` creates the management VM and related networks and security groups, downloads the relevant packages and installs all of the components.
When the process is completed successfully, the following message is displayed:

{{< gsHighlight  bash  >}}
...

bootstrapping complete
management server is up at <_YOUR MANAGER IP ADDRESS_>

...
{{< /gsHighlight >}}


##Validating the Installation##
To validate the installation, point your Web browser to the Cloudify Manager IP address (port 80). <br>
The Cloudify Web user interface is displayed. There is little to see in the interface because no Blueprints are currently uploaded.

With the process completed, you have an operational Cloudify Manager on the specified provider. You can verify this by making a *status* call.

An example output:

{{< gsHighlight  sh  >}}
$ cfy status
...

Getting management services status... [ip=46.137.95.124]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| InfluxDB                       | running |
| Celery Management              | running |
| Logstash                       | running |
| RabbitMQ                       | running |
| AMQP InfluxDB                  | running |
| Manager Rest-Service           | running |
| Cloudify UI                    | running |
| Webserver                      | running |
| Riemann                        | running |
| Elasticsearch                  | running |
+--------------------------------+---------+

...
{{< /gsHighlight >}}


##Deploying a Cloudify Manager Image##

Images are provided with all dependencies, and Cloudify Manager is pre-installed for AWS and OpenStack, to enable you to get up and running with Cloudify with minimal user input.

The images make logical assumptions about how Cloudify Manager is set up. If you want a high level of control over the Cloudify Manager setup, refer to the [AWS](/manager/bootstrap-ref-aws) or [OpenStack](/manager/bootstrap-reference-openstack) bootstrapping guides instead.

#####Prerequisites#####
 * Account credentials for the platform on which you are deploying
 * For command-line installation, the [`cfy` command](/intro/installation)



#####Running Cloudify Manager Using an Image#####

 1. Download the image that corresponds with your operating system from the [downloads page](http://getcloudify.org/downloads/get_cloudify.html)

    If you are using AWS, you can use the public AMI provided through the link above, skip to <a href='#create-instance'>creating an instance</a>.

 2. Upload the file to your cloud environment as an image.

    [Openstack image upload instructions](http://docs.openstack.org/user-guide/dashboard_manage_images.html)

 3. <span id='create-instance'>Create an instance</span> based on the image you uploaded.

    Make sure you enable inbound traffic from your security settings in the instance's security group. Port `22` is required for `SSH` access, and ports `80` and `443` are required for HTTP(S) access.

 4. Note the IP/hostname

{{< gsHighlight  sh  >}}
    $ CLOUDIFY_HOST={your-manager-public-ip}
{{< /gsHighlight >}}


##Deploying a Cloudify Manager Image from the Web Interface##
 1. In your browser, navigate to http://{_your-manager-public-ip_}

    The Cloudify Manager VM might take some time to start.

    If security is enabled, your browser will prompt you that the TLS/SSL certificate is not valid. Temporarily allow the connection. A new certificate is generated as part of this setup process.

 2. If prompted, authenticate using `cloudify` as both the username and password.

 3. Create a new deployment of the `CloudifySettings` blueprint:
    ![CloudifySettings blueprint deploy]({{< img "manager/image-deploy-new-deployment.png" >}})

 4. Complete the input fields.<br>
    To make a quick start, if no-one in your environment is testing Cloudify Managers, you only need to complete the blank fields.<br>
    The blank fields represent the platform credentials or access keys and the `user_ssh_key`, which can be set to "no key provided" if you already have access to the VM. (Otherwise, see the details for that setting below).

    If you are using a secured Cloudify Manager you must enter a username and password to log into Cloudify Manager and, at least, the Cloudify Manager public IP address in `manager_names_and_ips`. If you are not  accessing Cloudify Manager directly, you can enter only `localhost` in `broker_names_and_ips`, (e.g. for monitoring).

    <table>
        <thead>
            <th> Parameter                             </th>
            <th> Notes </th>
        </thead>
        <tr>
            <td> user_ssh_key                     </td>
            <td> The key is added to ~/.ssh/authorized_keys, in addition to any key you specified when initializing the instance. This enables you to connect to Cloudify Manager using SSH, even if the platform you are using does not support adding SSH keys when creating instances. <br>The value should be your actual public key, for example "ssh-rsa AAAAA<...snip...>mTgG user@example". <br>The key can be generally be retrieved on Mac or Linux operating systems by opening the ~/.ssh/id_rsa.pub file in a text editor. If you do not want to use this key, you can enter "no key provided". The username used to connect via SSH to Cloudify Manager will probably be "centos", if you are using an official Cloudify image. </td>
        </tr>
            <th colspan=2> AWS Only</th>
        </tr>
        <tr>
            <td> aws_access_key                   </td>
            <td> Access key to use when accessing the AWS API. </td>
        </tr>
        <tr>
            <td> aws_secret_key                   </td>
            <td> Secret key to use when accessing the AWS API. </td>
        </tr>
        <tr>
            <td> agents_security_group_name       </td>
            <td> Security group to be generated and used for accessing agents on VMs. <br>The value must not already exist because the `install` workflow creates a new one. You only need change the value if you are in a shared environment in which other instances of Cloudify Manager might be deployed. </td>
        </tr>
        <tr>
            <td> agents_keypair_name              </td>
            <td> Keypair to be generated and used for accessing agents on VMs. <br>The value must not already exist because the `install` workflow creates a new one. You only need change the value if you are in a shared environment in which other instances of Cloudify Manager might be deployed. </td>
        </tr>
        </tr>
            <th colspan=2> OpenStack Only</th>
        </tr>
        <tr>
            <td> openstack_username               </td>
            <td> Username to use when accessing the Openstack API. </td>
        </tr>
        <tr>
            <td> openstack_password               </td>
            <td> Password to use when accessing the Openstack API. </td>
        </tr>
        <tr>
            <td> openstack_auth_url               </td>
            <td> Authentication URL to use when accessing the Openstack API.  e.g. http://myopenstack:5000/. </td>
        </tr>
        <tr>
            <td> openstack_tenant_name            </td>
            <td> Tenant name to use when accessing the Openstack API. </td>
        </tr>
        <tr>
            <td> openstack_region                 </td>
            <td> Region to use when accessing the Openstack API. </td>
        </tr>
        </tr>
            <th colspan=2>Secure Builds Only</th>
        </tr>
        <tr>
            <td> manager_names_and_ips            </td>
            <td> These names & IPs are added to the newly-generated SSL certificate that Cloudify Manager uses. (Comma-separated)<br>
            Include the manager's public IP, and any DNS names you want to assign to Cloudify Manager (comma separated). Internal IPs on your platform are added automatically.  e.g. 192.0.2.54,mycloudify.example.com,mycloudify.dev.example.com,192.0.2.100 </td>
        </tr>
        <tr>
            <td> broker_names_and_ips             </td>
            <td> As above, but for the broker (RabbitMQ) SSL certificate. Both inputs are usually the same. </td>
        </tr>
        <tr>
            <td> new_manager_username             </td>
            <td> New username for Cloudify Manager. </td>
        </tr>
        <tr>
            <td> new_manager_password             </td>
            <td> New password for Cloudify Manager. </td>
        </tr>
        <tr>
            <td> new_broker_username              </td>
            <td> New username for the message broker. </td>
        </tr>
        <tr>
            <td> new_broker_password              </td>
            <td> New password for the message broker. </td>
        </tr>
        </tr>
            <th colspan=2>Advanced Options</th>
        </tr>
        <tr>
            <td> agents_user                      </td>
            <td> User to be used for accessing agents on VMs. The value should be `centos`. </td>
        </tr>
        <tr>
            <td> agents_to_manager_inbound_ports  </td>
            <td> Comma-separated list of TCP ports to open from the agents to the manager. The list should include at least: "5671,5672,8101,53229". It is unlikely that you will need to change this from the default. </td>
        </tr>
        </tbody>
    </table>

 5. Following completion of the deployment inputs, execute the `install` workflow, as follows:
    ![CloudifySettings deployment: install workflow]({{< img "manager/image-deploy-run-install.png" >}})

    The `install` workflow takes a few minutes to run.

    If you have selected a security-enabled build, the Web interface will become unresponsive because several services must be restarted. Depending on your Web browser, it might be necessary to refresh the entire page. You must also accept a new self-signed certificate, because the certificate is regenerated as part of the `CloudifySettings` blueprint.
    After the certificate has been regenerated and you have successfully connected to Cloudify Manager again, setup is complete.


##Deploying a Cloudify Manager Image from the Command Line##

 1. Switch to the new Cloudify Manager:

    ```bash
    $ export CLOUDIFY_USERNAME=cloudify
    $ export CLOUDIFY_PASSWORD=cloudify
    $ export CLOUDIFY_SSL_TRUST_ALL=true
    $ cfy use --port 443 --management-ip ${CLOUDIFY_HOST}
    ```

    If you selected one of the `-insecure` master images, use port 80 (the default) instead. (In this case, the `export` lines in the code are not required): `$ cfy use --management-ip ${CLOUDIFY_HOST}`.


 2. Create an input file for the `CloudifySettings` blueprint.

    ```bash
    $ echo >install.yaml <<EOF
    {
      "aws_access_key": "{the access key}",
      "aws_secret_key": "{the secret key}",
      "agents_security_group_name": "{the relevant group}",
      "user_ssh_key": "{the SSH key}",
      "agents_user": "centos",
      "agents_keypair_name": "{the relevant keypair name}",
      "new_manager_username": "cloudify",
      "new_broker_password": "{a secure password for RabbitMQ}",
      "broker_names_and_ips": "localhost",
      "new_broker_username": "cloudify",
      "manager_names_and_ips": "${CLOUDIFY_HOST}",
      "new_manager_password": "{a password for Cloudify Manager}"
    }
    EOF
    ```
 2. Create the deployment.<br>
    ```bash
    $ cfy deployments create --deployment-id CloudifySettings --blueprint-id CloudifySettings --inputs install.yaml
    ```
 3. Start the `install` workflow.
    ```bash
    $ cfy executions start --deployment-id install --workflow install
    ```

 4. Save the TLS certificate for future use with `cfy`.

    ```bash
    # Stop trusting all:
    $ unset CLOUDIFY_SSL_TRUST_ALL

    $ export CLOUDIFY_SSL_CERT=${CLOUDIFY_HOST}.cert
    # echo stops openssl getting stuck | download the certificate       | pipe it to sed to grab just the certificate from the output             >pipe to file
    $ echo | openssl s_client -connect ${CLOUDIFY_HOST}:443 2>/dev/null | sed -n '/^-----BEGIN CERTIFICATE-----$/,/^-----END CERTIFICATE-----$/p' >${CLOUDIFY_SSL_CERT}
    ```


#Next Steps

Now that you have an instance of Cloudify Manager running, you can [upload your blueprint]({{< relref "manager/upload-blueprint.md" >}}).
