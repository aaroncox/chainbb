import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Container, Dropdown, Icon, Menu, Popup } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import LoginButton from '../elements/login/button'
import LogoutItem from '../elements/login/logout'

import AccountAvatar from '../elements/account/avatar'
import AccountLink from '../elements/account/link'
import * as statusActions from '../../actions/statusActions'

class HeaderMenu extends Component {
  componentDidMount() {
    if (!this.props.account) {
      this.props.actions.fetchAccount()
    }
  }
  render() {
    const { name, data } = this.props.account
    const { height } = this.props.status.network
    let avatar = false
    let userItem = (
      <Menu.Item>
        <LoginButton {... this.props}/>
      </Menu.Item>
    )
    const indicator = (data) ? (
      <Popup
        trigger={
          <Icon name='checkmark' />
        }
        position='bottom center'
        inverted
        content={`Current Blockchain Height: #${height}`}
        basic
      />
    ) : (
      <Popup
        trigger={
          <Icon loading name='asterisk' />
        }
        position='bottom center'
        inverted
        content={`Connecting to the Steem blockchain`}
        basic
      />
    )
    if (name) {
      avatar = (
        <AccountAvatar
          className=""
          noLink={true}
          size={35}
          style={{margin: 0}}
          username={name}
        />
      )
      const link = <AccountLink noPopup={true} username={name} />
      userItem = (
        <Dropdown style={{padding: '0 1.1em'}} item trigger={avatar} pointing='top right' icon={null} className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item icon="user" content={link} />
            <LogoutItem {...this.props} />
          </Dropdown.Menu>
        </Dropdown>
      )
    }
    return (
      <Menu color='blue' size='large' inverted style={{borderBottom: '3px solid #767676'}}>
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
            {userItem}
            <Menu.Item>
              {indicator}
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    preferences: state.preferences,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenu);
