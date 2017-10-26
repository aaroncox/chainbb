import React from 'react';
import TimeAgo from 'react-timeago'
import AccountLink from '../../../account/link'

import { Table } from 'semantic-ui-react'

export default class ForumUpgradeHistory extends React.Component {
    render() {
        let rows = false
        if(this.props.history) {
            rows = this.props.history.map((event) => {
                return (
                    <Table.Row key={event['_id']}>
                        <Table.Cell>
                            <a href={`https://steemd.com/b/${event['height']}#${event['_id']}`} target='_blank'>
                                <small>{event['_id'].substring(0,8)}</small>
                            </a>
                        </Table.Cell>
                        <Table.Cell textAlign='right'>{event.steem_value}&nbsp;STEEM</Table.Cell>
                        <Table.Cell><AccountLink username={event.from}/></Table.Cell>
                        <Table.Cell textAlign='right'><TimeAgo date={`${event.timestamp}Z`} /></Table.Cell>
                    </Table.Row>

                )
            })
        }
        return(
            <Table unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell collapsing>TXID</Table.HeaderCell>
                        <Table.HeaderCell collapsing textAlign='right'>Contribution</Table.HeaderCell>
                        <Table.HeaderCell>Account</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows}
                </Table.Body>
            </Table>
        );
    }
}
