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
  SHOW_ALL, SHOW_CHILD, SHOW_PARENT, toArray, isInherit, isEquelOfTwoValues,
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
      open: false,
    };

    this.removeSigleValue = this.removeSigleValue.bind(this);
    this.getContentDOMNode = this.getContentDOMNode.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.renderedTreeData = this.renderTreeData(nextProps);
    const { showCheckedStrategy } = this.props;

    if ('value' in nextProps) {
      // 判断value与目前的value是否相等
      if (!(this.cacheTreeData &&
        isEquelOfTwoValues(nextProps.value, this.treeNodesStates, showCheckedStrategy))
      ) {
        const value = this.getValue(toArray(nextProps.value));
        this.setState({ value });
      }
    }

    if ('open' in nextProps) {
      this.setState({
        open: nextProps.open,
      });
    }
  }

  /*
   * 改变value，进行回调
   */
  onValueChange(vals) {
    const value = this.getValue(vals);
    this.sortOutValue(value);
    this.setState({
      value,
    });
  }

  onVisibleChange(open) {
    this.setState({ open });
  }

  getValue(value) {
    this.treeNodesStates = getTreeNodesStates(this.renderedTreeData, value);

    return this.treeNodesStates.checkedNodes;
  }

  getContentDOMNode() {
    return this.refs && this.refs.selection;
  }

  sortOutValue(value) {
    const { showCheckedStrategy } = this.props;
    const showNodes = filterNodesfromStrategy(value, showCheckedStrategy);
    const vals = showNodes.map(item => item.value);

    this.props.onChange(vals, showNodes);
  }

  removeSigleValue(e, node) {
    const { value } = this.state;
    const pos = node.pos;
    const poss = value.map(item => item.pos)
      .filter(item => !(isInherit(pos, item) || pos === item || isInherit(item, pos)));
    const vals = value.filter(item => poss.indexOf(item.pos) > -1)
        .map(item => item.value);
    this.onValueChange(vals);
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

    const showVals = filterNodesfromStrategy(value, showCheckedStrategy);
    let selectedValueNodes = showVals.map((singleValue) => {
      let content = singleValue.label;
      if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
        content = `${content.slice(0, maxTagTextLength)}...`;
      }
      const liCls = {
        [`${prefixCls}-selection-choice`]: true,
        [`${prefixCls}-selection-choice-disabled`]: disabled || singleValue.disabled,
      };

      return (
        <li
          key={singleValue.value}
          style={UNSELECTABLE_STYLE}
          {...UNSELECTABLE_ATTRIBUTE}
          onMouseDown={preventDefaultEvent}
          className={classnames(liCls)}
        >
        {
          disabled || singleValue.disabled ? null :
            <span
              className={`${prefixCls}-selection-choice-remove`}
              onClick={(e) => this.removeSigleValue(e, singleValue)}
            />
        }
          <span className={`${prefixCls}-selection-choice-content`}>{content}</span>
        </li>
      );
    });

    if (value.length === 0) {
      selectedValueNodes = (<li><span className={`${prefixCls}-placeholder`}>
        {i18n[locale].pullDownSelect}
      </span></li>);
    }

    const ulCls = `${prefixCls}-selection-rendered`;

    return (
      <div
        className={classnames(rootCls)}
        role="combobox"
        key="selection"
        ref="selection"
      >
        <Animate
          className={ulCls}
          component="ul"
          transitionName={choiceTransitionName}
        >
          {selectedValueNodes}
        </Animate>


      </div>
    );
  }

  render() {
    const { prefixCls, dropdownMatchSelectWidth, disabled } = this.props;
    const { open } = this.state;

    if (disabled) {
      return this.renderTopControlNode();
    }

    return (
      <Dropdown
        overlay={
          <SelectTrigger
            triggerPrefixCls={prefixCls}
            getContentDOMNode={this.getContentDOMNode}
            dropdownMatchSelectWidth={dropdownMatchSelectWidth}
            treeData={this.renderedTreeData}
            cacheTreeData={this.cacheTreeData} // treeData的缓存
            treeNodesStates={this.treeNodesStates}
            // cacheTreeNodesStates={this.cacheTreeNodesStates} //todo treeNodesStates的缓存
            onChange={this.onValueChange}
            onVisibleChange={this.onVisibleChange}
            {...this.props}
          />
        }
        onVisibleChange={this.onVisibleChange}
        visible={open}
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
  locale: 'en-us',
  onSelect: noop,
  onItemClick: noop,
  dropdownMatchSelectWidth: false,
  showSearch: true,
  allCheckBtn: true,
  resultsPanelAllClearBtn: true,
  resultsPanelTitleStyle: {},
  showCheckedStrategy: SHOW_CHILD,
  isFilterToRpfromSearch: true,
  choiceTransitionName: 'uxcore-cascade-multi-tree-selection__choice-zoom',
  onChange: noop,
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
  onChange: PropTypes.func,
};

CascadeMultiTree.displayName = 'CascadeMultiTree';

module.exports = CascadeMultiTree;
