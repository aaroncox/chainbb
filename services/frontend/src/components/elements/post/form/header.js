import React from 'react';

import { Header, Segment } from 'semantic-ui-react'

export default class PostFormHeader extends React.Component {
  render() {
    const { color } = this.props
    return (
      <Segment color={color}>
        <Header size='large'>
          {this.props.title}
          <Header.Subheader>
            {this.props.subtitle}
          </Header.Subheader>
        </Header>
      </Segment>
    )
  }
}
