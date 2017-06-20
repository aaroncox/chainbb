import React from 'react';

import { Button, Grid, Header, Input, Label, Popup, Segment } from 'semantic-ui-react'
import InputRange from 'react-input-range';
import { throttle } from 'lodash'
import { Form, Input as FormsyInput } from 'formsy-semantic-ui-react'

export default class VoteButtonOptions extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      weight: props.weight
    }
    this.onChange = throttle(this.props.onWeightChange, 50)
  }

  handleOnChange = (value) => {
    this.setState({'weight': Math.round(parseFloat(value) * 100) / 100})
  }

  handleOnChangeComplete = (value) => {
    this.onChange({'votePowerPost': Math.round(parseFloat(value) * 100) / 100})
  }

  handleManualChange = (e, data) => {
    if(parseFloat(data.value) > 0) {
      this.setState({'weight': Math.round(parseFloat(data.value) * 100) / 100})
      this.onChange({'votePowerPost': Math.round(parseFloat(data.value) * 100) / 100})
    }
  }

  render() {
    let { effectiveness } = this.props
    const errorLabel = <Label color="red" pointing/>
    const cost = Math.round(this.state.weight / 100 * 0.02 * parseInt(effectiveness) * 100) / 100
    const budget = Math.round(20 / cost * 10) / 10
    return (
      <Popup
        trigger={<Button icon='dropdown' floated='left' basic content={`(${this.state.weight}%)`} />}
        position='bottom center'
        hoverable
        style={{maxWidth: '700px'}}
      >
        <Grid divided columns={2}>
          <Grid.Column width={8}>
            <Segment basic attached style={{border: 'none'}}>
              <Header dividing>Adjust your next vote&lsquo;s power</Header>
            </Segment>
            <Segment basic attached style={{border: 'none'}} textAlign='center'>
              <Form

                >
                <FormsyInput
                  as={Input}
                  fluid
                  name='weight'
                  className='ui labeled input'
                  label='Vote Power'
                  value={this.state.weight}
                  onChange={this.handleManualChange}
                  required
                  validations={{
                    validAmount: function (values, value) {
                      const parsed = parseFloat(value)
                      if(isNaN(parsed)) {
                        return false
                      }
                      if(parsed > 100) {
                        return false
                      }
                      if(parsed < 0) {
                        return false
                      }
                      return true
                    }
                  }}
                  validationErrors={{
                    isDefaultRequiredValue: 'A percentage is required',
                    validAmount: 'Invalid Amount'
                  }}
                  errorLabel={ errorLabel }
                />
                <p>
                  <strong>-{cost}%</strong> for voting effectiveness
                </p>
              </Form>
            </Segment>
            <Segment basic attached style={{border: 'none', minHeight: '59px'}}>
              <InputRange
                maxValue={100}
                minValue={1}
                step={0.01}
                value={this.state.weight}
                onChange={this.handleOnChange}
                onChangeComplete={this.handleOnChangeComplete}
              />
            </Segment>
            <Segment basic attached style={{border: 'none'}}>
              <p>Using more voting power increases the rewards to the author, but also increases the drain of your voting effectiveness.</p>
            </Segment>
          </Grid.Column>
          <Grid.Column width={8}>
            <Segment basic attached style={{border: 'none'}}>
              <Header dividing>Voting effectiveness</Header>
              <Header size='large' style={{margin: 0}}>
                {effectiveness}
              </Header>
            </Segment>
            <Segment basic attached style={{border: 'none'}}>
              <p>Each vote cast decreases the overall effectiveness of future votes, which recovers over time at a rate of <strong>20% effectiveness per day</strong>.</p>
            </Segment>
            <Segment basic attached style={{border: 'none'}}>
              <Header dividing>Voting Budget</Header>
              <p>
                While casting all votes with <strong>{this.state.weight}% voting power</strong>, approximiately <strong>~{budget} votes</strong> per day are possible while maintaining an average effectiveness of ~<strong>{effectiveness}</strong>.
              </p>
            </Segment>

          </Grid.Column>
        </Grid>
      </Popup>
    )
  }
}
