import React from 'react';
import PropTypes from 'prop-types'
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { debounce } from 'lodash'

import { Search } from 'semantic-ui-react'

import * as searchActions from '../actions/searchActions'

const resultRenderer = ({ id, title, description }) => {
  return (
    <div key={id} className='content'>
      <div className='title'>
        {title}
      </div>
    </div>
  )
}

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

class SearchBox extends React.Component {
  componentWillMount() {
    this.resetComponent()
    this.search = debounce(this.props.actions.search, 400)
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, result) => {
    this.setState({ redirect: result.description })
    this.resetComponent()
  }

  handleSearchChange = (e, value) => {
    this.props.actions.searchBegin()
    this.search(value)
  }

  render() {
    const { isLoading, results } = this.props.search
    if(this.state.redirect) {
      this.setState({ redirect: false })
      return <Redirect to={this.state.redirect} />
    }
    return (
      <Search
        style={{'float': 'right'}}
        fluid={true}
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        resultRenderer={resultRenderer}
        results={results}
        size='mini'
      />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    search: state.search
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(searchActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
