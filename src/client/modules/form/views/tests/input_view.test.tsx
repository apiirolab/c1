import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { Segment } from 'semantic-ui-react';

import { QueryTypes } from 'data/client';
import { FormModel } from '../../models/form_model';
import { FormView } from '../form_view';
import { create } from './form_query_data';

describe('Form', () => {
  const descriptors = [
    create.descriptor({ name: 'owner.personal.name' }),
    create.descriptor({ name: 'owner.personal.age', type: QueryTypes.DataType.Float }),
    create.descriptor({
      name: 'younger',
      type: QueryTypes.DataType.Int,
      expression: `this['owner.personal.age'] - 10`
    }),
    create.descriptor({
      name: 'older',
      type: QueryTypes.DataType.Int,
      expression: `this['owner.personal.age'] + 10`
    })
  ];

  const controlData = [
    { name: 'owner.personal.name', value: 'Tomas' },
    {
      name: 'owner.personal.age',
      value: 33
    }
  ];

  const dataSet = FormModel.buildMstModel(descriptors, controlData);

  describe('Viewer', () => {
    function componentWithData() {
      const form = new FormModel(
        create.form({
          elements: [
            create.formElement({
              id: '1',
              row: 0,
              column: 0,
              width: 16,
              control: QueryTypes.FormControl.Input,
              controlProps: {
                label: 'Name'
              },
              label: 'Mimo',
              source: create.descriptor({
                id: '',
                name: 'owner.personal.name'
              })
            }),
            create.formElement({
              id: '2',
              row: 1,
              column: 1,
              width: 7,
              control: QueryTypes.FormControl.Input,
              source: create.descriptor({
                id: '',
                name: 'owner.personal.age'
              }),
              label: 'Age: ',
              inline: true
            }),
            create.formElement({
              id: '3',
              row: 1,
              column: 10,
              width: 2,
              control: QueryTypes.FormControl.Input,
              source: create.descriptor({
                id: '',
                name: 'younger'
              }),
              label: 'Younger'
            }),
            create.formElement({
              id: '4',
              row: 1,
              column: 13,
              width: 2,
              control: QueryTypes.FormControl.Input,
              source: create.descriptor({
                id: '',
                name: 'older'
              }),
              label: 'Older'
            })
          ]
        })
      );

      // just another notation
      return (
        <Segment className="ui form">
          <FormView form={form} data={dataSet} />
        </Segment>
      );
    }

    it('renders correctly', () => {
      const component = renderer.create(componentWithData());
      expect(component).toMatchSnapshot();
    });

    it('changes value and all related formulas', () => {
      const component = renderer.create(componentWithData());
      const root = component.root;
      const age = root.findByProps({ name: 'owner.personal.age' });
      age.props.onChange({ target: { value: '40' } });
      expect(component).toMatchSnapshot();
    });

    return { componentWithData };
  });
});
