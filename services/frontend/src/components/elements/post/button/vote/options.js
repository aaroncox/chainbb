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

  componentWillReceiveProps(nextProps) {
    if(nextProps.weight !== this.state.weight) {
      this.setState({weight: nextProps.weight})
    }
  }

  handleOnChange = (value) => {
    const cleaned = Math.round(parseFloat(value) * 100) / 100
    if(cleaned !== this.state.weight) {
      this.setState({'weight': cleaned})
    }
  }

  handleOnChangeComplete = (value) => {
    const cleaned = Math.round(parseFloat(value) * 100) / 100
    if(cleaned !== this.state.weight) {
      this.onChange({'votePowerPost': cleaned})
    }
  }

  handleManualChange = (e, data) => {
    const value = parseFloat(data.value)
    if(value >= 0 && value <=100) {
      this.setState({'weight': Math.round(parseFloat(data.value) * 100) / 100})
    } else {
      this.setState({'weight': data.value})
    }
  }

  handleBlur = (e) => {
    const value = this.state.weight
    if(value >= 0 && value <=100) {
      this.onChange({'votePowerPost': value})
    }
  }

  vests_to_sp(vests){
      return vests / 1e6 * this.props.status.network.steem_per_mvests
  }

  sp_to_vests(sp) {
      return sp * 1e6 / this.props.status.network.steem_per_mvests
  }

  vests_to_rshares(sp, voting_power=10000, vote_pct=10000) {
    // Sanity checks
    const vesting_shares = parseInt(this.sp_to_vests(sp) * 1e6, 10)
    const power = (((voting_power * vote_pct) / 10000) / 50) + 1
    return (power * vesting_shares) / 10000
  }

  estimate() {
    const { account, status } = this.props
    const { recent_claims, reward_balance, sbd_median_price } = status.network
    if(account.data) {
      const voting_power = account.data.voting_power
      const total_vests = parseFloat(account.data.vesting_shares.split(" ")[0]) + parseFloat(account.data.received_vesting_shares.split(" ")[0])
      const sp = this.vests_to_sp(total_vests)
      const vote_pct = this.state.weight * 100
      const rshares = this.vests_to_rshares(sp, voting_power, vote_pct)
      return rshares / recent_claims * reward_balance * sbd_median_price
    }
    return 0
  }

  render() {
    const errorLabel = <Label color="red" pointing/>
    const weight = parseInt(this.state.weight * 100, 10)
    const effectiveness = parseInt(parseFloat(this.props.effectiveness) * 100, 10)
    const cost = Math.round(((weight / 10000 * 0.02)) * effectiveness) / 100
    const budget = Math.round(20 / cost * 1000) / 1000
    const estimate = Math.round(this.estimate() * 1000) / 1000
    return (
      <Popup
        trigger={<Button icon='dropdown' floated='left' basic content={`(${this.state.weight}%)`} />}
        position='bottom center'
        hoverable
        onUnmount={this.handleBlur}
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
                  className='ui fluid labeled input'
                  label='Vote Power'
                  value={this.state.weight}
                  onChange={this.handleManualChange}
                  onBlur={this.handleBlur}
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
                  <strong>+{estimate}</strong> reward to author (estimated)
                </p>
                <p>
                  <strong>-{cost}%</strong> for voting effectiveness
                </p>
              </Form>
            </Segment>
            <Segment basic attached style={{border: 'none', minHeight: '59px'}}>
              <InputRange
                maxValue={100}
                minValue={0.01}
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
                {effectiveness/100}%
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
