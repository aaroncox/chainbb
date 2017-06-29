import React from 'react';

import { Button, Divider, Header, Grid, Label, Modal, Segment, Table } from 'semantic-ui-react'
import { Form, Dropdown } from 'formsy-semantic-ui-react'

import AccountLink from '../../../account/link'

import _ from 'lodash'

const options = [
  {
    key: 'default',
    text: '50%/50% (Default)',
    value: 'default',
    content: <Header content='50%/50%' subheader='Rewards earned 50% in SBD (or STEEM) and 50% in Steem Power.' />,
  },
  {
    key: 'powerup',
    text: '100% Steem Power',
    value: 'sp',
    content: <Header content='100% Steem Power' subheader='Rewards earned 100% in Steem Power.' />,
  },
  {
    key: 'decline',
    text: 'Decline Rewards',
    value: 'decline',
    content: <Header content='Decline Rewards' subheader='Decline all rewards from this post.' />,
  },
]

export default class PostFormFieldRewards extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addingBeneficiary: false,
      beneficiaries: {}
    }
  }
  generateRows = () => {
    const { beneficiaries } = this.state
    const rows = [
      this.generateRow('Author', 'author', false)
    ]
    // Inject any additional accounts that are added to the beneficiaries
    Object.keys(beneficiaries).forEach((account) => {
      const cleaned = account.replace("@","").trim()
      rows.push(this.generateRow('Beneficiary', cleaned, true))
    })
    return rows
  }
  getAuthorPercentage = () => {
    const { beneficiaries } = this.state
    return Math.floor((100 - _.sum(_.values(beneficiaries)))*100)/100;
  }
  generateRow(type, account, isUser = false) {
    const { beneficiaries } = this.state
    const authorPercent = 85
    let accountName = account
    let weightDisplay = <Table.Cell/>
    let controls = <Table.Cell/>
    if(account === 'author') {
      const weight = this.getAuthorPercentage()
      accountName = <AccountLink username={this.props.author} />
      const accountWeight = Math.floor((weight/100*authorPercent)*100)/100
      weightDisplay = <Table.Cell><Header size='small'>{weight}% <small>({accountWeight}%*)</small></Header></Table.Cell>
    }
    if(account === 'curators') {
      accountName = ''
    }
    if(beneficiaries.hasOwnProperty(account)) {
      const weight = Math.floor((beneficiaries[account]/100*authorPercent)*100)/100
      weightDisplay = (
        <Table.Cell>
          <Header size='small'>
            {beneficiaries[account]}%
            {' '}
            <small>({weight}%*)</small>
          </Header>
        </Table.Cell>
      )
      controls = (
        <Table.Cell>
          <Button
            icon='trash'
            size='mini'
            color='red'
            value={account}
            onClick={this.removeBeneficiary}
          />
        </Table.Cell>
      )
    }
    if(isUser === true) {
      accountName = <AccountLink username={account} />
    }
    return (
      <Table.Row key={account}>
        <Table.Cell>
          {type}
        </Table.Cell>
        <Table.Cell>
          {accountName}
        </Table.Cell>
        {weightDisplay}
        {controls}
      </Table.Row>
    )
  }
  addBeneficiary = (e) => {
    e.preventDefault()
    this.setState({addingBeneficiary: true})
    return false
  }
  removeBeneficiary = (e, data) => {
    e.preventDefault()
    const newBeneficiaries = Object.assign({}, this.state.beneficiaries)
    delete newBeneficiaries[data.value]
    this.setState({
      beneficiaries: newBeneficiaries
    })
    this.props.handleBeneficiariesUpdate(newBeneficiaries)
    return false
  }
  onCancel = (e) => {
    e.preventDefault()
    this.setState({addingBeneficiary: false})
    return false
  }
  onValidSubmit = (formData) => {
    const newBeneficiaries = Object.assign({}, this.state.beneficiaries)
    newBeneficiaries[formData.account] = parseFloat(formData.weight)
    this.setState({
      addingBeneficiary: false,
      beneficiaries: newBeneficiaries
    })
    this.props.handleBeneficiariesUpdate(newBeneficiaries)
  }
  render() {
    const authorPercent = this.getAuthorPercentage()
    const rows = this.generateRows()
    const { value, draft } = this.props
    const errorLabel = <Label color="red" pointing/>
    return (
      <Grid stackable={true}>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header>
              Reward Method
              <Header.Subheader>
                Choose the method the rewards for this post will be distributed.
              </Header.Subheader>
            </Header>
            <Dropdown
              selection
              fluid
              name='rewards'
              required
              errorLabel={ errorLabel }
              validationErrors={{
                isDefaultRequiredValue: 'You need to select a rewards method',
              }}
              options={options}
              defaultValue={(draft && draft.rewards) ? draft.rewards : 'default'}
              placeholder='Choose an option'
            />
            <Header>
              <Header.Subheader>
                This option only applies to you as the author. All other beneficiaries will be rewarded in 100% Steem Power.
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column width={8}>
            <Segment secondary>
              <Modal size='small' open={this.state.addingBeneficiary}>
                <Modal.Header>Add a Beneficiary</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <p>Adding a beneficiary to this post will automatically share a portion of it's rewards with the accounts you specify.</p>
                    <Form
                      ref={ref => this.form = ref }
                      onChange={ this.handleOnChange }
                      onValidSubmit={ this.onValidSubmit }
                    >
                      <Form.Input
                        name="account"
                        label="Account Name"
                        required
                        focus
                        autoFocus
                        defaultValue={value}
                        placeholder='Enter the account name...'
                        validationErrors={{
                          isDefaultRequiredValue: 'An account name is required'
                        }}
                        errorLabel={ errorLabel }
                      />
                      <Form.Input
                        name="weight"
                        label="Percentage to Share with account"
                        required
                        validations={{
                          validAmount: function (values, value) {
                            const parsed = parseFloat(value)
                            if(isNaN(parsed)) {
                              return false
                            }
                            if(parsed > authorPercent) {
                              return false
                            }
                            if(parsed < 0) {
                              return false
                            }
                            return true
                          }
                        }}
                        defaultValue={value}
                        placeholder='Enter a percentage'
                        validationErrors={{
                          isDefaultRequiredValue: 'A percentage is required',
                          validAmount: 'Invalid Amount'
                        }}
                        errorLabel={ errorLabel }
                      />
                      <p>Maximum Percent Available: {this.getAuthorPercentage()}</p>
                      <Divider hidden />
                      <Button floated='right' primary>Add Account</Button>
                      <Button color='orange' onClick={this.onCancel}>Cancel</Button>
                    </Form>
                  </Modal.Description>
                </Modal.Content>
              </Modal>
              <Header>
                Reward Distribution
                <Header.Subheader>
                  Who should the rewards for this post be distributed to?
                </Header.Subheader>
              </Header>
              <Button
                color='purple'
                onClick={this.addBeneficiary}
              >
                Add
              </Button>
              <Table size='small' verticalAlign='middle'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Beneficiary</Table.HeaderCell>
                    <Table.HeaderCell>Percent</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body children={rows} />
              </Table>
              <Header>
                <Header.Subheader>
                  An additional 25% is allocated to Curators on the Steem blockchain, as well as 15% to the chainBB Team and Community.
                </Header.Subheader>
                <Header.Subheader>
                  <small>
                    <strong>*</strong>
                    {' '}
                    Represents the actual percentage after the chainBB beneficiary.
                  </small>
                </Header.Subheader>
              </Header>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
