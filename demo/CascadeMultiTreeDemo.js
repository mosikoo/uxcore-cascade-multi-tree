/**
 * CascadeMultiTree Component Demo for uxcore
 * @author chenqiu
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

import React from 'react';
import CascadeMultiTree from '../src';
import { options } from './const';

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div style={{ margin: '20px' }}>
        <h2>test Demo</h2>
        <CascadeMultiTree
          resultsPanelTitleStyle={{ color: '#888' }}
          resultsPanelTitle="test title"
          options={options}
          value={['shangcheng', 'zhonghuamen', 'nanjing']}
          showCheckedStrategy={'SHOW_ALL'}
        />
      </div>
    );
  }
}

module.exports = Demo;
