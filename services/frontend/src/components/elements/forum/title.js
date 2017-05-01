
import React from 'react';

import { Button, Header, Segment } from 'semantic-ui-react'

export default class ForumTitle extends React.Component {
  render() {
    let forum = this.props.forum
    return (
      <div>
        <Segment basic>
          <Header size='huge'>
            <Button floated='right' color='green' onClick={this.props.showNewPost}>
              <i className='pencil icon'></i>
              New Post
            </Button>
            {forum.name}
            <Header.Subheader>
              {forum.description}
            </Header.Subheader>
          </Header>
        </Segment>
      </div>
    )
  }
}
