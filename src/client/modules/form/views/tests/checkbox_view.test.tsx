import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { createData } from 'tests/client';
import { FormModel } from '../../models/form_model';
import { FormView } from '../form_view';

import 'jest-styled-components';

import { Segment } from 'semantic-ui-react';

describe('Form', () => {
  const descriptors = [
    createData.descriptor({ name: 'agree', type: 'Boolean' }),
    createData.descriptor({ name: 'disagree', type: 'Boolean' })
  ];

  const controlData = [{ name: 'agree', value: true }, { name: 'disagree', value: false }];
  const dataSet = FormModel.buildMstModel(descriptors, controlData);

  storyOf(
    'Checkbox',
    {
      get component() {
        const form = new FormModel(
          createData.formDao({
            elements: [
              {
                id: '1',
                row: 0,
                column: 0,
                width: 8,
                control: 'Checkbox',
                label: 'Agree With Terms and Conditions',
                source: {
                  id: '',
                  name: 'agree'
                }
              },
              {
                id: '2',
                row: 1,
                column: 0,
                width: 8,
                control: 'Checkbox',
                controlProps: {
                  toggle: true
                },
                label: 'Disagree With Terms and Conditions',
                source: {
                  id: '',
                  name: 'disagree'
                }
              }
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
    },
    data => {
      it('renders correctly', () => {
        const component = renderer.create(data.component);
        expect(component).toMatchSnapshot();
      });

      it('renders other', () => {
        const component = renderer.create(data.component);
        expect(component).toMatchSnapshot();
      });

      it('changes value and all related formulas', () => {
        const component = renderer.create(data.component);
        const root = component.root;
        const agree = root.findByProps({ name: 'agree' });
        agree.props.onChange(null, { value: false });

        const disagree = root.findByProps({ name: 'disagree' });
        disagree.props.onChange(null, { value: true });
        expect(component).toMatchSnapshot();
      });
    }
  );
});
