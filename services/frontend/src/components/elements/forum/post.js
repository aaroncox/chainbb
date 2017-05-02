import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import UserLink from '../../../utils/link/user'

export default class ForumHeader extends React.Component {
  render() {
    let {topic} = this.props,
        last_reply = (
          <Grid.Column width={4}>
            No Replies
          </Grid.Column>
        )
    if(topic.last_reply) {
      last_reply = (
        <Grid.Column width={4}>
          <img alt='{topic.last_reply_by}' src={`https://img.steemconnect.com/@${topic.last_reply_by}?size=35`} className="ui rounded floated left mini image" style={{minHeight: '35px', minWidth: '35px'}}/>
          <UserLink username={topic.last_reply_by} />
          <br/>
          <TimeAgo date={`${topic.last_reply}Z`} />
        </Grid.Column>
      )
    }
    return (
      <Segment attached key={topic._id}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={10}>
              <Header size='medium'>
                <Link to={`${topic.url}`}>
                  {topic.title}
                </Link>
                <Header.Subheader>
                  {'↳ '}
                  <UserLink username={topic.author} />
                  {' • '}
                  posted <TimeAgo date={`${topic.created}Z`} />
                </Header.Subheader>
              </Header>
            </Grid.Column>
            {last_reply}
            <Grid.Column width={2} only='large screen' className="center aligned">
              {topic.children}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
