import React from 'react';

import { Button, Grid, Header, Popup, Segment } from 'semantic-ui-react'
import InputRange from 'react-input-range';

export default class VoteButtonOptions extends React.Component {

  handleOnChange = (value) => {
    this.props.onWeightChange({'votePowerPost': value})
  }

  handleOnChangeComplete = (value) => {
    this.props.onWeightChange({'votePowerPost': value})
  }

  render() {
    let { effectiveness } = this.props
    return (
      <Popup
        trigger={<Button icon='dropdown' />}
        position='bottom center'
        hoverable
        style={{maxWidth: '600px'}}
      >
        <Grid divided columns={2}>
          <Grid.Column>
            <Segment basic attached style={{border: 'none'}}>
              <Header dividing>Adjust your next vote&lsquo;s power</Header>
            </Segment>
            <Segment basic attached style={{border: 'none', minHeight: '59px'}}>
              <InputRange
                maxValue={100}
                minValue={1}
                value={this.props.weight}
                onChange={this.handleOnChange}
                onChangeComplete={this.handleOnChangeComplete}
              />
            </Segment>
            <Segment basic attached style={{border: 'none'}}>
              <p>Using more power increases rewards to the author, but also increases the drain of your effectiveness more.</p>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic attached style={{border: 'none'}}>
              <Header dividing>Overall voting effectiveness</Header>
            </Segment>
            <Segment basic attached style={{border: 'none'}}>
              <Header size='large' style={{margin: 0}}>{effectiveness}</Header>
            </Segment>
            <Segment basic attached style={{border: 'none'}}>
              <p>Each vote cast decreases the overall effectiveness of future votes, which slowly recovers over time.</p>
            </Segment>
          </Grid.Column>
        </Grid>
      </Popup>
    )
  }
}
