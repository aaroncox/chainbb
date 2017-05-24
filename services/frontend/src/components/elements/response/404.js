import React from 'react';

import { Grid, Header, Message, Segment } from 'semantic-ui-react'

export default class Response404 extends React.Component {
  render() {
    const { height, head_block_number } = this.props.status.network
    let warning = false
    if ( head_block_number > height + 10) {
      const behind = head_block_number - height;
      warning = (
        <Message
          warning
          icon='warning'
          size='large'
          header='Posts may take longer to appear than usual, but will show up.'
          content={
            <p>
              chainBB is currently behind
              {' '}
              <strong>{behind} blocks</strong>
              {' '}
              in syncronization and is catching up with the blockchain.
            </p>
          }
        />
      )
    }
    return (
      <Grid.Row centered>
        <Grid.Column width={12}>
          <Segment basic padded>
            <Header size='huge' textAlign='center'>
              No Responses yet!
              <Header.Subheader>
                Be the first to leave a reply
              </Header.Subheader>
            </Header>
            {warning}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
