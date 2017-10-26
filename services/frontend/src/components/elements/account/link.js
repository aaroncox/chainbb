import React from 'react';
import { Link } from 'react-router-dom'

import AccountCard from '../../../containers/account/card'

export default class AccountLink extends React.Component {
  render() {
    const { color, username, noPopup } = this.props;
    const content = this.props.content || `@${username}`
    const link = (
      <Link to={`/@${username}`} style={{color}}>
        {content}
      </Link>
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
