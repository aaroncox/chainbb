import React from 'react';

import { Button, Divider, Grid, Header, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import PostContent from '../../post/content'
import MarkdownViewer from '../../../../utils/MarkdownViewer';
import AccountAvatar from '../../account/avatar'
import AccountLink from '../../account/link'

export default class ForumPostReply extends React.Component {
  render() {
    const {topic} = this.props
    const { parent, reply } = topic
    let quote = false
    if(parent.depth > 0) {
      quote = (
        <div>
          <Segment padded>
            <Header size='small'>
              <AccountLink username={parent.author} />
              {' '}
              posted
              {' '}
              <TimeAgo date={`${parent.created}Z`} />
              {' '}
              ...
            </Header>
            <MarkdownViewer text={parent.body} jsonMetadata={{}} large highQualityPost={true}  />
          </Segment>
          <Divider hidden></Divider>
          <Divider hidden></Divider>
        </div>
      )
    }
    return (
      <Grid>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column tablet={16} computer={16} mobile={16} style={{marginBottom: '2em'}}>
            <Segment style={{ borderTop: '2px solid #2185D0' }} secondary attached stacked={(this.props.op && this.props.page !== 1)}>
              <Header size='medium'>
                <Button
                  as={Link}
                  to={reply.url}
                  floated='right'
                  icon='external'
                  content='Thread'
                  size='small'
                  basic
                  color='blue'
                />
                <AccountAvatar username={reply.author} />
                <AccountLink username={reply.author} />
                <Header.Subheader>
                  {'↳ '}
                  replied in
                  {' '}
                  <Link to={`/${reply.category}/@${reply.root_post}`}>
                    {parent.root_title}
                  </Link>
                </Header.Subheader>
              </Header>
            </Segment>
            <PostContent
              content={reply}
              hideAuthor={true}
              quote={quote}
              op={false}
              scrollToLatestPost={this.scrollToLatestPost}
              {...this.props}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
