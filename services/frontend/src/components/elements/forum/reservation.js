import React from 'react';

import { Grid, Header, Icon, Input, List, Message, Segment, Table } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import AccountLink from '../account/link'

export default class ForumReservation extends React.Component {
    render() {
        const { reservation, status } = this.props
        const { creator, expires, name, _id } = reservation
        const { sbd_median_price } = status.network
        return (
            <div>
                <Segment padded attached>
                    <Header size='large'>
                        <Icon name='checkmark box' />
                        <Header.Content>
                            Forum Namespace Reserved
                            <Header.Subheader>
                                With the namespace reserved, now you can decide what type of forum this will become.
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Segment padded attached='top'>
                        <Header>
                            <Icon name='square outline' />
                            <Header.Content>
                                Step #2 - Confirm Reservation
                                <Header.Subheader>
                                    To activate this forum, follow the instructions below and complete the transfer as described.
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Segment>
                    <Segment padded attached='bottom' secondary>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={10}>
                                    <Header>
                                        Confirm this reservation and create the forum.
                                    </Header>
                                    <p>If the details of this reservation look correct - complete the transaction below and send 1 STEEM to confirm your reservation.</p>
                                    <Table definition verticalAlign='top'>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell collapsing textAlign='right'>To</Table.Cell>
                                                <Table.Cell>
                                                    <a href='https://steemd.com/@chainbb'>
                                                        @chainbb
                                                    </a>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell collapsing textAlign='right'>Amount</Table.Cell>
                                                <Table.Cell>1 STEEM or {sbd_median_price * 1} SBD</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell collapsing textAlign='right'>Memo</Table.Cell>
                                                <Table.Cell>
                                                    <Input type='text' value={`ns:${_id}`} />
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <Header>
                                        Reservation Details
                                    </Header>
                                    <Table collapsing>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell collapsing>
                                                    Expires
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <TimeAgo date={`${expires}Z`} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell collapsing>
                                                    Reserved by
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <AccountLink username={creator} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell collapsing>
                                                    Forum Name
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {name}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell collapsing>
                                                    Namespace
                                                </Table.Cell>
                                                <Table.Cell>
                                                    /f/{_id}
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Segment padded basic>
                            <Message icon>
                                <Icon name='circle info' />
                                <Message.Content>
                                    <Message.Header>
                                        Awaiting transaction...
                                    </Message.Header>
                                    This page will update automatically once the transaction is confirmed.
                                </Message.Content>
                            </Message>
                            <Header size='small'>
                                Please be aware that...
                            </Header>
                            <List as='ul'>
                                <List.Item as='li'>Once the transaction completes, the account listed below will be listed as the creator of the forum.</List.Item>
                                <List.Item as='li'>There is currently no way to transfer ownership of a forum to another user.</List.Item>
                                <List.Item as='li'>There are no refunds, with the only exception being transfers that fail.</List.Item>
                                <List.Item as='li'>Please ensure the correct memo and do not alter it's contents. Modifying or using a different memo will cause the transfer to fail.</List.Item>
                                <List.Item as='li'>Once the reservation has expired, the name request is removed and the namespace can be claimed by others.</List.Item>
                            </List>
                        </Segment>
                    </Segment>
                </Segment>
            </div>

        )
    }
}
