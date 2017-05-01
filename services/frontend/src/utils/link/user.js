import React from 'react'

export default class UserLink extends React.Component {
    render() {
      return (<a href={`https://steemit.com/@${this.props.username}`} target='_blank'>@{this.props.username}</a>)
    }
}
