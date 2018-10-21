import * as PROCESS_FRAGMENT from '../../definition/queries/bpmn_process.fragment.graphql';
import * as PROCESS_INSTANCE_QUERY from '../queries/bpmn_process_instance.query.graphql';
import * as PROCESS_INSTANCE_LIST_QUERY from '../queries/bpmn_process_instances_query.graphql';

import { Query, QueryProps } from 'react-apollo';

import { QueryTypes } from 'data/client';

export { PROCESS_INSTANCE_LIST_QUERY, PROCESS_FRAGMENT, PROCESS_INSTANCE_QUERY };

/* =========================================================
    Process Instance List
   ======================================================== */

type ProcessInstanceListData = QueryTypes.BpmnProcessInstancesQuery;
type ProcessInstanceListVariables = QueryTypes.BpmnProcessInstancesQueryVariables;
type ProcessInstanceListProps = Partial<
  QueryProps<ProcessInstanceListData, ProcessInstanceListVariables>
>;

export class ProcessInstanceListQuery extends Query<
  ProcessInstanceListData,
  ProcessInstanceListVariables
> {
  static displayName = 'ProcessInstanceListQuery';
  static defaultProps: ProcessInstanceListProps = {
    query: PROCESS_INSTANCE_LIST_QUERY,
    variables: {
      input: {
        first: 50
      }
    }
  };
}
