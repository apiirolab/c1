import { BpmnProcessInstance, ProcessActionResult } from 'data/yoga/models/bpmn_process_instance_model';
import { BoundaryEvent } from './bpmn_boundary_event_model';
import { Lane } from './bpmn_lane_model';
import { Task } from './bpmn_task_model';

export class UserTask extends Task {
  constructor(task: Bpmn.UserTask, lane?: Lane, attachedEvents?: BoundaryEvent[]) {
    super(task, lane, attachedEvents);
  }

  async execute(state: BpmnProcessInstance, context: ServerContext, result: ProcessActionResult) {
    
    const user = await context.getUser();
    
    console.log(user);

    if (user) {
      const taskInstanceDAO = await context.db.mutation.createBpmnTaskInstance({
        data: {
          // dateFinished: null,
          dateStarted: new Date(),
          // duration: null,
          // performerId: null,
          data: JSON.parse(JSON.stringify(state.resources)), // clone of properties (not of functions)
          taskId: this.id,
          // performerRoles: BpmnTaskInstanceCreateperformerRolesInput,
          performerRoles: {
            set: this.lane.roles
          },
          performer: {
            connect: {
              id: context.userId
            }
          },
          processInstance: {
            connect: {
              id: state.id
            }
          },
          status: 'Waiting'
        }
      });
      result.active.push(taskInstanceDAO.id);
    } else {
      throw new Error('Creating New User Task: No User');
    }
  }
}
