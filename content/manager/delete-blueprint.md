---

title: Deleting a Blueprint


weight: 800
---

At some point, you might want to delete a blueprint you previously uploaded. Deleting blueprints, is much like deleting a deployment, non-functional. Deleting a blueprint will remove its model from the database and delete its resources from the fileserver.

To delete a blueprint execute:

{{< gsHighlight  bash >}}
cfy blueprints delete -b nodecellar
{{< /gsHighlight >}}

# What's Next

Next, you can [tear down the Manager]({{< relref "manager/teardown.md" >}}).
