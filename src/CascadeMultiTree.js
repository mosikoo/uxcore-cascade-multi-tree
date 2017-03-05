/**
 * CascadeMultiTree Component for uxcore
 * @author chenqiu
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Dropdown from 'uxcore-dropdown';
import SelectTrigger from './SelectTrigger';
import TreeNode from './TreeNode.jsx';

import {
  UNSELECTABLE_STYLE, UNSELECTABLE_ATTRIBUTE, preventDefaultEvent,
  SHOW_ALL, SHOW_CHILD, SHOW_PARENT, toArray,
  getTreeNodesStates, loopTreeData,
} from './utils';

function noop() {}


class CascadeMultiTree extends React.Component {

  constructor(props) {
    super(props);

    this.renderedTreeData = this.renderTreeData();
    console.log( this.renderedTreeData, 'renderTreeData')
    const value = this.getValue(toArray(props.value || props.defaultValue));
    this.state = {
      value,
    };

    this.removeSigleValue = this.removeSigleValue.bind(this);
    this.getContentDOMNode = this.getContentDOMNode.bind(this);
  }

  componentDidMount() {

  }

  getContentDOMNode() {
    return this.refs && this.refs.selection;
  }

  getValue(value) {
    const { showCheckedStrategy } = this.props;

    this.treeNodesStates = getTreeNodesStates(this.renderedTreeData, value);

    return this.treeNodesStates.checkedNodes;
  }


  removeSigleValue(e) {
    e.stopPropagation();
  }

  renderTreeData(props) {
    const validProps = props || this.props;
    const { options } = validProps;
    if (options === this.props.options && this.renderedTreeData) {
      this.cacheTreeData = true;
      return this.renderedTreeData;
    }
    this.cacheTreeData = false;

    return loopTreeData(options);
  }

  renderTopControlNode() {
    const { value, open } = this.state;
    const { prefixCls, maxTagTextLength, disabled, className } = this.props;
    const rootCls = {
      [className]: !!className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
    };

    const selectedValueNodes = value.map((singleValue) => {
      let content = singleValue.label;
      if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
        content = `${content.slice(0, maxTagTextLength)}...`;
      }
      return (
        <li
          key={singleValue.value}
          style={UNSELECTABLE_STYLE}
          {...UNSELECTABLE_ATTRIBUTE}
          onMouseDown={preventDefaultEvent}
          className={`${prefixCls}-selection-choice`}
        >
          <span
            className={`${prefixCls}-selection-choice-remove`}
            onClick={this.removeSigleValue}
          />
          <span className={`${prefixCls}-selection-choice-content`}>{content}</span>
        </li>
      );
    });

    const ulCls = `${prefixCls}-selection-rendered`;

    return (
      <div
        className={classnames(rootCls)}
        role="combobox"
        key="selection"
        ref="selection"
      >
        <ul className={ulCls}>{selectedValueNodes}</ul>
      </div>
    );
  }

  render() {
    const { prefixCls, dropdownMatchSelectWidth } = this.props;

    return (
      <Dropdown
        overlay={
          <SelectTrigger
            triggerPrefixCls={prefixCls}
            getContentDOMNode={this.getContentDOMNode}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            treeData={this.renderedTreeData} // todo 缓存
            treeNodesStates={this.treeNodesStates} // todo 缓存
            cacheTreeData={this.cacheTreeData} // todo 缓存
            {...this.props}
          />
        }
        trigger={['click']}
      >
        {this.renderTopControlNode()}
      </Dropdown>
    );
  }
}

CascadeMultiTree.defaultProps = {
  prefixCls: 'uxcore-cascade-multi-tree',
  className: '',
  maxTagTextLength: 10,
  dropdownClassName: '',
  config: {},
  options: [],
  value: '',
  defaultValue: '',
  cascadeSize: 3,
  placeholder: '',
  notFoundContent: '',
  allowClear: true,
  disabled: false,
  locale: 'zh-cn',
  onSelect: noop,
  onItemClick: noop,
  dropdownMatchSelectWidth: false,
  showSearch: true,
  allCheckBtn: true,
  resultsPanelAllClearBtn: true,
  searchPlaceholder: '请输入搜索名称',
  resultsPanelTitleStyle: { color: 'red' },
  resultsPanelTitle: 'test title',
  showCheckedStrategy: SHOW_CHILD,
};


CascadeMultiTree.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  maxTagTextLength: PropTypes.number,
  dropdownClassName: PropTypes.string,
  config: PropTypes.object,
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.string, PropTypes.array,
  ]),
  defaultValue: PropTypes.string,
  cascadeSize: PropTypes.number,
  placeholder: PropTypes.string,
  notFoundContent: PropTypes.string,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  locale: PropTypes.string,
  onSelect: PropTypes.func,
  onItemClick: PropTypes.func,
  dropdownMatchSelectWidth: PropTypes.bool,
  showSearch: PropTypes.bool,
  allCheckBtn: PropTypes.bool,
  resultsPanelAllClearBtn: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  resultsPanelTitleStyle: PropTypes.object,
  resultsPanelTitle: PropTypes.oneOfType([
    PropTypes.string, PropTypes.node,
  ]),
  showCheckedStrategy: PropTypes.oneOf([
    SHOW_ALL, SHOW_CHILD, SHOW_PARENT,
  ]),
};

CascadeMultiTree.displayName = 'CascadeMultiTree';

module.exports = CascadeMultiTree;
