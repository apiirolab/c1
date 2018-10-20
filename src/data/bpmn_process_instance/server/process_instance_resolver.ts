import { Mutation, Prisma, purge, Query, Yoga } from 'data/utils';
import { BpmnProcessInstance } from '../../yoga/models/bpmn_process_instance_model';
import { BpmnProcessModel } from '../../yoga/models/bpmn_process_model';

export const query: Query = {
  async bpmnProcessInstancesQuery(_parent, { input }, ctx, info) {
    const result = await ctx.db.query.bpmnProcessInstances(
      {
        where: purge<Yoga.BpmnProcessInstanceWhereInput>({
          status: input.status
        }),
        skip: input.skip,
        first: input.first
      },
      info
    );

    // sort by name

    return result.sort((a, b) => {
      return a.process.name.localeCompare(b.process.name, 'en', { numeric: true });
    });
  },
  bpmnProcessInstanceQuery(_parent, { id }, ctx, info) {
    return ctx.db.query.bpmnProcessInstance({ where: { id } }, info);
  }
};

export const accessConditionFragment = `
      organisationId
      roleId
      userId
    `;

export const userFragment = `
  name
  id
`;

export const mutation: Mutation = {
  async launchProcessInstance(_parent, { input: { processId, role } }, ctx) {
    const userId = ctx.userId;

    const processInstanceDAO = await ctx.db.mutation.createBpmnProcessInstance(
      {
        data: {
          dateStarted: new Date(),
          // duration: 0,
          owner: {
            connect: {
              id: userId
            }
          },
          process: {
            connect: {
              id: processId
            }
          },
          data: {},
          status: 'Running'
        }
      },
      `{
      id
      owner {
        ${userFragment}
      }
      data
      status
    }`
    );

    const bpmnProcessModelDao = await ctx.db.query.bpmnProcess(
      { where: { id: processId } },
      `{
      id
      access {
        id
        createdById
        createdOn
        modifiedById
        modifiedOn
        read {
          ${accessConditionFragment}
        }
        write {
          ${accessConditionFragment}
        }
        execute {
          ${accessConditionFragment}
        }
      }
      actionCount
      description
      model
      name
      type
      status
    }`
    );
    const bpmnProcessModel = new BpmnProcessModel(bpmnProcessModelDao);

    const processInstance = new BpmnProcessInstance(processInstanceDAO, bpmnProcessModel);
    return processInstance.start(ctx, role);
  },
  async duplicateProcessInstance(_parent, { input: { processInstanceId } }, ctx, info) {
    const newProcessInstance = BpmnProcessInstance.duplicateInstance(processInstanceId, ctx, info);
    return newProcessInstance;
  },
  async abortProcessInstance(_parent, { input: { processInstanceId } }, ctx, info) {
    return BpmnProcessInstance.abortInstance(processInstanceId, ctx, info);
  },
  async pauseProcessInstance(_parent, { input: { processInstanceId } }, ctx, info) {
    return BpmnProcessInstance.pauseInstance(processInstanceId, ctx, info);
  },
  async addComment(_parent, { input: { processInstanceId, comment, replyTo } }, ctx, info) {
    /* push given comment to process instance */
    return BpmnProcessInstance.addComment(processInstanceId, ctx, comment, replyTo, info);
  }
};
