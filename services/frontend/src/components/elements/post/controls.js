import React from 'react';

import { Segment } from 'semantic-ui-react'

import VoteButton from './button/vote'
import VoterAvatars from '../vote/avatars.js'
import VoterList from '../vote/list.js'

export default class PostControls extends React.Component {

  castVote = (payload) => {
    const id = [payload.author, payload.permlink].join("/")
    this.props.actions.setVoteProcessing(id)
    this.props.actions.castVote(payload)
  }

  clearVoteError = (payload) => {
    this.props.actions.clearVoteError(payload)
  }

  render() {
    let data = this.props.post
    let post = this.props.target
    let votes = (post && post.votes) ? post.votes : []
    let accounts = Object.keys(votes).filter((k) => votes[k] !== 0).sort((a,b) => votes[b]-votes[a])
    let extra = accounts.length - 10
    let processing = data.processing
    let voters = (
          <VoterAvatars
            accounts={accounts}
            votes={votes}
          />
        )
    let moreVoters = ''
    if(extra > 0) {
      moreVoters = (
        <VoterList
          count={extra}
          accounts={accounts}
          votes={votes}
        />
      )
    }
    return (
      <Segment basic clearing attached textAlign='right'>
        <VoteButton
          account={this.props.account}
          status={this.props.status}
          post={post}
          loading={(processing.votes.indexOf(post._id) !== -1)}
          error={(processing.errors[post._id] ? processing.errors[post._id] : false)}
          onWeightChange={this.props.actions.setPreference}
          clearVoteError={this.clearVoteError}
          onVoteCast={this.castVote}
          weight={this.props.preferences.votePowerPost} />
        <div className="ui mini images" style={{display: 'inline'}}>
          {voters}
        </div>
        {moreVoters}
      </Segment>
    )
  }
}
