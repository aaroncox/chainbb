import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'

import UserAvatar from '../account/avatar'
import NumericLabel from '../../../utils/NumericLabel'
import ForumLink from '../../../utils/forumlink'

export default class ForumIndex extends React.Component {
  render() {
    const { forum, isMinimized, displayParent } = this.props
    let lastPost = (forum.last_post) ? (new Date(forum.last_post['created']).getTime()) : 0,
        lastReply = (forum.last_reply) ? (new Date(forum.last_reply['created']).getTime()) : 0,
        newest = (lastPost > lastReply) ? 'last_post' : 'last_reply',
        { author, url, created, title } = (typeof forum[newest] === 'object') ? forum[newest] : {},
        latest_post = null,
        parent_forum = null,
        numberFormat = {
          shortFormat: true,
          shortFormatMinValue: 1000
        }
    if(title && title.length > 100) {
      title = title.substring(0, 100) + " ..."
    }
    if(displayParent) {
      parent_forum = (
        <Header.Subheader style={{marginTop: '0.1rem'}}>
          Forums
          {(forum.parent)
            ? ' / '
            : ' '}
          <Link to={`/f/${forum.parent}`}>
            {forum.parent_name}
          </Link>
        </Header.Subheader>
      )
    }
    if(author) {
      latest_post = <Header size='tiny'>
                      <UserAvatar username={author} />
                      <Link
                        to={`${url.split("#")[0]}`}
                        style={{
                          display: 'block',
                          maxHeight: '35px',
                          overflow: 'hidden'
                        }}>
                        {title}
                      </Link>
                      <Header.Subheader>
                        {'↳ '}
                        <Link to={`${url}`}>
                          <TimeAgo date={`${created}Z`} />
                        </Link>
                      </Header.Subheader>
                    </Header>
    }
    return (
      <Segment
        attached
        key={forum._id}
        style={{ display: isMinimized ? "none" : "" }}
        >
        <Grid>
          <Grid.Row
            verticalAlign='middle'
            >
            <Grid.Column computer={7} tablet={9} mobile={8}>
              <Header size='medium'>
                {parent_forum}
                <ForumLink forum={forum}/>
                <Header.Subheader style={{marginTop: '0.1rem'}}>
                  {
                    (forum.description)
                      ? <p>{'↳ '}{forum.description}</p>
                      : ''
                  }
                </Header.Subheader>
                {
                  (forum.children && forum.children.length > 0)
                  ? (
                    <Header.Subheader style={{marginTop: '0.1rem'}}>
                      {forum.children.map((forum, i) => (<span key={i}>
                        {!!i && " • "}
                        <ForumLink forum={forum}/>
                      </span>))}
                    </Header.Subheader>
                  )
                  : ''
                }
              </Header>
            </Grid.Column>
            <Grid.Column width={2} className='tablet or lower hidden' textAlign='center'>
              <Header size='medium'>
                <NumericLabel params={numberFormat}>{(forum.stats) ? forum.stats.posts : '?'}</NumericLabel>
              </Header>
            </Grid.Column>
            <Grid.Column width={2} className='tablet or lower hidden' textAlign='center'>
              <Header size='medium'>
                <NumericLabel params={numberFormat}>{(forum.stats) ? forum.stats.replies : '?'}</NumericLabel>
              </Header>
            </Grid.Column>
            <Grid.Column computer={5} tablet={6} mobile={8}>
              {latest_post}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
