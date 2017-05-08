
import React from 'react';

import { Button, Header, List, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class ForumTitle extends React.Component {
  render() {
    let forum = this.props.forum,
        tags = false
    if(forum.tags) {
      tags = forum.tags.map((tag, i) => <List.Item key={i}>
        <Link to={`/topic/${tag}`}>
          #{tag}
        </Link>
      </List.Item>)
    }
    return (
      <div>
        <Segment basic>
          <Header size='huge'>
            {forum.name}
            <Header.Subheader>
              {forum.description}
            </Header.Subheader>
            <Header.Subheader>
              <p><em>To write a post in this forum, use one of the following tags as the <strong>first tag</strong>.</em></p>
              <List horizontal small>
                <List.Item header>Tags included:</List.Item>
                {tags}
              </List>
            </Header.Subheader>
          </Header>
        </Segment>
      </div>
    )
  }
}
