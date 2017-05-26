
import React from 'react';

import { Header, Segment } from 'semantic-ui-react'

export default class ForumTitle extends React.Component {
  render() {
    let forum = this.props.forum
    return (
      <Segment basic>
        <Header size='huge'>
          {forum.name}
          <Header.Subheader>
            {forum.description}
          </Header.Subheader>
        </Header>
      </Segment>
    )
  }
}
