
import React from 'react';

import { Header, List, Message, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class ForumTitle extends React.Component {
  render() {
    let forum = this.props.forum,
        accounts = false,
        accounts_header = false,
        tags = false,
        tags_header = false
    if(forum.accounts && forum.accounts.length > 0) {
      accounts = forum.accounts.map((account, i) => <span key={i}>
        {!!i && ", "}
        <Link to={`https://steemit.com/@${account}`}>@{account}</Link>
      </span>)
      accounts_header = (
        <Message
          icon='user'
          header='This forum is filtered to show only posts from the following accounts.'
          content={accounts}
        />
      )
    }
    if(forum.tags && forum.tags.length > 0) {
      tags = forum.tags.map((tag, i) => <span key={i}>
        {!!i && ", "}
        <Link to={`/topic/${tag}`}>
          #{tag}
        </Link>
      </span>)
      tags_header = (
        <Message
          icon='hashtag'
          header='Posts in this forum require one of the following tags as the FIRST tag.'
          content={tags}
        />
      )
    }
    return (
      <div>
        <Segment basic>
          <Header size='huge'>
            {forum.name}
            <Header.Subheader>
              {forum.description}
            </Header.Subheader>
          </Header>
          {tags_header}
          {accounts_header}
        </Segment>
      </div>
    )
  }
}
