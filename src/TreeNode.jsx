import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import i18n from './locale';

class TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: props.expand,
    };

    this.onChangeCheck = this.onChangeCheck.bind(this);
    this.expand = this.expand.bind(this);
  }

  onChangeCheck() {
    console.log('checked', !this.props.checked);
  }

  getLabelWidth(paddingLeft) {
    const { width, children, treeCheckable, checked, locale } = this.props;
    const paddindLeftWidth = parseInt(paddingLeft, 10);
    let labelWidth;
    const arrowWidth = children ? 18 : 0;
    if (treeCheckable) {
      // 总宽理论上为238
      // 总宽 - paddingLeft的宽度 - 箭头宽度 - checkbox宽度 - 右边剩余宽度
      labelWidth = `${width - paddindLeftWidth - arrowWidth - 18 - 24}px`;
    } else {
      const isAllWidth = children && checked ? 36 : 0;
      // 英文造成的字体变化
      const localeWidth = locale === 'en-us' ? 36 : 0;
      // 总宽 - paddingLeft的宽度 - 箭头宽度 - 已全选宽度 - 右边剩余宽度
      labelWidth = `${width - paddindLeftWidth - arrowWidth - isAllWidth - 46 - localeWidth}px`;
    }

    return {
      maxWidth: labelWidth,
    };
  }

  expand() {
    this.setState({
      expand: !this.state.expand,
    });
  }

  render() {
    const { expand } = this.state;
    const { label, value, children, prefixCls, disabled, treeCheckable, checked, level } = this.props;
    const treePrefixCls = `${prefixCls}-treeNode`;
    const arrowCls = {
      'kuma-icon-triangle-right': !expand,
      'kuma-icon-triangle-down': expand,
      [`kuma-icon ${treePrefixCls}-arrow`]: true,
    };
    const paddingLeftNum = treeCheckable ? 18 : 13;
    const style = {
      paddingLeft: children ? `${level * 18 + 16}px` : `${16 + level * 18 + paddingLeftNum}px`,
    };

    const labelSpan = (<span
      className={`${treePrefixCls}-label`}
      title={label}
      style={this.getLabelWidth(style.paddingLeft)}
    >
      {label}
    </span>);

    return (
      <div>
        <div style={style} className={treePrefixCls}>
          {
            children &&
              <i
                className={classnames(arrowCls)}
                onClick={this.expand}
              />
          }
          {
            treeCheckable ?
              <label className="kuma-form-text">
                <input
                  className="kuma-checkbox"
                  type="checkbox"
                  checked={checked}
                  onChange={this.onChangeCheck}
                /><s />
                {labelSpan}
              </label> :
              labelSpan
          }
          {
            !treeCheckable && checked && children ?
              <span className={`${treePrefixCls}-allSelect`}>已全选</span> : null
          }
          {
            // !treeCheckable && checked ?
            !treeCheckable ?
              <span
                className={`${treePrefixCls}-clear`}
                onClick={this.removeSelected}
              >删除</span> :
                null
          }
        </div>
        {
          expand && children ? children : null
        }
      </div>
    );
  }
}

TreeNode.propTypes = {
  treeCheckable: PropTypes.bool,
  expand: PropTypes.bool,
  prefixCls: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.element, PropTypes.array,
  ]),
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  level: PropTypes.number,
  width: PropTypes.number,
  locale: PropTypes.string,
};

TreeNode.defaultProps = {
  expand: true,
  treeCheckable: true,
  checked: false,
  level: 0,
  width: 240,
};

export default TreeNode;
