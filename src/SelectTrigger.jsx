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
    const { triggerPrefixCls, showSearch, allCheckBtn } = this.props;
    const { searchValue, allChecked } = this.state;
    const renderTreePrefixCls = `${triggerPrefixCls}-renderTree`;

    const search = !showSearch ? null :
      <span className={`${renderTreePrefixCls}-search`}>
        <input
          className={`${renderTreePrefixCls}-search-field`}
          role="textbox"
          value={searchValue}
          onChange={this.onChangeInput}
        />
      </span>;

    return (
      <div className={renderTreePrefixCls}>
        {search}
        {
          !allCheckBtn ? null :
            <label className="kuma-form-text">
              <input
                className="kuma-checkbox" type="checkbox"
                checked={allChecked} onChange={this.onChangeCheckAll}
              />
              <s />
              全选
            </label>
        }
      </div>
    );
  }

  renderResultsPanel() {
    const { triggerPrefixCls } = this.props;

    return (
      <div className={`${triggerPrefixCls}-renderResultsPanel`}>
        renderResultsPanel
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
};

export default SelectTrigger;
