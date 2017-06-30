import React from 'react';

import { Divider, Dropdown, Header, Icon, Menu, Segment } from 'semantic-ui-react'
import AccountAvatar from './avatar'
import AccountFollow from './follow'
import AccountLink from './link'
import AccountSidebarInfo from './sidebar/info'

export default class AccountSidebar extends React.Component {
  constructor(props) {
    super(props)
    const { username } = props.match.params;
    this.state = { username }
    props.actions.getState("@" + username);
  }
  componentWillReceiveProps(nextProps) {
    const { username } = nextProps.match.params;
    if(username !== this.state.username) {
      this.setState({username});
      nextProps.actions.getState("@" + username);
    }
  }
  render() {
    const { username } = this.state;
    let sidebar = <Segment padded="very" loading />
    if(this.props.state && this.props.state.accounts && this.props.state.accounts[username]) {
      sidebar = <AccountSidebarInfo {...this.props} />
    }
    return (
      <div>
        <Segment basic className="thread-author center aligned">
          <AccountAvatar
            className="ui centered spaced rounded image"
            noPopup={true}
            size={150}
            username={username}
          />
          <Header size='large'>
            <AccountLink
              noPopup={true}
              username={username}
            />
          </Header>
          <AccountFollow
            who={this.props.match.params.username}
            {...this.props}
          />
        </Segment>
        <Divider horizontal>Account Info</Divider>
        <Menu color='blue' inverted fluid vertical>
          <Dropdown color='blue' text='View this account on...' size='small' pointing='left' className='link item'>
            <Dropdown.Menu>
              <a href={`https://steemit.com/@${username}`} target='_blank' className='item'>
                <Icon name='external' />
                steemit.com
              </a>
              <a href={`https://busy.org/@${username}`} target='_blank' className='item'>
                <Icon name='external' />
                busy.org
              </a>
              <a href={`https://steemdb.com/@${username}`} target='_blank' className='item'>
                <Icon name='external' />
                steemdb.com
              </a>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
        {sidebar}
      </div>
    )
  }
}
