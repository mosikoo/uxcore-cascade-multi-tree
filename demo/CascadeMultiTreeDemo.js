/**
 * CascadeMultiTree Component Demo for uxcore
 * @author chenqiu
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeMultiTree = require('../src');

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div>
        <CascadeMultiTree />
      </div>
    );
  }
}

module.exports = Demo;
