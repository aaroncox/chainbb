import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'

export default class ForumHeader extends React.Component {
  render() {
    return (
      <Segment attached='top' secondary>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Header size='small'>
                Forum
              </Header>
            </Grid.Column>
            <Grid.Column width={2} only='large screen' className='center aligned'>
              <Header size='small'>
                Replies
              </Header>
            </Grid.Column>
            <Grid.Column width={4} only='large screen'>
              <Header size='small'>
                Latest Reply
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
