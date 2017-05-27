import React from 'react';

import { Table } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'

import NumericLabel from '../../../../utils/NumericLabel'

export default class AccountSidebarInfo extends React.Component {
  render() {
    const { username } = this.props.match.params,
          account = this.props.state.accounts[username],
          numberFormat = {
            shortFormat: true,
            shortFormatMinValue: 1000
          }
    return (
      <Table definition size="small">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Last Post</Table.Cell>
            <Table.Cell>
              <TimeAgo date={`${account.last_post}Z`} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Posts</Table.Cell>
            <Table.Cell>{account.post_count}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>VESTS</Table.Cell>
            <Table.Cell>
              <NumericLabel params={numberFormat}>{account.vesting_shares.split(" ")[0]}</NumericLabel>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Voting Power</Table.Cell>
            <Table.Cell>{account.voting_power / 100}%</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}
