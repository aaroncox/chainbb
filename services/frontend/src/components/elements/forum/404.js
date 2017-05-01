import React from 'react';

import { Button, Divider, List, Header, Popup, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Forum404 extends React.Component {

  render() {
    let forum = this.props.forum
    return (
      <Segment textAlign='center' padded attached>
        <Header size='huge'>
          No posts yet!
          <Header.Subheader>
            <p>Be the first to create a post in this forum.</p>
            <Popup
              trigger={
                <Button primary>
                  <i className='pencil icon'></i>
                  New Post
                </Button>
              }
              title='Not yet implemented'
              content='This is a placeholder - and will work in a later build!'
              position='left center'
              basic
              />
            <Divider hidden></Divider>
            <p>Make sure to use one of the following tags as the first tag in your post:</p>
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
