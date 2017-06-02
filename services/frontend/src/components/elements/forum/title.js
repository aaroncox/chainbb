
import React from 'react';

import { Header } from 'semantic-ui-react'

export default class ForumTitle extends React.Component {
  render() {
    let forum = this.props.forum
    return (
      <Header size='huge' key={forum._id}>
        {forum.name}
        <Header.Subheader>
          {forum.description}
        </Header.Subheader>
      </Header>
    )
  }
}
