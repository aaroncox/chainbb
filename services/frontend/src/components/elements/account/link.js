import React from 'react';

import { Card, Image, Popup } from 'semantic-ui-react'
import AccountCard from './card'

export default class AccountLink extends React.Component {
  render() {
    const { username, noPopup } = this.props;
    const link = (
      <a
        href={`https://steemit.com/@${username}`}
        target='_blank'
      >
        @{username}
      </a>
    );
    if (noPopup) return link;
    return (
      <AccountCard
        username={username}
        trigger={link}
      />
    )
  }
}
