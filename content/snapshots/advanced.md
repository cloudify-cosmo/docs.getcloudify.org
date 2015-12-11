---
layout: bt_wiki
title: Advanced Topics
category: snapshots
publish: true
weight: 202
---

## Clearing Manager manually

If you want to clear the Manager before restoring a snapshot, remove as much as possible using CLI: deployments, blueprints and plugins.
In order to remove more data, you will need to operate on ElasticSearch data directly, executing the following code on the Manager for example:

{{< gsHighlight python >}}
import elasticsearch
import elasticsearch.helpers

es_client = elasticsearch.Elasticsearch(hosts=[{'host': 'localhost', 'port': 9200}])

def gen_entities_to_delete():
    for doc in elasticsearch.helpers.scan(es_client):
        if doc['_type'] not in ('provider_context', 'snapshot'):
            doc['_op_type'] = 'delete'
            yield doc

elasticsearch.helpers.bulk(es_client, gen_entities_to_delete())
{{< /gsHighlight >}}
