import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RoundedInputField from 'Src/modules/RoundedInputField';
import './keywordSelector.scss';

class KeywordSelector extends Component {
  static propTypes = {
    searchKeyword: PropTypes.func.isRequired,
    clearKeywords: PropTypes.func.isRequired,
    selectKeyword: PropTypes.func.isRequired,
    deselectKeyword: PropTypes.func.isRequired,
    keywords: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    createKeyword: PropTypes.func.isRequired,
    preventAddition: PropTypes.bool
  };

  state = {
    term: ''
  };

  componentWillUnmount() {
    this.props.clearKeywords();
  }

  onChange = e => {
    this.setState({ term: e.target.value });
    if (e.target.value !== '') this.props.searchKeyword(e.target.value);
  };

  onClick = () => {
    this.props.createKeyword(this.state.term);
    this.setState({ term: '' });
  };

  render() {
    return (
      <div className="keyword-selector">
        Selected keywords:
        <div className="selected">
          {this.props.selected.length > 0 ? (
            this.props.selected.map((keyword, i) => (
              <button
                onClick={() => this.props.deselectKeyword(keyword)}
                key={`selected_keyword_${i}`}
              >
                {keyword.text}
              </button>
            ))
          ) : (
            <span className="message">None</span>
          )}
        </div>
        <RoundedInputField
          ref={search => (this.search = search)}
          value={this.state.term}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              e.preventDefault();
              this.onClick();
            }
          }}
          onChange={this.onChange}
          placeholder="Search for keywords to add..."
        />
        {!this.props.preventAddition && (
          <div className="add">
            {this.state.term !== '' && (
              <button onClick={this.onClick}>Add</button>
            )}
          </div>
        )}
        <div className="suggestions">
          {this.state.term !== '' &&
            this.props.keywords
              .filter(
                keyword =>
                  !(
                    this.props.selected.filter(
                      selected => selected.text === keyword.text
                    ).length > 0
                  )
              )
              .map((keyword, i) => (
                <button
                  onClick={() => {
                    this.props.selectKeyword(keyword);
                    this.setState({ term: '' });
                    this.search.input.focus();
                  }}
                  key={`keyword_${i}`}
                >
                  {keyword.text}
                </button>
              ))}
        </div>
      </div>
    );
  }
}

export default KeywordSelector;