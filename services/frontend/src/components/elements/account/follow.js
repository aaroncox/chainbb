import React from 'react';

import { Button } from 'semantic-ui-react'

export default class AccountFollow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      processing: false,
      following: props.account.following || []
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.processing && nextProps.length !== this.state.following.length) {
      this.setState({processing: false})
    }
  }
  follow = (e) => {
    this.setState({processing: true})
    this.props.actions.follow({
      account: this.props.account,
      action: "follow",
      who: this.props.who
    })
  }
  unfollow = (e) => {
    this.setState({processing: true})
    this.props.actions.follow({
      account: this.props.account,
      action: "unfollow",
      who: this.props.who
    })
  }
  render() {
    if(this.props.account.name === this.props.who || !this.props.account.isUser) return false
    const loading = (this.state.processing || !this.props.account || !this.props.account.following)
    const following = (this.props.account.following && this.props.account.following.indexOf(this.props.who) !== -1)
    return (
      <Button
        color={(loading) ? 'grey' : (following) ? 'orange' : 'green' }
        content={(following) ? 'Unfollow' : 'Follow'}
        loading={loading}
        onClick={(loading) ? () => {} : (following) ? this.unfollow : this.follow}
      />
    )
  }
}
