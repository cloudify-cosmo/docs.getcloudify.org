---
title: Deployment Settings
category: Blueprints
draft: false
weight: 1000
aliases: /blueprints/spec-deployment-settings/
---

Deployment Settings are additional settings and instructions provided to
{{< param product_name >}} manager on how to handle a deployment created out of this blueprint.

# Declaration

## Default Schedules setting

This deployment setting allows you to define a list of deployment schedules
to be created for any deployment which is based on this blueprint.

{{< highlight  yaml >}}
deployment_settings:
  default_schedules:
    sc-1:
      workflow: ...
      since: ...
      timezone: ...
      recurrence: ...
      count: ...
    sc-2:
      ...
{{< /highlight >}}


## Default Schedules schema

Keyname               | Required | Type        | Description
-----------           | -------- | ----        | -----------
`workflow`            | yes      | string      | The name of the workflow the schedule should execute, e.g. `install`.
`execution_arguments` | no       | dict        | Schema of arguments to be passed directly to the workflow execution (detailed below).
`workflow_parameters` | no       | dict        | Schema of additional parameters to be passed to the workflow execution as kwargs.
`since`               | yes      | string      | A string representing the earliest possible time for the execution to run. Supported formats: `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.
`until`               | no       | string      | A string representing the latest possible time for the execution to run. Supported formats: `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.
`recurrence`          | no       | string      | Recurrence on the scheduled execution. e.g. `2 weeks`, `30 min` or `1d`. Mandatory if `count` is other than 1.
`timezone`            | no       | string      | The timezone to be used for scheduling, e.g. `EST` or `Asia/Jerusalem`. By default, the local timezone will be used. Supports any timezone in the [TZ database wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
`weekdays`            | no       | list        | A list of weekdays on which to run the execution, e.g. `su,mo,tu`. If left empty, runs on all weekdays.
`count`               | no       | number      | Maximum number of times to run the execution. If left empty, there's no limit on repetition.
`default_enabled`     | no       | boolean     | If set to `false`, the created schedule will not run executions until manually enabled by the user. If not provided, defaults to `true`.
`stop_after_fail`     | no       | boolean     | If set to `true`, once the execution has failed, the scheduler won't make further attempts to run it. If not provided, defaults to `false`.
`slip`                | no       | number      | Maximum time window after the target time has passed, in which the scheduled execution can run (in minutes). If not provided, defaults to 0.

 Valid **relative time** expressions are of the form `+<integer> minutes|hours|days|weeks|months|years` or a concatenation of several such, e.g. `+1 year +3 months`.
These can be also written without a space after the number, without the final `s`, or using the short forms `min|h|d|w|mo|y`.

Valid **recurrence** expressions are of the form `<integer> minutes|hours|days|weeks|months|years`. These can be also written without a space after the number, without the final `s`, or using the short forms `min|h|d|w|mo|y`.

Valid **weekdays** expressions are any of `su|mo|tu|we|th|fr|sa`, or a comma-separated list of them.
These may be optionally prefixed by `1` to `4` or `l-` (for "last") signifying a "complex weekday", e.g. `2mo` for "the 2nd Monday of a month" or `l-fr` for "the last Friday of a month". Complex weekdays can only be used in tandem with a `months` or `years` recurrence.

{{% note %}}
All relative times are evaluated in relation to the **deployment creation** time.
This is true when _creating_ a deployment from a blueprint with default schedules, as well as when _updating_ a deployment using a blueprint with default schedules.
{{% /note %}}

## Default Schedules execution_arguments schema

Keyname                    | Required | Type        | Description
-----------                | -------- | ----        | -----------
`force`                    | no       | boolean     | Specifies whether to force the workflow execution in case there is already a running execution.
`dry_run`                  | no       | boolean     | If set to `true`, no actual actions will be performed.
`wait_after_fail`          | no       | number      | When a task fails, wait this many seconds for already-running tasks to return. If not provided, defaults to 600.
`allow_custom_parameters`  | no       | boolean     | Specifies whether to allow custom parameters, which are not present in the parameters schema of the workflow.

# Example

{{< highlight  yaml >}}
deployment_settings:
  default_schedules:
    a:
      workflow: install
      since: '2023-1-1 18:00'
      timezone: 'EST'
      count: 1
    b:
      workflow: uninstall
      since: '+4h'
      until: '2022-1-1 15:00'
      recurrence: 1w
      weekdays: [tu, we]
      count: 5
    c:
      workflow: uninstall
      since: '2022-1-1 15:00'
      until: '+1d'
      timezone: 'Israel'
      recurrence: 1mo
      weekdays: [l-fr]
      count: 10
{{< /highlight >}}


## Behavior on deployment update

When updating a deployment using a blueprint with default schedules, the following will occur:
* deployment schedules defined in the *old* blueprint plan will be deleted
* deployment schedules defined in the *new* blueprint plan will be created
* deployment schedules created manually by the user will remain untouched
  {{% warning %}}
  (unless coincidentally named the same as if created from the old plan -
  then they will be deleted) {{% /warning %}}

# Example

The original blueprint, used during deployment creation:

{{< highlight  yaml >}}
deployment_settings:
  default_schedules:
    a:
      ...
    b:
      ...
    c:
      workflow: uninstall
      ...
{{< /highlight >}}

The new blueprint, used during deployment update:

{{< highlight  yaml >}}
deployment_settings:
  default_schedules:
    c:
      workflow: install
      ...
    d:
      ...
{{< /highlight >}}

Following the deployment update:
* Schedules `a` and `b` of the demployment `{deployment_id}` will be deleted from the manager;
* A new schedule `d` of the demployment `{deployment_id}` will be added to the manager; and
* A new schedule `c` of the demployment `{deployment_id}`, which runs `install`, will replace its previous schedule `c` which runs `uninstall`.
