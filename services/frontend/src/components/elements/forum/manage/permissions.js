import React from 'react';

import { Header, Icon, Segment, Table } from 'semantic-ui-react'

import AccountLink from '../../account/link'

export default class ForumPermissions extends React.Component {
    render() {
        const { forum, tier } = this.props
        const { target } = forum
        return(
            <div>
                <Segment padded attached='top' secondary color='purple'>
                    <Header size='large'>
                        Forum Permissions
                        <Header.Subheader>
                            The permissions of different Steem users within this forum.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Header attached>
                    Posting Permissions
                </Header>
                <Table attached size='large'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell collapsing>
                                <Icon color='green' name='checkmark' />
                            </Table.Cell>
                            <Table.Cell>
                                Everyone
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Header attached>
                    Owner Permissions
                </Header>
                <Table attached size='large'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell collapsing>
                                <Icon color='green' name='checkmark' />
                            </Table.Cell>
                            <Table.Cell>
                                <AccountLink username={target.creator} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Header attached>
                    Moderation Permissions
                </Header>
                <Table attached size='large'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell collapsing>
                                {(tier && tier.moderation)
                                    ? <Icon color='green' name='checkmark' />
                                    : <Icon color='red' name='close' />
                                }
                            </Table.Cell>
                            <Table.Cell>
                                <AccountLink username={target.creator} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>


            </div>
        );
    }
}
