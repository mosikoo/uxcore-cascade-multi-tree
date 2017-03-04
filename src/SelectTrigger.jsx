import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import assign from 'object-assign';
import TreeNode from './TreeNode';

class SelectTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      allChecked: false,
      value: [1],
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onChangeCheckAll = this.onChangeCheckAll.bind(this);

    this.width = props.dropdownMatchSelectWidth ?
      props.getContentDOMNode().offsetWidth : 240;
  }

  componentDidMount() {
    this.trigger.style.width = `${this.width * 2}px`;
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
    const renderTreetriggerPrefixCls = `${triggerPrefixCls}-renderTree`;

    const search = !showSearch ? null :
      <div className={`${renderTreetriggerPrefixCls}-search`}>
        <input
          className={`${renderTreetriggerPrefixCls}-search-field`}
          role="textbox"
          value={searchValue}
          onChange={this.onChangeInput}
          placeholder={searchPlaceholder}
        />
      </div>;

    return (
      <div className={renderTreetriggerPrefixCls}>
        {search}
        {
          !allCheckBtn ? null :
            <label className={`${renderTreetriggerPrefixCls}-select-all`}>
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
      <div>{this.treeNodes1}</div>
    );
  }

  renderResultsPanel() {
    const {
      triggerPrefixCls, resultsPanelAllClearBtn,
      resultsPanelTitleStyle, resultsPanelTitle,
    } = this.props;
    const { value } = this.state;
    const renderResultsPaneltriggerPrefixCls = `${triggerPrefixCls}-renderResultsPanel`;

    let renderRightDropdownTitle = null;

    if (resultsPanelTitle) {
      renderRightDropdownTitle = (
        <p className={`${renderResultsPaneltriggerPrefixCls}-title`} style={resultsPanelTitleStyle}>
          {resultsPanelTitle}
        </p>
      );
    }
    const num = value.length || 0;

    const noContent = (<div
      className={`${renderResultsPaneltriggerPrefixCls}-noContent`}
    >
      请从左侧选择
    </div>);
    const clear = (<span
      key="rightDropdownAllclear"
      className={`${renderResultsPaneltriggerPrefixCls}-allClear`}
      onClick={this.onResultsPanelAllClear}
    >清空</span>);


    return (
      <div className={`${renderResultsPaneltriggerPrefixCls}`}>
        <div>
          <span className={`${renderResultsPaneltriggerPrefixCls}-fontS`}>已选择（{num}）</span>
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
    const recursive = (treeDataBak, checked = true) =>
      treeDataBak.map((treeNode) => {
        const props = {
          prefixCls: triggerPrefixCls,
          width: this.width,
          treeCheckable: checked,
        };
        assign(props, treeNode);
        props.children = null;

        let ret;
        if (treeNode.children && treeNode.children.length > 0) {
          ret = (<TreeNode {...props} key={props.key}>
              {recursive(treeNode.children, checked)}
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

    // todo 
    this.treeNodes1 = recursive(treeData, false);

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
