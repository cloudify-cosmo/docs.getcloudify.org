---
title: Cloudify HA configure Load Balancer
description: Guides for HA scenarios
weight: 80
alwaysopen: false
---


## Create VIP for Cloudify HA cluster

1.  Install HAproxy

    ```
    sudo yum install haproxy
    ```
1.  Make folder: `/etc/haproxy/certs.d/`
1.  Creating a Combined PEM SSL Certificate/Key File

    ```
    cat example.com.crt example.com.key >/etc/haproxy/certs.d/example.com.pem
    ```
1.  Configure `/etc/haproxy/haproxy.cfg`

    Obtain the base64 representation for the authorization header:
    ```
     echo -n "admin:admin" | base64
    ```
    Example for SSL REST:
    ```
     frontend https_front
        bind *:443 ssl crt /etc/haproxy/certs.d/second_all.pem no-sslv3
        option http-server-close
        option forwardfor
        reqadd X-Forwarded-Proto:\ https
        reqadd X-Forwarded-Port:\ 443

        # set HTTP Strict Transport Security (HTST) header
        rspadd  Strict-Transport-Security:\ max-age=15768000
        default_backend https_back

     backend https_back
        balance roundrobin
        option httpchk GET /api/v3.1/status HTTP/1.0\r\nAuthorization:\ Basic\ YWRtaW46YWRtaW4=
        http-check expect status 200
        server server_name_1 10.1.1.41:443 check ssl verify none
        server server_name_2 10.1.1.42:443 check ssl verify none
    ```
    Example for non-SSL REST:

    ```
     frontend http_front
        bind *:80
        default_backend http_back
 
     backend http_back
        balance roundrobin
        option httpchk GET /api/v3.1/status HTTP/1.0\r\nAuthorization:\ Basic\ YWRtaW46YWRtaW4=
        http-check expect status 200
        server server_name_1 10.1.1.41:80 check
        server server_name_2 10.1.1.42:80 check
    ```
    In this examples, 10.1.1.41 and 10.1.1.42 are the public IP addresses of the Cloudify Manager cluster nodes and "YWRtaW46YWRtaW4=" is the result of the command above.