import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

class SelectTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      allChecked: false,
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
      </div>
    );
  }

  renderResultsPanel() {
    const { triggerPrefixCls, resultsPanelAllClearBtn } = this.props;
    const renderResultsPanelPrefixCls = `${triggerPrefixCls}-renderResultsPanel`;

    let renderRightDropdownTitle = null;

    if (resultsPanelTitle) {
      renderRightDropdownTitle = (
        <p className={`${resultsPanelPrefixCls}-title`} style={resultsPanelTitleStyle}>
          {resultsPanelTitle}
        </p>
      );
    }
    const num = value.length || 0;

    const noContent = (<div
      className={`${resultsPanelPrefixCls}-noContent`}
    >
      请从左侧选择
    </div>);
    const clear = (<span
      key="rightDropdownAllclear"
      className={`${resultsPanelPrefixCls}-allClear`}
      onClick={this.onResultsPanelAllClear}
    >清空</span>);


    return (
      <div className={`${renderResultsPanelPrefixCls}`}>
        <div>
          <span className={`${renderResultsPanelPrefixCls}-fontS`}>已选择（{num}）</span>
          {resultsPanelAllClearBtn && num ? clear : null}
        </div>
        {renderRightDropdownTitle}
      </div>
    );
  }

  render() {
    const { triggerPrefixCls } = this.props;

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
};

export default SelectTrigger;
