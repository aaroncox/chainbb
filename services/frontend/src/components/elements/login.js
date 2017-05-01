import React from 'react'
import { Button, Divider, List, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import UserLink from '../../utils/link/user'
import LoginModal from './login/modal'

class LoginButton extends React.Component {
  render() {
    return (
      <LoginModal {... this.props} />
    )
  }
}

class LogoutButton extends React.Component {
  logout = (e) => {
    this.props.actions.signoutAccount()
  }
  render() {
    return (
      <Button color='orange' size='mini' onClick={this.logout}>Sign-out</Button>
    )
  }
}

const Login = (props) => {

  let account = props.account
  let display = (
    <div>
      <Segment secondary attached='top'>
        <h4>Greetings Steemian!</h4>
      </Segment>
      <Segment attached>
        <p>If you have an account on the Steem blockchain, hit the login button below.</p>
        <LoginButton {... props} />
        {/*
        <Button fluid disabled>Currently Disabled</Button>
        */}
      </Segment>
    </div>
  )

  if(account.isUser) {
    display = (
      <div>
        <Segment secondary attached='top'>
          <h3>
            Welcome
            {' '}
            <UserLink username={account.name} />!
          </h3>
        </Segment>
        <Segment attached>
          <p>Account details and management can be found off-site using one of the following websites.</p>
          <List>
            <List.Item>
              <List.Icon name='external'/>
              <List.Content>
                <List.Header>steemit.com</List.Header>
                <List bulleted>
                  <List.Item>
                    <Link to={`https://steemit.com/@${account.name}`} rel='nofollow' target='_blank'>
                      Manage Account
                    </Link>
                  </List.Item>
                  <List.Item>
                    <Link to={`https://steemit.com/@${account.name}/settings`} rel='nofollow' target='_blank'>
                      Edit Profile
                    </Link>
                  </List.Item>
                  <List.Item>
                    <Link to={`https://steemit.com/@${account.name}/transfers`} rel='nofollow' target='_blank'>
                      Wallet
                    </Link>
                  </List.Item>
                </List>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name='external'/>
              <List.Content>
                <List.Header>steemdb.com</List.Header>
                <List bulleted>
                  <List.Item>
                    <Link to={`https://steemdb.com/@${account.name}`} rel='nofollow' target='_blank'>
                      Recent History
                    </Link>
                  </List.Item>
                </List>
              </List.Content>
            </List.Item>
          </List>
          <Divider></Divider>
          <LogoutButton {... props} />
        </Segment>
      </div>
    )
  }

  return display

}

export default Login;
