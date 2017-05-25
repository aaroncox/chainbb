import React from 'react';

import { Card, Image, Popup } from 'semantic-ui-react'
import AccountLink from './link'
// import TimeAgo from 'react-timeago'

export default class AccountCard extends React.Component {
  render() {
    let { username, trigger } = this.props;
    return (
      <Popup
        hoverable
        basic
        trigger={trigger}
        content={
          <Card>
            <Image
              src={`https://img.steemconnect.com/@${username}?size=290`}
              style={{
                minHeight: '290px',
                minWidth: '290px'
              }}
            />
            <Card.Content>
              <Card.Header>
                <AccountLink username={username} />
              </Card.Header>
            </Card.Content>
          </Card>
        }
        style={{
          background: 'transparent',
          padding: 0
        }}
      />

    )
  }
}
