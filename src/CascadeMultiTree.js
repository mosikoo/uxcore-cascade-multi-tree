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

import {
  UNSELECTABLE_STYLE, UNSELECTABLE_ATTRIBUTE, preventDefaultEvent,
} from './utils';

function noop() {}

class CascadeMultiTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: [
        {
          value: 111,
          label: '我是标签1',
        },
        {
          value: 222,
          label: '我的标签2',
        },
        {
          value: 22412,
          label: '我的标签2',
        },

        {
          value: 2223,
          label: '我的标签2',
        },

        {
          value: 2221,
          label: '我的标签2',
        },

      ],
    };
    this.clicktest = this.clicktest.bind(this);
    this.removeSigleValue = this.removeSigleValue.bind(this);
    this.getContentDOMNode = this.getContentDOMNode.bind(this);
  }

  componentDidMount() {

  }

  getContentDOMNode() {
    return this.refs && this.refs.selection;
  }

  clicktest(e) {
    e.stopPropagation();
  }

  removeSigleValue() {

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
  options: {},
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
};


CascadeMultiTree.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  maxTagTextLength: PropTypes.number,
  dropdownClassName: PropTypes.string,
  config: PropTypes.object,
  options: PropTypes.object,
  value: PropTypes.string,
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
};

CascadeMultiTree.displayName = 'CascadeMultiTree';

module.exports = CascadeMultiTree;
