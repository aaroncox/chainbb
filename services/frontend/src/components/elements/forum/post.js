import React from 'react';

import { Grid, Header, Icon, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import AccountAvatar from '../account/avatar'
import AccountLink from '../account/link'
import Paginator from './post/paginator'

export default class ForumPost extends React.Component {
  render() {
    let {topic} = this.props,
        paginator = false,
        last_reply = (
          <Grid.Column mobile={6} tablet={6} computer={5} largeScreen={4} textAlign="center">
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
        <Grid.Column mobile={6} tablet={6} computer={4} largeScreen={4} widescreen={4}>
          <AccountAvatar
            username={topic.last_reply_by}
            style={{minHeight: '35px', minWidth: '35px', marginBottom: 0}}
          />
          <AccountLink username={topic.last_reply_by} />
          <br/>
          {(topic.last_reply_url)
            ? (
              <Link to={topic.last_reply_url}>
                <TimeAgo date={`${topic.last_reply}Z`} />
              </Link>
            )
            : (
              <TimeAgo date={`${topic.last_reply}Z`} />
            )
          }
        </Grid.Column>
      )
    }
    return (
      <Segment attached key={topic._id}>
        <Grid>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={1} className="center aligned tablet or lower hidden">
              {(topic.cbb && topic.cbb.sticky)
                ? <Icon size='large' name='pin' />
                : (topic.children > 50)
                ? <Icon color='blue' size='large' name='chevron right' />
                : (topic.children > 20)
                ? <Icon color='blue' size='large' name='angle double right' />
                : (topic.children > 0)
                ? <Icon color='blue' size='large' name='angle right' />
                : <Icon />
              }
            </Grid.Column>
            <Grid.Column mobile={10} tablet={10} computer={9} largeScreen={9}>
              <Header size='small'>
                <Header.Content>
                  <Link to={`${topic.url}`}>
                    {topic.title}
                  </Link>
                  <Header.Subheader>
                    {'↳ '}
                    <TimeAgo date={`${topic.created}Z`} />
                    {' • '}
                    <AccountLink username={topic.author} />
                    {paginator}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={2} className="center aligned tablet or lower hidden">
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
