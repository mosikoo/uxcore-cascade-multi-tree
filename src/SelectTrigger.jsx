import React, { PropTypes, Component } from 'react';
import assign from 'object-assign';
import TreeNode from './TreeNode';
import { toArray, loopTree, loopTreeNodes,
  flatToHierarchy, filterDulpNodePos, isInherit } from './utils';


class SelectTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      allChecked: false,
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onChangeCheckAll = this.onChangeCheckAll.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.width = props.dropdownMatchSelectWidth ?
      props.getContentDOMNode().offsetWidth : 240;
  }

  componentWillMount() {
    this.treeOriginNodes = this.buildOriginTree();
    console.log(this.treeOriginNodes, 'treeOriginNodes');
  }

  componentDidMount() {
    this.trigger.style.width = `${this.width * 2}px`;
  }

  componentWillReceiveProps(nextProps) {
    if (!(nextProps.cacheTreeData && this.treeOriginNodes)) {
      this.treeOriginNodes = this.buildOriginTree(nextProps);
    }
  }

  /*
   * 构建最原始的tree
   * 其他被渲染树都基于此树
   */

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

  /*
   * 回调改变value
   */
  onValueChange(node, isAdd = false) {
    const { checkedNodes } = this.props.treeNodesStates;
    let vals = checkedNodes.map(item => item.value);
    const pos = node.pos;
    if (isAdd) {
      vals.push(node.value);
    } else {
      const poss = checkedNodes.map(item => item.pos)
        .filter(item => !(isInherit(pos, item) || pos === item || isInherit(item, pos)));
      vals = checkedNodes.filter(item => poss.indexOf(item.pos) > -1)
        .map(item => item.value);
    }

    console.log(vals, 'checkedvals');
    this.props.onChange(vals);
  }

  buildOriginTree(newprops) {
    const propsbak = newprops || this.props;
    const { triggerPrefixCls, locale, treeData } = propsbak;

    const recursive = (treeDataBak) =>
      treeDataBak.map((treeNode) => {
        const props = {
          prefixCls: triggerPrefixCls,
          width: this.width,
          locale,
          onChange: this.onValueChange,
        };
        assign(props, treeNode);
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

    return recursive(treeData);
  }

  processTreeNode(treeNodes, treeCheckable = true) {
    // 传入节点及被选中的位置，和被半选中的位置进行筛选
    const { treeData, treeNodesStates } = this.props;
    const { checkedNodesPos } = treeNodesStates;
    const { searchValue } = this.state;
    let filterPos = [];
    if (!treeCheckable) {
      loopTreeNodes(treeNodes, (node) => {
        const { pos } = node.props;
        if (checkedNodesPos.indexOf(pos) > -1) {
          filterPos.push(pos);
        }
      });
    } else {
      loopTree(treeData, (item) => {
        if (item.label.indexOf(searchValue) > -1) {
          filterPos.push(item.pos);
        }
      });
    }
    if (filterPos.length === 0 || treeNodes.length === 0) {
      return [];
    }

    filterPos = filterDulpNodePos(filterPos);

    // 筛选出祖先
    const ancestorPos = [];
    filterPos.forEach(pos => {
      const posArr = pos.split('-');
      posArr.reduce((pre, cur) => {
        const curPos = `${pre}-${cur}`;
        if (ancestorPos.indexOf(curPos) === -1) {
          ancestorPos.push(curPos);
        }
        return curPos;
      });
    });

    // flag to hierarchy
    const filterNodes = {};
    loopTreeNodes(treeNodes, (node) => {
      const { pos } = node.props;
      if (ancestorPos.indexOf(pos) > -1) {
        filterNodes[pos] = node;
      }
    });

    const hierarchyNodes = flatToHierarchy(filterNodes);

    // compat two models: [{node, pos, children}]/[{ReactElement}]
    const recursive = (nodes) =>
      nodes.map(item => {
        const node = item.node || item;
        const { props } = node;
        const propsbak = assign({}, props, {
          treeCheckable,
          key: props.pos,
        });
        if (item.children) {
          return React.cloneElement(node, propsbak, recursive(item.children));
        } else if (!treeCheckable && props.children && props.children.length > 0) {
          return React.cloneElement(node, propsbak, recursive(props.children));
        }

        return React.cloneElement(node, propsbak);
      });

    return recursive(hierarchyNodes);
  }

  renderTree(treeNodes) {
    const { triggerPrefixCls, showSearch, allCheckBtn, searchPlaceholder } = this.props;
    const { searchValue, allChecked } = this.state;
    const renderTreetriggerPrefixCls = `${triggerPrefixCls}-renderTree`;
    const notFount = (<span>notFount</span>);

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
        <div className={`${renderTreetriggerPrefixCls}-header`}>
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
        </div>
        <div className={`${renderTreetriggerPrefixCls}-body`}>
          {treeNodes.length === 0 ? notFount : treeNodes}
        </div>
      </div>
    );
  }

  renderResultsPanel(treeNodes) {
    const {
      triggerPrefixCls, resultsPanelAllClearBtn,
      resultsPanelTitleStyle, resultsPanelTitle,
      treeNodesStates,
    } = this.props;

    const renderResultsPaneltriggerPrefixCls = `${triggerPrefixCls}-renderResultsPanel`;

    let renderRightDropdownTitle = null;

    if (resultsPanelTitle) {
      renderRightDropdownTitle = (
        <p className={`${renderResultsPaneltriggerPrefixCls}-title`} style={resultsPanelTitleStyle}>
          {resultsPanelTitle}
        </p>
      );
    }
    const num = treeNodesStates.checkedNodesPos.length || 0;

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
        <div className={`${renderResultsPaneltriggerPrefixCls}-header`}>
          <div>
            <span className={`${renderResultsPaneltriggerPrefixCls}-fontS`}>已选择（{num}）</span>
            {resultsPanelAllClearBtn && num ? clear : null}
          </div>
          {renderRightDropdownTitle}
        </div>
        {
          num === 0 ? noContent :
            <div className={`${renderResultsPaneltriggerPrefixCls}-body`}>
              {treeNodes}
            </div>
        }
      </div>
    );
  }

  render() {
    const { triggerPrefixCls, treeNodesStates, isFilterToRpfromSearch } = this.props;
    const { searchValue } = this.state;
    const { checkedNodesPos, halfCheckedNodes } = treeNodesStates;
    let treeNodes;

    const recursive = children =>
      toArray(children).map((child) => {
        const props = assign({}, child.props);
        if (checkedNodesPos.indexOf(props.pos) > -1) {
          props.checked = true;
        } else if (halfCheckedNodes.indexOf(props.pos) > -1) {
          props.halfChecked = true;
        }
        if (child.props.children) {
          return React.cloneElement(child, props, recursive(child.props.children));
        }

        return React.cloneElement(child, props);
      });

    // 加缓存 -> 计算基本树 带checked和origin
    this.treeNodes = recursive(this.treeOriginNodes);
    treeNodes = this.treeNodes;

    if (searchValue) {
      // 加缓存 // 带搜索结果
      treeNodes = this.processTreeNode(this.treeNodes);
    }

    // 加缓存 结果面板部分
    const resultPanelTreeNodes = isFilterToRpfromSearch ?
      this.processTreeNode(treeNodes, false) :
      this.processTreeNode(this.treeNodes, false);

    return (
      <div
        ref={(s) => { this.trigger = s; }}
        className={`${triggerPrefixCls}-dropdown`}
      >
        {this.renderTree(treeNodes)}
        {this.renderResultsPanel(resultPanelTreeNodes)}
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
  locale: PropTypes.string,
  treeNodesStates: PropTypes.object,
  isFilterToRpfromSearch: PropTypes.bool,
  onChange: PropTypes.func,
};

export default SelectTrigger;
