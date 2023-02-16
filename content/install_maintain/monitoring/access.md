+++
title = "Accessing Prometheus"
description = "Details on accessing Status Reporter's Prometheus"
weight = 30
alwaysopen = false
+++

{{< param product_name >}}'s Status Reporter comes with Prometheus at its core.  It might be
sometimes desirable to access it directly.  This is a description of a few ways that might be
achieved.

{{% note title="Note" %}}
{{< param product_name >}}'s installation of Prometheus comes with additional **`monitoring/`
prefix to all paths**.  For example a query endpoint is not located at `/api/v1/query` but
`/monitoring/api/v1/query` etc.
{{% /note %}}


# On the localhost

Prometheus is configured to listen on lo (localhost, 127.0.0.1) interface, on port 9090.  To access
it, it is necessary to obtain a SSH access to the machine it is running on (look
[here]({{< relref "/install_maintain/installation/installing-external-db-and-queue-cluster.md" >}})
for details).

Below is the example of using `curl` to query all `up` metrics:

{{< highlight bash >}}
curl "http://localhost:9090/monitoring/api/v1/query?query=up"
{{< /highlight >}}

To see the output nicely formatted and paginated consider using similarly pipe-d commands:

{{< highlight bash >}}
curl "http://localhost:9090/monitoring/api/v1/query?query=up" | python -m json.tool | less
{{< /highlight >}}


# External access on port 8009

Nginx HTTP reverse proxy, bundled with _Status Reporter_, listens on the port 8009 for incoming
HTTPS requests and forwards them directly to Prometheus (running on the same node).  The endpoint
requires authentication which is configured in {{< param product_name >}}'s `config.yaml` in the
`prometheus.credentials` path.

Below is the example of using `curl` to query all `up` metrics:

{{< highlight bash >}}
curl \
--cacert /etc/cloudify/ssl/monitoring_ca_cert.pem \
--user a_user:a_password \
"https://172.20.0.3:8009/monitoring/api/v1/query?query=up"
{{< /highlight >}}

Since the port is opened to the external traffic, it is possible to access Prometheus's UI from the
web browser.  Just point it to `https://{PUBLIC_IP}:8009/monitoring/graph`.

This is the access used to build-up Prometheus federation, i.e. any Prometheus will try talking to
other instances on that exact port, using the same HTTPS protocol and the same credentials as
mentioned above.

# External access with {{< param product_name >}}'s authentication

Since {{< param product_name >}} version 7.0.0 it is possible to access Prometheus using native
authentication mechanisms – [tokens]({{< relref "/cli/orch_cli/tokens.md">}}).  Tokens are passed
as HTTP cookies named `XSRF-TOKEN`.

Below is an example of setting up and using this method with `curl`, but the same mechanism could be
used to set up data sources in Grafana dashboards.

First a token should be created, here with an expiry date:

{{< highlight bash >}}
cfy token create --expiry +1h
{{< /highlight >}}

Then the token might be used like that:

{{< highlight bash >}}
curl \
--cacert /etc/cloudify/ssl/cloudify_internal_ca_cert.pem \
--cookie "XSRF-TOKEN=ctok-fyzpRL3LHg-3W6IncAVwzldIKAGll0ADNeo1Vpt72Yy5UKwTrwx" \
"https://172.20.0.3/monitoring/api/v1/query?query=up"
{{< /highlight >}}
