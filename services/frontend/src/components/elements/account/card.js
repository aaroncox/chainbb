import React from 'react';

import { Card, Image, Popup } from 'semantic-ui-react'
import UserLink from '../../../utils/link/user'
// import TimeAgo from 'react-timeago'

export default class UserAvatar extends React.Component {
  render() {
    let { username } = this.props;
    return (
      <Popup
        hoverable
        basic
        trigger={
          <img
            alt='{username}'
            src={`https://img.steemconnect.com/@${username}?size=35`}
            className="ui rounded floated left mini image"
            style={{
              minHeight: '35px',
              minWidth: '35px'
            }}
          />
        }
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
                <UserLink username={username} />
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
