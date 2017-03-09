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
      value: ['shangcheng', 'zhonghuamen', 'nanjing'],
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value, nodes) {
    console.log('demo中的回调', value, nodes);
    this.setState({ value });
  }

  render() {
    return (
      <div style={{ margin: '20px' }}>
        <h2>test Demo</h2>
        <CascadeMultiTree
          resultsPanelTitleStyle={{ color: '#888' }}
          resultsPanelTitle="test title"
          options={options}
          value={this.state.value}
          showCheckedStrategy={'SHOW_PARENT'}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

module.exports = Demo;
