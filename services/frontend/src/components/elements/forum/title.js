
import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'

import AccountLink from '../account/link'

export default class ForumTitle extends React.Component {
  render() {
    let forum = this.props.forum
    return (
      <Segment color="blue">
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header size='huge' key={forum._id}>
                {forum.name}
                <Header.Subheader>
                  {forum.description}
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign="right">
              Managed by
              <br/>
              <AccountLink username='chainbb' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
