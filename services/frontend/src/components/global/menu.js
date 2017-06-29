import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Button, Container, Dropdown, Header, Icon, Menu, Popup, Segment, Table } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import LoginButton from '../elements/login/button'
import LogoutItem from '../elements/login/logout'

import AccountAvatar from '../elements/account/avatar'
import * as statusActions from '../../actions/statusActions'

class HeaderMenu extends Component {
  state = {
    isClaiming: false,
    hasBalance: false
  }
  componentDidMount() {
    if (!this.props.account) {
      this.props.actions.fetchAccount()
    }
    this.interval = setInterval(() => this.props.actions.fetchAccount(), 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.account && nextProps.account.data) {
      const { data } = nextProps.account
      const fields = [
        'reward_sbd_balance',
        'reward_steem_balance',
        'reward_vesting_balance'
      ];
      const hasBalance = fields.filter((field) => {
        return (parseFloat(data[field].split(" ")[0]) > 0)
      })
      this.setState({hasBalance, isClaiming: false});
    }
  }
  handleClaim = () => {
    const account = this.props.account
    const data = account.data
    const reward_sbd = data.reward_sbd_balance;
    const reward_steem = data.reward_steem_balance;
    const reward_vests = data.reward_vesting_balance;
    this.setState({isClaiming: true})
    this.props.actions.claimRewards({ account, reward_sbd, reward_steem, reward_vests });
  }
  render() {
    const { data, loading, name } = this.props.account
    const { height } = this.props.status.network
    const { isClaiming, hasBalance } = this.state
    let avatar = false
    let pendingBalance = false
    let userItem = (
      <Menu.Item>
        <LoginButton {... this.props}/>
      </Menu.Item>
    )
    const indicator = (!loading) ? (
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
      userItem = (
        <Dropdown style={{padding: '0 1.1em'}} item trigger={avatar} pointing='top right' icon={null} className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item as="a" href={`/@${name}`} icon="user" content={name} />
            <LogoutItem {...this.props} />
          </Dropdown.Menu>
        </Dropdown>
      )
      if(data) {
        if(hasBalance.length > 0) {
          pendingBalance = (
            <Popup
              trigger={
                <Menu.Item style={{padding: '0 1.1em'}}>
                  <Icon name='gift' size='big' style={{margin: 0}} />
                </Menu.Item>
              }
              flowing
              hoverable
            >
              <Segment basic>
                <Header>
                  Rewards
                  <Header.Subheader>
                    You have pending rewards!
                  </Header.Subheader>
                </Header>
                <Table definition>
                  <Table.Body>
                    {hasBalance.map((field) => {
                      const symbol = field.split("_")[1]
                      return (
                        <Table.Row key={symbol}>
                          <Table.Cell>
                            {symbol}
                          </Table.Cell>
                          <Table.Cell>
                            {data[field]}
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
                <Button color='purple' fluid size='small' onClick={this.handleClaim} loading={isClaiming}>
                  Claim Rewards
                </Button>
              </Segment>
            </Popup>
          )
        }
      }
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
            {pendingBalance}
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
