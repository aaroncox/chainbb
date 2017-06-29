import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'

export default class FeedTitle extends React.Component {
  render() {
    return (
      <Segment stacked color="purple">
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header
                icon='users'
                color='purple'
                size='huge'
                content='Activity Feed'
                subheader='Activity related to the users you follow.'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
