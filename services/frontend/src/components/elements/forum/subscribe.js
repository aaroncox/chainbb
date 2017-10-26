import React from 'react';

import { Button, Popup } from 'semantic-ui-react'

export default class ForumSubscribe extends React.Component {
  onSubscribe = () => this.props.onSubscribe(this.props.forum)
  onUnsubscribe = () => this.props.onUnsubscribe(this.props.forum)
  render() {
    const { isUser, forum } = this.props
    if(!isUser) return false
    const isSubscribed = (this.props.subscriptions && this.props.subscriptions.hasOwnProperty((forum) ? forum._id : false))
    if(isSubscribed) {
      return (
          <Popup
            trigger={
                <Button
                    icon='checkmark'
                    color='green'
                    size='tiny'
                    onClick={this.onUnsubscribe}
                />
            }
            content='You are subscribed to this forum. Click to unsubscribe.'
            inverted
          />
      )
    }
    return (
        <Popup
          trigger={
              <Button
                icon='plus circle'
                color='blue'
                size='tiny'
                onClick={this.onSubscribe}
              />
          }
          content='Subscribe to this forum.'
          inverted
        />
    )
  }
}
