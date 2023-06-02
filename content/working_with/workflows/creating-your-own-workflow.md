---
title: Creating Custom Workflows
category: Workflows
draft: false
abstract: A guide to authoring Workflows
weight: 700
aliases: /workflows/creating-your-own-workflow/
---




{{% note title="Note" %}}
This section is aimed at advanced users. Before reading it, make sure you have a good understanding of Workflows, Blueprints, and Plugins.
{{% /note %}}


# Introduction to Implementing Workflows

Workflows implementation shares several similarities with plugins implementation:

* Workflows are also implemented as Python functions.
* A workflow method is, optionally, decorated with `@workflow`, a decorator from the `cloudify.decorators` module of the `cloudify-plugins-common` package.
* Workflow methods should import `ctx` from `cloudify.workflows`, which offers access to context data and various system services. While sharing some resemblance, this `ctx` object is not of the same type as the one used by a plugin method.

*Example: A typical workflow method's signature*
{{< highlight  python  >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def my_workflow(**kwargs):
    pass
{{< /highlight >}}


Workflow parameters are received by the method as named parameters, and so if a workflow uses parameters they should usually appear in the method signature as well (or they'll end up under `kwargs`).

{{% tip title="Tip" %}}
It's recommended not to have default values for parameters in the workflow method's signature. Instead, the default values should be provided in the workflow's parameters declaration in the blueprint - That way, the parameter and its default value are visible to the user both in the blueprint and via CLI commands, and the user is also able to override the default value by simply editing the blueprint, without modifying code. For more information on workflow parameters declaration, refer to the [Blueprint mapping section](#blueprint-mapping).
{{% /tip %}}


There are two approaches to implementing workflows:

* ***Standard workflows*** - workflows which simply use the [APIs](#apis) to execute and manage tasks.
* ***Graph-based workflows*** - workflows which use the APIs on top of the Graph framework, a framework which offers a simplified process of scheduling and creating dependencies among tasks, as well as built-in support for some of the common aspects of workflows (e.g. [cancellation support](#cancellation-support)).

# APIs

The `ctx` object used by workflow methods is of type `CloudifyWorkflowContext`. It offers access to context data and various services. Additionally, any node, node instance, relationship or relationship instance objects returned by the context object (or from objects returned by the context object) will be wrapped in types which offer additional context data and services.

For full API reference, refer to the documentation over at [cloudify-plugins-common.readthedocs.org](http://cloudify-plugins-common.readthedocs.org/en/3.3/workflows.html).

# Blueprint Mapping

As is the case with plugins, it's the workflow author's responsibility to write a yaml file (named `plugin.yaml` by convention) which will contain both the workflow mapping as well as the workflow's plugin declaration.

Mapping a workflow name to a workflow implementation in the blueprint is done in a similar fashion to the way plugin operations are mapped, i.e. in one of two ways:

* Simple mapping - this should be used to map a workflow name to a workflow implementation which requires no parameters.

  *Example: Mapping `my_workflow` to be implemented by the `my_workflow_method_name` method in the `my_workflow_module_name` module in the `my_workflow_plugin_name` plugin*
  {{< highlight  yaml  >}}
workflows:
  my_workflow: my_workflow_plugin_name.my_workflow_module_name.my_workflow_method_name
  {{< /highlight >}}

* Mapping with parameters - this should be used to map a workflow name to a workflow implementation which uses parameters.

  Workflow parameters declaration is done in a similar manner to the way type properties are declared: It's structured as a schema map, where each entry specifies the parameter schema.

  Example: Making the same mapping yet with parameters declaration - A single mandatory parameter named `mandatory_parameter`, and two optional parameters with default values (one of which is a complex value)*
  {{< highlight  yaml  >}}
workflows:
  my_workflow:
    mapping: my_workflow_plugin_name.my_workflow_module_name.my_workflow_method_name
    parameters:
      mandatory_parameter:
        description: this parameter is mandatory
      optional_parameter:
        description: this paramters is optional
        default: optional_parameter_default_value
      nested_parameter:
        description: >
          this parameter is also optional,
          it's default value has nested values.
        default:
          key1: value1
          key2: value2
  {{< /highlight >}}

<br>
The workflows implementations are considered as *workflows plugins*. As such, they are joined to the blueprint using the exact same mapping that's used to join regular plugins, e.g.:
{{< highlight  yaml  >}}
plugins:
  my_workflow_plugin_name:
    executor: central_deployment_agent
    source: http://example.com/url/to/plugin.zip
{{< /highlight >}}


{{% note title="Note" %}}
It's currently impossible to override a workflow mapping in the blueprint.
{{% /note %}}


# Cancellation Support

A workflow should have support for graceful (AKA *Standard*) cancellation. It is up to the workflow author to decide the semantics of *graceful* in this regard (and document them properly) - One workflow may merely stop the execution, while another may perform a rollback, and so on.

*Standard workflows* which don't implement such support will simply ignore the cancellation request and continue executing the workflow. To implement cancellation support for *standard workflows*, some constructs from the `cloudify.workflows.workflows_api` module need to be used.

Importing the module is done as so:

`from cloudify.workflows import api`

Then, `api.has_cancel_request()` can be used to determine whether the workflow execution should be cancelled due to a standard cancellation request. If it returns `True`, the workflow should take whichever actions its author deems as a proper graceful cancellation, and then raise an `api.ExecutionCancelled` error.

{{% note title="Note" %}}
Waiting for a task to end by calling the method `get` of a `WorkflowTaskResult` object will make the execution go into blocking mode which responds to cancel requests by raising an `api.ExecutionCancelled` error. This means that *standard workflows* which use this method will in fact respond to a cancel request, even if that request was sent before the `get` method was called.

Further more - when a *standard workflow*'s code has finished running, the execution doesn't actually end until all tasks that have been launched have completed as well. This is implemented by iterating over all tasks whose `get` method hasn't yet been called and calling `get` on each one, and therefore if a cancel request was issued and any task was used in the workflow, yet hadn't been called with `get` before the cancel request was received, then the workflow will respond to the cancel request at this final waiting phase by ending (no longer waiting for the rest of the tasks [if any] to end), and doing so with a `cancelled` status.
{{% /note %}}


*Graph-based workflows* have inherent support for graceful cancellation. Upon receiving such a request once the graph's `execute` method has been called, the defined behavior is for the workflow execution to simply end - yet any tasks related to the execution which might have been running at the moment of cancellation will continue to run until they're over.

Once the graph execution ends, the `tasks_graph`'s method `execute` will raise the `api.ExecutionCancelled` error.

For both types of workflows, it's of course possible to catch `api.ExecutionCancelled` errors that may have been raised, thus allowing to perform any sort of cleanup or custom behavior before re-raising the error.


{{% warning title="Deprecation Notice" %}}
The `api.EXECUTION_CANCELLED_RESULT` value, which may have been returned from a workflow to signal that it has cancelled sucessfully, is now deprecated. Raise the `api.ExecutionCancelled` error instead to indicate such an event.
{{% /warning %}}

{{% warning title="Backwards Compatibility Notice" %}}
The Graph API will now raise an `api.ExecutionCancelled` error instead of returning the deprecated `api.EXECUTION_CANCELLED_RESULT` in the event of an execution cancellation. This means that any workflows which made any additional operations beyond the call to the graph's `execute` method, should now use a *try-finally* clause to be able to perform these additional operations and still raise the approriate error once they're done.
{{% /warning %}}

{{% note title="Note" %}}
Neither *standard workflows* nor *graph-based workflows* have any control over force-cancellation requests. Any workflow execution which was issued with a force-cancellation request will be terminated immediately, while any tasks related to the execution which might have been running at the moment of termination will continue to run until they're over.
{{% /note %}}


# Resuming Support

Resuming workflows is a way to continue execution after the execution has failed or has been cancelled, or after a {{< param cfy_manager_name >}} failure (loss of power, or any other scenario leading to an ungraceful shutdown of
the management worker).

Resuming a workflow essentially means running it again, so the workflow author must make sure the workflow is able to cope with being re-run. This is the easiest to achieve when organizing the workflow in terms of a tasks graph.  The tasks graphs may be stored and restored while keeping information about the state of each operation in the graph.

For convenience, {{< param product_name >}} provides the `make_or_get_graph` function, which will take care of restoring a tasks graph during a resume, or will otherwise call a function which should create a new tasks graph.
This function also requires a `name` parameter, so that if the workflow creates multiple tasks graphs, they can be distinguished.

*Example: Creating a resumable workflow using a tasks graph*
{{< highlight  python >}}
from cloudify.decorators import workflow
from cloudify.workflows.tasks_graph import make_or_get_graph

@workflow(resumable=True)  # declare that this workflow can be resumed
def my_workflow(ctx, parameter=None):
    graph = _my_workflow_graph(ctx, name='workflow', parameter=parameter)
    graph.execute()

@make_or_get_graph
def _my_workflow_graph(ctx, parameter):
    graph = ctx.graph_mode()
    graph.add(some_operation)
    return graph
{{< /highlight >}}

Note that the workflow must declare that it is resumable by passing the `resumable=True` keyword to the `workflow` decorator. If not declared, the workflow will fail when a resume is attempted.

Workflows that do not use the tasks graph can be resumed as well, but the workflow author must implement themselves what should happen when a resume is attempted. The `resume` workflow context attribute (`ctx.resume`) says if the workflow is currently being resumed (True) or if the workflow is executed for the first time (False).


# Step by Step Tutorial

In this tutorial we will create from scratch a custom graph-based workflow whose purpose is to execute plugin operations.

The tutorial will offer some guidance and reference about the following:

* Graph framework
  * Adding tasks
  * Creating dependencies between tasks
  * Using the `TaskSequence` construct
  * Using the `forkjoin` construct
* [Workflow APIs](#apis)
  * Executing node operations
  * Executing relationship operations
  * Sending events
  * Working with nodes, node instances, relationships and relationship instances
* Workflow parameters


## Requirements

Similarly to plugins, workflows require the [cloudify-plugins-common](https://github.com/cloudify-cosmo/cloudify-plugins-common) package to be able to use the {{< param product_name >}} workflows API and framework.

## Implementing the Workflow

We'll be implementing the workflow one step at a time, where in each step we'll have a valid, working workflow, but with more features than the one in the previous step.


{{% expand title="Step 1: Basic implementation" open="true" %}}
This is the basic implementation of the desired behavior as a graph-based workflow:

{{< highlight  python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def run_operation(**kwargs):
    graph = ctx.graph_mode()

    for node in ctx.nodes:
        for instance in node.instances:
            graph.add_task(instance.execute_operation('cloudify.interfaces.lifecycle.configure'))

    return graph.execute()
{{< /highlight >}}

Step explanation:

* The first thing we do is to set the workflow to be in graph mode, indicating we'll be using the graph framework (line 6).
* Then, we iterate over all node instances, and add an execute operation task for each instance to the graph (lines 8-10).
* Finally, we tell the graph framework we're done building our tasks graph and that execution may commence (line 12).
{{% /expand %}}



{{% expand title="Step 2: Adding workflow parameters" %}}
The basic workflow is great, if we always want to execute the exact same operation. How about we make it a bit more dynamic?

Lets add some workflow parameters:

{{< highlight  python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def run_operation(operation, type_name, operation_kwargs, **kwargs):
    graph = ctx.graph_mode()

    for node in ctx.nodes:
        if type_name in node.type_hierarchy:
            for instance in node.instances:
                graph.add_task(instance.execute_operation(operation, kwargs=operation_kwargs))

    return graph.execute()
{{< /highlight >}}

Step explanation:

* The workflow method now receives three additional parameters: `operation`, `type_name` and `operation_kwargs` (line 5).
* The `operation` parameter is used to make the workflow able to execute operations dynamically, rather than hardcoded ones; The `operation_kwargs` parameter is used to pass parameters to the operation itself (line 11).
* Since the `operation` parameter value might be an operation which only exists for certain types, the `type_name` parameter is used to determine if the node at hand is of that type or from one derived from it (line 9).
{{% /expand %}}



{{% expand title="Step 3: Adding events" %}}
The workflow's much more functional now, but we're pretty much in the dark when executing it. We'd like to know what's happening at every point in time.

We'll make the workflow more visible by sending out events:

{{< highlight  python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def run_operation(operation, type_name, operation_kwargs, **kwargs):
    graph = ctx.graph_mode()

    for node in ctx.nodes:
        if type_name in node.type_hierarchy:
            for instance in node.instances:

                sequence = graph.sequence()

                sequence.add(
                    instance.send_event('Starting to run operation'),
                    instance.execute_operation(operation, kwargs=operation_kwargs),
                    instance.send_event('Done running operation'))

    return graph.execute()
{{< /highlight >}}

Step explanation:

* We create a `TaskSequence` object (named `sequence`) in the graph. We'll be using it to control the tasks' dependencies, ensuring the events are only sent when they should. Note that since this is done for each node instance separately, the sequences for the various node instances don't depend on one another, and will be able to run in parallel (line 12).
* Three tasks are inserted into the sequence - the original `execute_operation` task, wrapped by two `send_event` tasks. We used the `send_event` method of the instance (of type `CloudifyWorkflowNodeInstance`) rather than the `send_event` method of the ctx object (of type `CloudifyWorkflowContext`) since this way the event will contain node context information (lines 14-17).
{{% /expand %}}



{{% expand title="Step 4: Adding task dependencies" %}}
Lets assume we wish for nodes to execute the operation in order, according to their relationships - each node should only execute the operation once all the nodes which it has relationships to are done executing the operations themselves.

We'll achieve this behavior by adding task dependencies in the graph:

{{< highlight  python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def run_operation(operation, type_name, operation_kwargs, **kwargs):
    graph = ctx.graph_mode()

    send_event_starting_tasks = {}
    send_event_done_tasks = {}

    for node in ctx.nodes:
        if type_name in node.type_hierarchy:
            for instance in node.instances:
                send_event_starting_tasks[instance.id] = instance.send_event('Starting to run operation')
                send_event_done_tasks[instance.id] = instance.send_event('Done running operation')

    for node in ctx.nodes:
        if type_name in node.type_hierarchy:
            for instance in node.instances:

                sequence = graph.sequence()

                sequence.add(
                    send_event_starting_tasks[instance.id],
                    instance.execute_operation(operation, kwargs=operation_kwargs),
                    send_event_done_tasks[instance.id])

    for node in ctx.nodes:
        for instance in node.instances:
            for rel in instance.relationships:

                instance_starting_task = send_event_starting_tasks.get(instance.id)
                target_done_task = send_event_done_tasks.get(rel.target_id)

                if instance_starting_task and target_done_task:
                    graph.add_dependency(instance_starting_task, target_done_task)

    return graph.execute()
{{< /highlight >}}

Step explanation:

* We aim to create task dependency between each node's first task (the `send_event` about starting the operation) and the last task (the `send_event` about finishing the operation) of each node it has a relationship to.
* First, we had to somewhat refactor the existing code - we need references for those tasks for creating the dependencies, and so we first created the tasks and stored them in two simple dictionaries which map each instance ID to that instance's relevant tasks(lines 8-15).
* When adding the tasks to the sequence, we add the tasks we've already created (lines 24 + 26)
* Finally, we have a new section in the code, in which we go over all instances' relationships, retrieve the source instance's first task and the target instance's last task, and if both exist (might not exist since the source and/or target node might not be be of type `type_name` or of a type which is derived from it) then a dependency is created between them (lines 28-36).
{{% /expand %}}



{{% expand title="Step 5: Adding support for relationship operations" %}}
The workflow we've created thus far seems great for running node opeartions, but what about relationship operations?

Lets add support for those too:

{{< highlight  python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx
from cloudify.workflows.tasks_graph import forkjoin

@workflow
def run_operation(operation, type_name, operation_kwargs, is_node_operation, **kwargs):
    graph = ctx.graph_mode()

    send_event_starting_tasks = {}
    send_event_done_tasks = {}

    for node in ctx.nodes:
        if type_name in node.type_hierarchy:
            for instance in node.instances:
                send_event_starting_tasks[instance.id] = instance.send_event('Starting to run operation')
                send_event_done_tasks[instance.id] = instance.send_event('Done running operation')

    for node in ctx.nodes:
        if type_name in node.type_hierarchy:
            for instance in node.instances:

                sequence = graph.sequence()

                if is_node_operation:
                    operation_task = instance.execute_operation(operation, kwargs=operation_kwargs)
                else:
                    forkjoin_tasks = []
                    for relationship in instance.relationships:
                        forkjoin_tasks.append(relationship.execute_source_operation(operation))
                        forkjoin_tasks.append(relationship.execute_target_operation(operation))
                    operation_task = forkjoin(*forkjoin_tasks)

                sequence.add(
                    send_event_starting_tasks[instance.id],
                    operation_task,
                    send_event_done_tasks[instance.id])

    for node in ctx.nodes:
        for instance in node.instances:
            for rel in instance.relationships:

                instance_starting_task = send_event_starting_tasks.get(instance.id)
                target_done_task = send_event_done_tasks.get(rel.target_id)

                if instance_starting_task and target_done_task:
                    graph.add_dependency(instance_starting_task, target_done_task)

    return graph.execute()
{{< /highlight >}}

Step explanation:

* The workflow now has a new parameter - `is_node_operation` - a boolean which represents whether the operation to execute is a node operation or a relationship operation (line 5).
* We had a tiny bit of refactoring done: If the operation is a node operation, we create the task somewhat earlier and store it in a variable named `operation_task`, which is later inserted into the graph in the sequence as before (lines 24-25 + 35)
* If the operation is a relationship operation, we first collect all tasks related to the current instance that should be executed, by going over all of the instance relationships and creating tasks for both source and target operations (lines 26-30)
* Finally, We create a single `forkjoin` task which contains all of the tasks we've collected, and store it in the `operation_task` variable so it'll later be inserted into the sequence. This will allow all of the relationship operations we've collected to run in parallel, while making sure none of them will run before the first sequence task (the `send_event` about starting the operation) completes and also ensuring they'll all complete before the last sequence task (the `send_event` about finishing the operation) is started (line 31).
{{% /expand %}}

We could continue improving our workflow and extending its features, but in the scope of this tutorial, this last version of the workflow will be the one we'll be using throughout the remaining tutorial sections.


## Blueprint Mappings
The workflow plugin declaration will look like this:
{{< highlight  yaml  >}}
plugins:
  my_workflow_plugin_name:
    executor: central_deployment_agent
    source: http://example.com/url/to/plugin.zip
{{< /highlight >}}


The workflow mapping may look like so:
{{< highlight  yaml  >}}
workflows:
  my_workflow:
    mapping: my_workflow_plugin_name.my_workflow_module_name.run_operation
    parameters:
      operation:
        description: the operation to execute
      type_name:
        description: the base type for filtering nodes
        default: cloudify.nodes.Root
      operation_kwargs:
        description: the operation kwargs
        default: {}
      is_node_operation:
        description: >
          is the operation a node operation or
          a relationship operation otherwise
        default: true
{{< /highlight >}}

This will define a workflow named `my_workflow`, whose implementation is the `run_operation` workflow method we coded.

The workflow has four parameters declared:

* The mandatory `operation` parameter
* The optional `type_name` parameter, which defaults to `cloudify.nodes.Root` (meaning the operation will run on all nodes if this value isn't overridden)
* The optional `operation_kwargs` parameter, which defaults to an empty dictionary.
* The optional `is_node_operation` parameter, which defaults to `true`.

## Packaging the Workflow

Since workflows are joined to the blueprint the same way plugins do, they are also packaged the same way. Refer to the [Plugin creation guide]({{< relref "developer/writing_plugins/creating-your-own-plugin.md" >}}) for more information.


# Advanced Usage

What follows are code snippets showing some advanced API that is exposed by the workflow framework.

## Task Handlers
Task handlers are callbacks you set on tasks. They get called when a task fails or succeeds.

{{< highlight python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx
from cloudify.workflows import tasks

@workflow
def use_task_handlers(**kwargs):

    graph = ctx.graph_mode()
    node = ctx.get_node('some_node')
    instance = next(node.instances)

    def on_success(task):
        instance.logger.info('Task {0} succeeded!'.format(task.id))
        # HandlerResult.cont() is the default for on_success.
        # If a task handler is defined for a task, it must return
        # a HandlerResult instance
        return tasks.HandlerResult.cont()

    def on_failure(task):
        instance.logger.info('Task {0} failed :('.format(task.id))
        # Handler result may override the default behavior.
        # If for example the task was to be retried,
        # this will cause the framework to ignore the failure
        # and move on. (the default in this case is HandlerResult.fail())
        return tasks.HandlerResult.ignore()

    task = instance.execute_operation('my_interface.my_task')
    task.on_success = on_success
    task.on_failure = on_failure

    graph.add_task(task)

    return graph.execute()
{{< /highlight >}}

## Deployment Modification

Deployment modification changes the data model to add or remove node instances, and returns the modified node instances for the workflow to operate on them. The [built-in scale workflow]({{< relref "working_with/workflows/built-in-workflows.md" >}}#the-scale-workflow) makes use of this API to scale a node instance up or down.

{{< highlight python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def use_modify(**kwargs):
    new_number_of_instances = 12

    node_id = 'webserver_vm'
    node = ctx.get_node(node_id)
    if node.number_of_instances == new_number_of_instances:
        # no change is required
        return

    modification = ctx.deployment.start_modification({
        node.id: {
            'instances': number_of_new_instances
        }
    })

    going_up = node.number_of_instances < new_number_of_instances
    try:
        if going_up:
            # added.node_instances returns all node instances that are
            # affected by the increasing a node's number of instances.
            # Some are newly added and have their
            # instance.modification == 'added'.
            # Others are node instances that have new relationships
            # to the added node instances.
            added_and_related = modification.added.node_instances

            for instance in added_and_related:
                if instance.modification == 'added':
                    # do stuff
                    pass
                else:
                    # do other stuff
                    pass
        else:
            # removed.node_instances returns all node instances that are
            # affected by the decreasing a node's number of instances.
            # Some are removed and have their
            # instance.modification == 'removed'.
            # Others are node instances that will have relationships
            # to the removed node instances removed after calling
            # modification.finish().
            for instance in removed_and_related:
                if instance.modification == 'removed':
                    # do stuff
                    pass
                else:
                    # do other stuff
                    pass
    except:
        # Do stuff to restore the logical state and then
        # call this to restore that storage state
        modification.rollback()
        raise
    else:
        modification.finish()
{{< /highlight >}}

{{% note title="Note" %}}
To use newly-created node instances in the same workflow after the modification has finished, eg. for running an additional task on them, call `ctx.refresh_node_instances()` to update the workflow context with the updated node instance list.
{{% /note %}}

## Subgraphs (Experimental)

Subgraphs provide means for easier modeling of complex workflows, by grouping certain operations into their own subgraphs and creating dependencies between different subgraphs.
Subgraphs expose the Task and Graph API's, i.e. they have methods on them to create dependencies between
tasks (Graph API) and dependencies can be created between them and other tasks (which may be subgraphs themselves) (Task API).

{{% note title="Note" %}}
The Subgraph API is still in its early stage and it may change in backward incompatible ways in the future.
{{% /note %}}

{{< highlight python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def use_subgraphs(**kwargs):

    graph = ctx.graph_mode()
    node = ctx.get_node('some_node')
    instance = next(node.instances)

    # A subgraph to create some node instance
    # creating a subgraph also adds it as a task to the graph from
    # which it was created.
    start_subgraph = graph.subgraph('some_start_subgraph')
    start_subgraph_sequence = start_subgraph.sequence()
    start_subgraph_sequence.add([
        instance.execute_opeartion('my_interface.create'),
        instance.execute_opeartion('my_interface.configure'),
        instance.execute_opeartion('my_interface.start')
    ])

    # A subgraph to upgrade some node instance
    upgrade_subgraph = graph.subgraph('some_upgrade_subgraph')
    upgrade_subgraph_sequence = upgrade_subgraph.sequence()
    upgrade_subgraph_sequence.add([
        instance.execute_opeartion('my_interface.upgrade.step1'),
        instance.execute_opeartion('my_interface.upgrade.step2'),
        instance.execute_opeartion('my_interface.upgrade.step3')
    ])

    # Start running operations on the upgrade subgraph
    # only when the start subgraph ended
    graph.add_dependency(upgrade_subgraph, start_subgraph)

    return graph.execute()
{{< /highlight >}}

## Contained Subgraph
Get all node instances that are contained in a node instance. The [built-in heal workflow]({{< relref "working_with/workflows/built-in-workflows.md" >}}#the-heal-workflow)
makes use of this API to calculate all node instances that belong to a `cloudify.nodes.Compute` node that should be healed.
{{< highlight python >}}
from cloudify.decorators import workflow
from cloudify.workflows import ctx

@workflow
def use_contained_subgraph(**kwargs):
    node = ctx.get_node('some_node')
    instance = next(node.instances)
    # get node instances that are directly contained in the instance
    for contained_instance in instance.contained_instances:
        # do something
        pass

    # get node instances that are recursively contained in the instance
    # (including the instance itself)
    for contained_instance in instance.get_contained_subgraph():
        # do something
        passs
{{< /highlight >}}
