import React from 'react';

import { Button } from 'semantic-ui-react'

export default class ForumSubscribe extends React.Component {
  onSubscribe = (e, data) => {
    this.props.onSubscribe(data.value)
  }
  onUnsubscribe = (e, data) => {
    this.props.onUnsubscribe(data.value)
  }
  render() {
    const { isUser, forum } = this.props
    if(!isUser) return false
    const isSubscribed = (this.props.subscriptions && this.props.subscriptions.hasOwnProperty(forum._id))
    if(isSubscribed) {
      return (
        <Button
          icon='minus circle'
          color='orange'
          content='Unsubscribe'
          onClick={this.onUnsubscribe}
          value={forum}
        />
      )
    }
    return (
      <Button
        icon='plus circle'
        color='blue'
        content='Subscribe'
        onClick={this.onSubscribe}
        value={forum}
      />
    )
  }
}
