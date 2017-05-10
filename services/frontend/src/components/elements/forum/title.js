
import React from 'react';

import { Header, List, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class ForumTitle extends React.Component {
  render() {
    let forum = this.props.forum,
        accounts = false,
        accounts_header = false,
        tags = false,
        tags_header = false
    if(forum.accounts && forum.accounts.length > 0) {
      accounts = forum.accounts.map((account, i) => <List.Item key={i}>
        <Link to={`https://steemit.com/@${account}`}>
          @{account}
        </Link>
      </List.Item>)
      accounts_header = (
        <Segment basic>
          <em>This forum is filtered to show only posts from the following accounts.</em>
          <br/>
          <List horizontal size='small'>
            {accounts}
          </List>
        </Segment>
      )
    }
    if(forum.tags && forum.tags.length > 0) {
      tags = forum.tags.map((tag, i) => <List.Item key={i}>
        <Link to={`/topic/${tag}`}>
          #{tag}
        </Link>
      </List.Item>)
      tags_header = (
        <Segment basic>
          <em>To write a post in this forum, use one of the following tags as the <strong>first tag</strong>.</em>
          <br/>
          <List horizontal size='small'>
            {tags}
          </List>
        </Segment>
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
