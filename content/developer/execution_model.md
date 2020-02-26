---
title: Workflow Execution Model
description:
weight: 70
---

## Running an execution

An execution is started by a user, by sending a POST request to the REST API's /executions endpoint.

1. The REST API creates an execution object in the database, including a random execution token.
1. The restservice sends "start-workflow" message to the management queue on rabbitmq. That message contains at least the following fields:

        {
            'type': 'workflow',
            'task_name': import path of the workflow function (eg. "cloudify.plugins.workflows.install"),
            'task_id': execution id,
            'workflow_id': id of the workflow (eg. "install"),
            'blueprint_id': blueprint id,
            'deployment_id': deployment id,
            'runtime_only_evaluation': boolean,
            'execution_id': execution id,
            'bypass_maintenance': boolean,
            'dry_run': boolean,
            'is_system_workflow': boolean,
            'wait_after_fail': boolean,
            'resume': boolean,
            'execution_token': execution token,
            'plugin': details of the plugin containing the workflow function (dict)
        }

1. The management worker receives the "start-workflow" message from rabbitmq, and runs a "dispatcher" subprocess to handle it.
1. The subprocess loads and executes the workflow function. Most workflow functions create a tasks graph and execute it.
1. The subprocess periodically checks execution state to react to the state changing to CANCELLED.
1. The workflow function might store the tasks graph and the operations, to allow resuming.
1. For every operation in the tasks graph, the dispatcher process sends "start-operation" messages:
    - the operation is transitioned to the SENDING state, and then SENT
    - the message is sent to the exchange `<agent_name>`; central_deployment_agent tasks use the special agent_name of `cloudify.management`
    - the dispatcher process starts listening for the task result on the `<agent_name>_response_<task_id>`.

    The "start-operation" message contains at least the following fields:

        {
            'id': task_id,
            'cloudify_task': {
              'kwargs': dict containing the operation parameters, including a special parameter '__cloudify_context'
            }
        }

1. The target agent or mgmtworker receives the message and starts an operation subprocess to execute the task:
    - operation message is acked
    - task is transitioned to STARTED
    - operation function is executed
1. The agent finishes executing the task
    - task is transitioned to a terminal state (SUCCEEDED, FAILED, or RESCHEDULED)
    - an "operation-response" message is sent.

    The "operation-response" message contains at least the following fields:

        {
          "ok": boolean,
          "result": operation result value
        }

    And optionally an "error" field.
1. The dispatcher receives the response
    - the dispatcher deletes the task response queue
1. After all tasks have been executed, the dispatcher finishes executing the workflow
    - execution state is changed to TERMINATED or FAILED
    - workflow message is acked, no response is written


## Cancelling or force-cancelling an execution

To cancel an execution, the user sends a POST request with the parameter "action" set to "cancel" or "force-cancel"

1. The restservice updates the execution state to CANCELLING or FORCE_CANCELLING.
1. The management worker "dispatcher" process reacts to the state change. It is up to the workflow function to stop execution. Well-behaved workflow functions, such as the built-in executions that use a tasks graph, stop execution immediately.
1. The dispatcher process:
    - in case of a regular, non-force, cancel: waits for the workflow function to finish
    - in case of a force-cancel: does not wait for the workflow function to finish
    - sets the execution state to CANCELLED
1. Workflow message is acked, no response is written


## Kill-cancelling an execution

To kill-cancel an execution, the user sends a POST request with the parameter "action" set to "kill".

1. The restservice updates the execution state to CANCELLED.
1. The restservice sends a "kill-execution" message to the management queue, containing at least the following fields:

        {
          'service_task': {
              'task_name': 'cancel-workflow',
              'kwargs': {
                  'execution_id': execution id,
                  'tenant': {
                      'name': tenant name
                  },
                  'execution_token': execution token
              }
          }
        }

1. The management worker receives the "kill-execution" message.
1. The workflow subprocess is killed by sending SIGTERM, and 5 seconds later, SIGKILL.
1. The management worker sends a "kill-operation" message to every agent in the tenant of the execution. The "kill-operation" message contains at least the following fields:

        {
          'service_task': {
              'task_name': 'cancel-operation',
              'kwargs': {
                  'execution_id': execution id
              }
          }
        }

1. Every agent receives the message, and kills every running operation subprocess of the cancelled execution by sending SIGTERM, and 5 seconds later, SIGKILL


## Resuming an execution

To kill-cancel an execution, the user sends a POST request with the parameter "action" set to "resume" or "force-resume".
Force-resume is labeled `cfy executions resume --reset-operations` in the CLI.

Only STARTED, CANCELLED and FAILED executions can be resumed, and only CANCELLED and FAILED executions can be force-resumed.
Resuming STARTED executions is allowed to help restore "stuck" executions; to force-resume a STARTED execution, it should be cancelled first (if it is truly "stuck", it will have to be kill-cancelled).

1. The restservice updates the execution object with:
    - a new execution token
    - ended_at date set to null
    - status set to STARTED
1. Update stored operations: operations in state RESCHEDULED or FAILED are set to PENDING, and their current_retries count is reset to 0.
1. In case of a force-resume, also do the previous step for operations in state STARTED, SENT, or SENDING.
1. Start running the execution as in the "Running an execution" section, with the exception that:
    - where the management worker sends "start-operation" messages, if the operation is already in a SENT or STARTED state, the message is not sent. Instead, the management worker proceeds to the next step, and waits for a response.
