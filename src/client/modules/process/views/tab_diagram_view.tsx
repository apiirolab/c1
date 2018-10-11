import * as React from 'react';

import BpmnViewer from 'bpmn-js';
// import BpmnModdle from 'bpmn-moddle';

import { QueryTypes } from 'data/client';
import styled from 'styled-components';

type Props = {
  process: QueryTypes.BpmnProcessDefinition;
  context: App.Context;
};

const Canvas = styled.div`
  min-height: 800px;
  height: 800px
  width: 100%;
  margin: 12px;
`;

export class TabDiagramView extends React.Component<Props> {
  componentDidMount() {
    // let moddle = new BpmnModdle();
    let viewer = new BpmnViewer({
      container: '#canvas'
    });

    // moddle.fromXML(this.props.process.model, function(err, definitions) {

    //   // update id attribute
    //   definitions.set('id', 'NEW ID');

    //   // add a root element
    //   let bpmnProcess = moddle.create('bpmn:Process', { id: 'MyProcess_1' });
    //   definitions.get('rootElements').push(bpmnProcess);

    //   moddle.toXML(definitions, function(err, xmlStrUpdated) {
    //     // xmlStrUpdated contains new id and the added process
    //   });
    // });

    viewer.importXML(this.props.process.model, function(err: string) {
      if (!err) {
        viewer.get('canvas').zoom('fit-viewport');
      } else {
        console.log('something went wrong:', err);
      }
    });
  }
  render() {
    return <Canvas id="canvas" />;
  }
}

TabDiagramView.displayName = 'TabDocumentView';
