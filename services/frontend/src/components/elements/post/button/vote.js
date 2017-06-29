import React from 'react';

import { Button, Popup } from 'semantic-ui-react'
import VoteButtonOptions from './vote/options'

import './vote.css'

export default class VoteButton extends React.Component {
  castVote = (e) => {
    let voter = this.props.account.name,
        author = this.props.post.author,
        permlink = this.props.post.permlink,
        weight = this.props.weight * 100,
        hasVoted = (typeof this.props.post.votes === 'object') ? (this.props.post.votes.hasOwnProperty(voter) && this.props.post.votes[voter] !== 0) : false
    if(hasVoted) {
      this.props.onVoteCast({
        account: this.props.account,
        author: author,
        permlink: permlink,
        weight: 0
      })
    } else {
      this.props.onVoteCast({
        account: this.props.account,
        author: author,
        permlink: permlink,
        weight: weight
      })
    }
  }
  clearError = (e) => {
    this.props.clearVoteError()
  }
  render() {
    let // The loaded data
        account = this.props.account,
        post = this.props.post,
        weight = this.props.weight,
        // Is there an active vote by this account?
        active = (post && typeof post.votes === 'object') ? (post.votes.hasOwnProperty(account.name) && post.votes[account.name] !== 0) : false,
        // -----------------------------
        // Button Properties
        text = 'Vote',
        icon = (this.props.error ? 'warning sign icon' : 'thumbs up' + (!active ? ' outline' : '')),
        onClick = this.props.error ? this.clearError : this.castVote,
        color = (!active ? (this.props.error ? 'red' : 'blue') : 'purple'), // Blue if able to vote, Purple if voted, Red if error
        tooltip = `Click to cast your vote with ${weight}% of your voting power.`,
        adjuster = false,
        // Placeholder button until user is recognized / logged in
        display = (
          <Popup
            trigger={
              <Button floated='left'>
                <i className={"thumbs outline up icon"}></i>
                {text}
              </Button>
            }
            position='bottom center'
            inverted
            content='You must login to vote.'
            basic
          />
        )
    // If we have an active vote, changed text/tooltip and remove adjuster
    if(active) {
      text = `${post.votes[account.name]/100}% Vote Cast`
      tooltip = `Click again to remove your vote.`
      adjuster = false
    }
    // If an error has occured, change text/tooltip, remove adjuster and set active
    if(this.props.error) {
      tooltip = this.props.error + ' - Click to dismiss this error and try again.'
      text = 'Error Voting'
      active = true
    }
    // If an account exists, setup the actual button
    if(this.props.account.isUser) {
      const { voting_power } = this.props.account.data || 10000
      adjuster = (
        <VoteButtonOptions
          account={this.props.account}
          status={this.props.status}
          effectiveness={`${voting_power / 100}%`}
          onWeightChange={this.props.onWeightChange}
          weight={weight}/>
      )
      // Set the display
      display =
      (
        <span>
          <Popup
            trigger={
              <Button
                onClick={onClick}
                loading={this.props.loading}
                disabled={this.props.loading}
                active={active}
                icon={icon}
                color={color}
                floated='left'
                labelPosition='left'
                content={text}
              />
            }
            position='bottom center'
            inverted
            content={tooltip}
            basic
          />
          {adjuster}
        </span>
      )
    }
    return display
  }
}
