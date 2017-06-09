import React from 'react'
import { Button, Divider, Icon, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import AccountLink from './account/link'
import LoginButton from './login/button'

class LogoutButton extends React.Component {
  logout = (e) => {
    this.props.actions.signoutAccount()
  }
  render() {
    return (
      <Button color='orange' inverted floated='right' size='mini' onClick={this.logout}>Sign-out</Button>
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
        <p>If you have an account on the Steem blockchain, hit the sign-in button below.</p>
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
            <AccountLink username={account.name} />!
          </h3>
        </Segment>
        <Segment attached>
          <p>Currently, account details and management can be found on steemit.com using the button below.</p>
          <Divider></Divider>
          <Link to={`https://steemit.com/@${account.name}`} rel='nofollow' target='_blank' className='ui primary icon mini button'>
            <Icon name='external'></Icon>
            {' '}
            Manage Account
          </Link>
          <LogoutButton {... props} />
        </Segment>
      </div>
    )
  }

  return display

}

export default Login;
