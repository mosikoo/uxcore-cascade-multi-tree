/**
 * CascadeMultiTree Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
const React = require('react');
class CascadeMultiTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>uxcore-cascade-multi-select component</div>
    );
  }
}

CascadeMultiTree.defaultProps = {
};


// http://facebook.github.io/react/docs/reusable-components.html
CascadeMultiTree.propTypes = {
};

CascadeMultiTree.displayName = 'CascadeMultiTree';

module.exports = CascadeMultiTree;
