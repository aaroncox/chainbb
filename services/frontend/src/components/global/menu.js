import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Container, Menu } from 'semantic-ui-react'

import * as statusActions from '../../actions/statusActions'

class HeaderMenu extends Component {
  render() {
    const { height } = this.props.status.network
    return (
      <Menu color='blue' inverted style={{borderBottom: '3px solid #767676'}}>
        <Container>
          <Link to='/' className='title active item'>
            <strong>chainBB.com</strong>
          </Link>
          {/*
          <Link to='/' className='title item'>General</Link>
          <Link to='/forums/steem' className='title item'>Steem</Link>
          <Link to='/forums/crypto' className='title item'>Crypto</Link>
          */}
          <Menu.Menu position='right'>
            <a className='item' href='http://blog.chainbb.com'>
              Updates
            </a>
            <a className='item' href='https://steemdb.com' target='_blank'>
              #{height}
            </a>
          </Menu.Menu>
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
