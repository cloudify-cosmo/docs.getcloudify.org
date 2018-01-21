
## Option 1 Installing a Cloudify Manager Image

If you are not bootstrapping Cloudify Manager, you can deploy one of the provided images listed below. Images include pre-installation of all dependencies and of Cloudify Manager. This enables you to get up and running with Cloudify with minimal user input.

* [QCow2-format image](http://repository.cloudifysource.org/cloudify/4.0.1/sp-release/cloudify-manager-premium-4.0.1.qcow2)
* [AWS marketplace image] (http://cloudify.co/thank_you_aws_ent)


Note that if you are starting Cloudify Manager from an image in one of our supported cloud providers, the infrastructure examples enable you to input the image's information. (This is the fastest way to start to a new Cloudify Manager.)


{{% gsNote title="Prerequisites" %}}
 * The Cloudify Manager VM must be accessible through [the ports listed here]({{< relref "manager_architecture/components.md#ports-and-entry-points" >}}).
 {{% /gsNote %}}

#### Process Overview
Getting your Cloudify Manager up and running comprises the following steps:

1. Downloading the Cloudify CLI image.
2. Uploading the image to your Cloud environment.
3. Creating an instance of the Manager.
4. Running Cloudify Manager.
5. Validating the installation.
6. [Installing the required plugins]({{< relref "plugins/using-plugins.md" >}}) for your operating system.
7. [Configuring secrets]({{< relref "manager/using-secrets.md" >}}).


#### Procedure

 1. Download an image from the [downloads page](http://cloudify.co/download/).

 1. Upload the image to your Cloud environment as an image.

 1. Create an instance based on the image you uploaded.

    Make sure you enable inbound traffic from your  security settings in the instance's security group. Port `22` is required for SSH access, and ports `80` and `443` are required for HTTP(S) access.

 1. To use Cloudify Manager from the Cloudify CLI, run the following command.   
    
    {{< gsHighlight  bash  >}}
    $ cfy profiles use <manager-ip> -u admin -p admin -t default_tenant
    {{< /gsHighlight >}}
   
    The default username and password are `admin`/`admin`. 

    Because the `cfy` command is already available and configured, you can navigate to Cloudify Manager using SSH and use the already configured CLI environment.

 1. It is good practice to change the `admin` password as soon as Cloudify is up. Use the following command.   
    {{< gsHighlight  bash  >}}
    cfy users set-password admin -p <new-password>
    {{< /gsHighlight >}}

 1. After you have changed the password, run the following command to update the active CLI profile to use the new password.   
    {{< gsHighlight  bash  >}}
    cfy profiles use <manager-ip> -u admin -p <the-new-password> -t default_tenant
    {{< /gsHighlight >}}

 To access the Cloudify Manager UI, navigate to http://<_manager-ip_>/
 
### What's Next

You can now [upload a plugin]({{< relref "plugins/using-plugins.md" >}}) or [configure secrets]({{< relref "manager/using-secrets.md" >}}).
