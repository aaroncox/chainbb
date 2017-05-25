import React from 'react';

import { Card, Image, Popup } from 'semantic-ui-react'
import AccountCard from './card'
import AccountLink from './link'
// import TimeAgo from 'react-timeago'

export default class AccountAvatar extends React.Component {
  render() {
    const { username } = this.props;
    const size = this.props.size || 35;
    const style = this.props.style || { minHeight: `${size}px`, minWidth: `${size}px` };
    const className = this.props.className || "ui rounded floated left mini image";
    return (
      <AccountCard
        username={username}
        trigger={
          <img
            alt='{username}'
            src={`https://img.steemconnect.com/@${username}?size=${size}`}
            className={className}
            style={style}
          />
        }
      />
    )
  }
}
