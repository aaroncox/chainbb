import React from 'react';

import { Card, Image, Popup } from 'semantic-ui-react'
import AccountCard from './card'

export default class AccountLink extends React.Component {
  render() {
    let { username } = this.props;
    return (
      <AccountCard
        username={username}
        trigger={
          <a
            href={`https://steemit.com/@${username}`}
            target='_blank'
          >
            @{username}
          </a>
        }
      />
    )
  }
}
