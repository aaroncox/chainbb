
import React from 'react';
import { Link } from 'react-router-dom'

import { Grid, Header, Segment } from 'semantic-ui-react'

import AccountLink from '../account/link'
import ForumSubscribe from './subscribe'

export default class ForumTitle extends React.Component {
  render() {
    let { attached, forum } = this.props
    let tags = false
    let parent = false
    let subheader = false
    if(forum.parent) {
      parent = (
        <Header.Subheader style={{marginTop: '0.25em'}}>
          Child of
          {' '}
          <Link to={`/forum/${forum.parent}`}>
            {forum.parent_name}
          </Link>
        </Header.Subheader>
      )
    }
    if(forum.tags) {
      tags = (
        <Header.Subheader style={{marginTop: '0.25em'}}>
          {' ↳ '}
          {forum.tags.map((tag, i) => <span key={i}>
            {' '}
            <Link to={`/topic/${tag}`}>
              #{tag}
            </Link>
          </span>)}
        </Header.Subheader>
      )
    }
    subheader = (
      <div>
        <Header.Subheader>
          {forum.description}
        </Header.Subheader>
        {parent}
        {tags}
      </div>
    )

    return (
      <Segment attached={attached} color="blue">
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header
                size='huge'
                key={forum._id}
                content={forum.name}
                subheader={subheader}
              />
            </Grid.Column>
            <Grid.Column width={4} textAlign="right">
              <ForumSubscribe
                forum={forum}
                isUser={this.props.account.isUser}
                subscriptions={this.props.subscriptions.forums}
                onSubscribe={this.props.actions.forumSubscribe}
                onUnsubscribe={this.props.actions.forumUnsubscribe}
              />
              <p>
                Managed by
                {' '}
                <AccountLink username='chainbb' />
                {' '}
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
