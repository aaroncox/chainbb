import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import UserLink from '../../../utils/link/user'
import Paginator from './post/paginator'

export default class ForumHeader extends React.Component {
  render() {
    let {topic} = this.props,
        paginator = false,
        last_reply = (
          <Grid.Column tablet={4} computer={4} mobile={8} textAlign="center">
            No Replies
          </Grid.Column>
        )
    if(topic.children > 10) {
      paginator = (
        <Paginator
          perPage={10}
          total={topic.children}
          url={topic.url}
        />
      )
    }
    if(topic.last_reply) {
      last_reply = (
        <Grid.Column tablet={4} computer={4} mobile={8}>
          <img alt='{topic.last_reply_by}' src={`https://img.steemconnect.com/@${topic.last_reply_by}?size=35`} className="ui rounded floated left mini image" style={{minHeight: '35px', minWidth: '35px', marginBottom: 0}}/>
          <UserLink username={topic.last_reply_by} />
          <br/>
          <TimeAgo date={`${topic.last_reply}Z`} />
        </Grid.Column>
      )
    }
    return (
      <Segment attached key={topic._id}>
        <Grid>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column tablet={10} computer={10} mobile={8}>
              <Header size='small'>
                <Link to={`${topic.url}`}>
                  {topic.title}
                </Link>
                <Header.Subheader>
                  {'↳ '}
                  <TimeAgo date={`${topic.created}Z`} />
                  {' • '}
                  <UserLink username={topic.author} />
                  {paginator}
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column width={2} only='large screen' className="center aligned">
              <Header size='small'>
                {topic.children}
              </Header>
            </Grid.Column>
            {last_reply}
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
