import { Task } from './bpmn_task_model';
import { BpmnProcessInstance } from '../bpmn_process_instance_model';
import { BpmnTaskInstanceModel } from '../bpmn_task_instance_model';

export class ReceiveTask extends Task {

  constructor(task: Bpmn.ReceiveTask) {
    super(task);
  }

  execute(state: BpmnProcessInstance): Promise<BpmnTaskInstanceModel[]> {
    return null;
  }
}