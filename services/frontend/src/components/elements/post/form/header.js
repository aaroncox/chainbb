import React from 'react';

import { Header } from 'semantic-ui-react'

export default class PostFormHeader extends React.Component {
  render() {
    return (
      <Header size='large'>
        {this.props.title}
        <Header.Subheader>
          {this.props.subtitle}
        </Header.Subheader>
      </Header>
    )
  }
}
