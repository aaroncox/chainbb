import React from 'react';

import { Button, Divider, List, Header, Popup, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Forum404 extends React.Component {

  render() {
    let forum = this.props.forum,
        isUser = this.props.isUser,
        showNewPost = this.props.showNewPost,
        button = (
          <Popup
            trigger={
              <Button size='large'>
                <i className='pencil icon'></i>
                Create new post
              </Button>
            }
            position='bottom center'
            inverted
            content='You must be logged in to post.'
            basic
          />
        )
    if(isUser) {
      button = (
        <Button primary onClick={showNewPost}>
          <i className='pencil icon'></i>
          New Post
        </Button>
      )
    }
    return (
      <Segment textAlign='center' padded='very'>
        <Header size='huge'>
          No posts yet!
          <Header.Subheader>
            <p>Be the first to create a post in this forum.</p>
            {button}
            <Divider hidden></Divider>
            <p>
                If you'd like to post to this forum from another Steem powered application, please make sure to use one of the following tags as the first tag in your post:
            </p>
          </Header.Subheader>
        </Header>
        <List>
          {forum.tags.map((tag, i) => <List.Item key={i}>
            <Link to={`/topic/${tag}`}>
              #{tag}
            </Link>
          </List.Item>)}
        </List>
      </Segment>
    )
  }
}
