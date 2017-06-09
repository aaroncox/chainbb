import React from 'react';

import { Image } from 'semantic-ui-react'
import AccountLink from './link'

export default class AccountAvatar extends React.Component {
  render() {
    const { username, noPopup, noLink } = this.props;
    const size = this.props.size || 35;
    const style = this.props.style || { minHeight: `${size}px`, minWidth: `${size}px` };
    const className = this.props.className || "ui rounded floated left mini image";
    const image = (
      <Image
        alt='{username}'
        bordered={false}
        className={className}
        src={`https://img.steemconnect.com/@${username}?size=${size}`}
        style={style}
      />
    )
    if(noLink) return image
    return (
      <AccountLink
        username={username}
        noPopup={noPopup}
        content={image}
      />
    )
  }
}
