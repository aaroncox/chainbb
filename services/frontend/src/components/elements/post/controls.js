import React from 'react';

import { Label, Popup, Segment } from 'semantic-ui-react'

import VoteButton from './button/vote.js'

export default class PostControls extends React.Component {

  castVote = (payload) => {
    const id = [payload.author, payload.permlink].join("/")
    this.props.actions.setVoteProcessing(id)
    this.props.actions.castVote(payload)
  }

  render() {
    let data = this.props.post,
        post = this.props.target,
        votes = (post) ? post.votes : [],
        accounts = Object.keys(votes).filter((k) => votes[k] !== 0).sort((a,b) => votes[b]-votes[a]),
        extra = accounts.length - 10,
        processing = data.processing,
        voters = accounts.slice(0,10).map((account, i) => (
          <a href={`https://steemit.com/@${account}`} target='_blank' key={i}>
            <Popup
              trigger={<img key={i} alt='{account}' src={`https://img.steemconnect.com/@${account}?size=35`} className="ui rounded image" />}
              position='bottom center'
              content={`@${account}`}
            />
          </a>
        )),
        moreVoters = ''
    if(extra > 0) {
      moreVoters = (
        <Popup
          trigger={
            <Label basic size='large' style={{margin: '0 .25rem .5rem .5rem', minHeight: '35px'}}>
              +{extra} more
            </Label>
          }
          position='bottom center'
          hoverable={true}
          wide='very'
          content={accounts.slice(9,-1).map((account, i) => <span key={i}>
            {!!i && ", "}
            <a href={`https://steemit.com/@${account}`} target='_blank' key={i}>
              @{account}
            </a>
          </span>)}
        />
      )
    }
    return (
      <Segment basic clearing attached textAlign='right'>
        <VoteButton
          account={this.props.account}
          post={post}
          loading={(processing.votes.indexOf(post._id) !== -1)}
          error={(processing.errors[post._id] ? processing.errors[post._id] : false)}
          onWeightChange={this.props.actions.setPreference}
          onVoteCast={this.castVote}
          weight={this.props.preferences.votePowerPost} />
        <div className="ui mini images" style={{display: 'inline'}}>
          {voters}
        </div>
        {moreVoters}
        {/*
        <Button.Group basic floated='right'>
          <Button icon='expand'></Button>
        </Button.Group>
        {' '}
        <Button.Group basic floated='right' style={{marginRight: '0.5rem'}}>
          <Button icon='pencil'></Button>
        </Button.Group>
        */}

      </Segment>
    )
  }
}
