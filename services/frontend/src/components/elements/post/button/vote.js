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
  render() {
    let // The loaded data
        account = this.props.account,
        post = this.props.post,
        weight = this.props.weight,
        // Is there an active vote by this account?
        active = (post && typeof post.votes === 'object') ? (post.votes.hasOwnProperty(account.name) && post.votes[account.name] !== 0) : false,
        // -----------------------------
        // Button Properties
        text = 'Vote ',
        icon = (this.props.error ? "warning sign icon" : "thumbs " + (!active ? 'outline' : '') + " up icon"),
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
      text = `${post.votes[account.name]/100}% Vote Applied`
      tooltip = `Click again to remove your vote.`
      adjuster = false
    }
    // If an error has occured, change text/tooltip, remove adjuster and set active
    if(this.props.error) {
      tooltip = this.props.error
      text = 'Error Voting'
      adjuster = false
      active = true
    }
    // If an account exists, setup the actual button
    if(this.props.account.isUser) {
      // If it isn't an active vote, add the adjuster
      if(!active) {
        const { voting_power } = this.props.account.data || 10000
        adjuster = (
          <VoteButtonOptions
            effectiveness={`${voting_power / 100}%`}
            onWeightChange={this.props.onWeightChange}
            weight={weight}/>
        )
      }
      // Set the display
      display =
      (
        <Button.Group floated='left' color={color} >
          <Popup
            trigger={
              <Button onClick={this.castVote} loading={this.props.loading} disabled={this.props.loading} active={active}>
                <i className={icon}></i>
                {text}
                {(!active && !this.props.error ? ` (${weight}%)` : '')}
              </Button>
            }
            position='bottom center'
            inverted
            content={tooltip}
            basic
          />
          {adjuster}
        </Button.Group>
      )
    }
    return display
  }
}
