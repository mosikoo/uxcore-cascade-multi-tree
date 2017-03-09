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
import Animate from 'rc-animate';
import SelectTrigger from './SelectTrigger';
import i18n from './locale';

import {
  UNSELECTABLE_STYLE, UNSELECTABLE_ATTRIBUTE, preventDefaultEvent,
  SHOW_ALL, SHOW_CHILD, SHOW_PARENT, toArray,
  getTreeNodesStates, loopTreeData, filterNodesfromStrategy,
} from './utils';

function noop() {}


class CascadeMultiTree extends React.Component {

  constructor(props) {
    super(props);

    this.renderedTreeData = this.renderTreeData();
    const value = this.getValue(toArray(props.value || props.defaultValue));
    this.state = {
      value,
    };

    this.removeSigleValue = this.removeSigleValue.bind(this);
    this.getContentDOMNode = this.getContentDOMNode.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(vals) {
    const value = this.getValue(vals);
    this.setState({
      value,
    });
  }

  getValue(value) {
    this.treeNodesStates = getTreeNodesStates(this.renderedTreeData, value);

    return this.treeNodesStates.checkedNodes;
  }

  getContentDOMNode() {
    return this.refs && this.refs.selection;
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
    const {
      prefixCls, maxTagTextLength, disabled,
      className, choiceTransitionName, locale,
      showCheckedStrategy,
    } = this.props;
    const rootCls = {
      [className]: !!className,
      [prefixCls]: 1,
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-enabled`]: !disabled,
    };
    const placeholder = (<span className={`${prefixCls}-placeholder`}>
      {i18n[locale].pullDownSelect}
    </span>);

    const showVals = filterNodesfromStrategy(value, showCheckedStrategy);
    const selectedValueNodes = showVals.map((singleValue) => {
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
        {
          value.length === 0 ? placeholder :
            <Animate
              className={ulCls}
              component="ul"
              transitionName={choiceTransitionName}
            >
              {selectedValueNodes}
            </Animate>
        }
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
            onChange={this.onValueChange}
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
  resultsPanelTitleStyle: { color: '#eee' },
  resultsPanelTitle: 'test title',
  showCheckedStrategy: SHOW_PARENT,
  isFilterToRpfromSearch: true,
  choiceTransitionName: 'uxcore-cascade-multi-tree-selection__choice-zoom',
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
  isFilterToRpfromSearch: PropTypes.bool,
  choiceTransitionName: PropTypes.string,
};

CascadeMultiTree.displayName = 'CascadeMultiTree';

module.exports = CascadeMultiTree;
