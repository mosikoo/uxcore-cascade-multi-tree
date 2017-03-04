import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import assign from 'object-assign';
import TreeNode from './TreeNode';

class SelectTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      allChecked: false,
      value: [],
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onChangeCheckAll = this.onChangeCheckAll.bind(this);
  }

  componentDidMount() {
    const { dropdownMatchSelectWidth, getContentDOMNode } = this.props;

    this.trigger.style.width = dropdownMatchSelectWidth ?
      `${getContentDOMNode().offsetWidth * 2}px` : '480px';
  }

  onChangeInput(e) {
    const searchValue = e.target.value;

    this.setState({
      searchValue,
    });
  }

  onChangeCheckAll() {
    this.setState({
      allChecked: !this.state.allChecked,
    });
  }

  renderTreeBody() {
    return (
      <div>
        {this.treeNodes}
      </div>
    );
  }

  renderTree() {
    const { triggerPrefixCls, showSearch, allCheckBtn, searchPlaceholder } = this.props;
    const { searchValue, allChecked } = this.state;
    const renderTreePrefixCls = `${triggerPrefixCls}-renderTree`;

    const search = !showSearch ? null :
      <div className={`${renderTreePrefixCls}-search`}>
        <input
          className={`${renderTreePrefixCls}-search-field`}
          role="textbox"
          value={searchValue}
          onChange={this.onChangeInput}
          placeholder={searchPlaceholder}
        />
      </div>;

    return (
      <div className={renderTreePrefixCls}>
        {search}
        {
          !allCheckBtn ? null :
            <label className={`${renderTreePrefixCls}-select-all`}>
              <input
                className="kuma-checkbox" type="checkbox"
                checked={allChecked} onChange={this.onChangeCheckAll}
              />
              <s />
              <span>全选</span>
            </label>
        }
        {this.renderTreeBody()}
      </div>
    );
  }

  renderResultsTree() {
    return (
      <div>tree</div>
    );
  }

  renderResultsPanel() {
    const {
      triggerPrefixCls, resultsPanelAllClearBtn,
      resultsPanelTitleStyle, resultsPanelTitle,
    } = this.props;
    const { value } = this.state;
    const renderResultsPanelPrefixCls = `${triggerPrefixCls}-renderResultsPanel`;

    let renderRightDropdownTitle = null;

    if (resultsPanelTitle) {
      renderRightDropdownTitle = (
        <p className={`${renderResultsPanelPrefixCls}-title`} style={resultsPanelTitleStyle}>
          {resultsPanelTitle}
        </p>
      );
    }
    const num = value.length || 0;

    const noContent = (<div
      className={`${renderResultsPanelPrefixCls}-noContent`}
    >
      请从左侧选择
    </div>);
    const clear = (<span
      key="rightDropdownAllclear"
      className={`${renderResultsPanelPrefixCls}-allClear`}
      onClick={this.onResultsPanelAllClear}
    >清空</span>);


    return (
      <div className={`${renderResultsPanelPrefixCls}`}>
        <div>
          <span className={`${renderResultsPanelPrefixCls}-fontS`}>已选择（{num}）</span>
          {resultsPanelAllClearBtn && num ? clear : null}
        </div>
        {renderRightDropdownTitle}
        {num === 0 ? noContent : this.renderResultsTree()}
      </div>
    );
  }

  render() {
    const { triggerPrefixCls, treeData } = this.props;
    let treeNodes;
    console.log(treeData);
    const recursive = (treeDataBak) =>
      treeDataBak.map((treeNode) => {
        const props = assign({}, treeNode);
        props.children = null;
        let ret;
        if (treeNode.children && treeNode.children.length > 0) {
          ret = (<TreeNode {...props} key={props.key}>
              {recursive(treeNode.children)}
          </TreeNode>);
        } else {
          ret = <TreeNode {...props} key={props.key} />;
        }
        return ret;
      });

    if (this.cacheTreeData && this.treeNodes) {
      treeNodes = this.treeNodes;
    } else {
      treeNodes = recursive(treeData);
      this.treeNodes = treeNodes;
    }

    return (
      <div
        ref={(s) => { this.trigger = s; }}
        className={`${triggerPrefixCls}-dropdown`}
      >
        {this.renderTree()}
        {this.renderResultsPanel()}
      </div>
    );
  }
}

SelectTrigger.propTypes = {
  triggerPrefixCls: PropTypes.string,
  dropdownMatchSelectWidth: PropTypes.bool,
  getContentDOMNode: PropTypes.func,
  showSearch: PropTypes.bool,
  allCheckBtn: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  resultsPanelAllClearBtn: PropTypes.bool,
  resultsPanelTitleStyle: PropTypes.object,
  resultsPanelTitle: PropTypes.oneOfType([
    PropTypes.string, PropTypes.node,
  ]),
  treeData: PropTypes.array,
};

export default SelectTrigger;
