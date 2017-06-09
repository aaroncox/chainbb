import React from 'react'
import { Dropdown } from 'semantic-ui-react'

export default class LogoutItem extends React.Component {
  logout = (e) => {
    this.props.actions.signoutAccount()
  }
  render() {
    return (
      <Dropdown.Item
        color='orange'
        size='mini'
        icon='sign out'
        onClick={this.logout}
        content='Sign out'
      />
    )
  }
}
