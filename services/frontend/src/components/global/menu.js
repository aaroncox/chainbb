import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Container, Menu } from 'semantic-ui-react'

import * as GLOBAL from '../../global';
import * as statusActions from '../../actions/statusActions'

class HeaderMenu extends Component {
  render() {
    const { height } = this.props.status
    return (
      <Menu color='blue' inverted>
        <Container>
          <Link to='/' className='title active item'>
            <strong>chainBB.com</strong>
          </Link>
          <Link to='/' className='title item'>General</Link>
          <Link to='/' className='title item'>Crypto</Link>
          <Menu.Item position='right'>
            <a href='https://steemdb.com' target='_blank'>
              Block Height: {height}
            </a>
          </Menu.Item>
        </Container>
      </Menu>
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    preferences: state.preferences,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenu);
