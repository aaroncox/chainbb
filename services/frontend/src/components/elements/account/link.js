import React from 'react';

import AccountCard from '../../../containers/account/card'

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
