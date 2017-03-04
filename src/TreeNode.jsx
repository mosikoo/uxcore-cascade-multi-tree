import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

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

  expand() {
    this.setState({
      expand: !this.state.expand,
    });
  }

  render() {
    const { expand } = this.state;
    const { label, value, children, prefixCls, disabled, treeCheckable, checked, level } = this.props;
    const treePrefixCls = `${prefixCls}-treeNode`;
console.log(treeCheckable)
    const arrowCls = {
      'kuma-icon-triangle-right': !expand,
      'kuma-icon-triangle-down': expand,
      [`kuma-icon ${treePrefixCls}-arrow`]: true,
    };
    const paddingLeftNum = treeCheckable ? 18 : 13;
    const style = {
      paddingLeft: children ? `${level * 18}px` : `${level * 18 + paddingLeftNum}px`,
    };
    // const style = {
    //   paddingLeft: `${16 + (level -1) * 18}px`,
    // };


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
                <span>{label}</span>
              </label> :
              <span>{label}</span>
          }
          {
            !treeCheckable && checked && children ?
              <span className={`${prefixCls}-allSelect`}>全选</span> : null
          }
        </div>
        {
          expand && children ? children : null
        }
        {
          !treeCheckable && checked ?
            <span className={`${prefixCls}-clear`} onClick={this.removeSelected}>删除</span> : null
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
};

TreeNode.defaultProps = {
  expand: true,
  treeCheckable: true,
  checked: false,
  level: 0,
  width: 240,
};

export default TreeNode;
