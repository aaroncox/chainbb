import React from 'react';

import { Header, Icon, Table } from 'semantic-ui-react'

import ForumCreateButton from '../../../../containers/forum/create/button'

export default class ForumTypesTable extends React.Component {
    render() {
        let actionRow = (
            <Table.Row>
                <Table.Cell>
                </Table.Cell>
                <Table.Cell colSpan="12" textAlign='center'>
                    <p style={{fontSize: '1.33em'}}>
                        Get started by reserving a name and a unique namespace.
                    </p>
                    <ForumCreateButton />
                </Table.Cell>
            </Table.Row>
        )
        if(typeof this.props.actionRow !== 'undefined') {
            actionRow = this.props.actionRow
        }
        return(
            <Table definition celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell/>
                        <Table.HeaderCell width={4}>
                            <Header textAlign='center'>
                                Basic Forum
                            </Header>
                        </Table.HeaderCell>
                        <Table.HeaderCell width={4}>
                            <Header textAlign='center'>
                                Moderated Forum
                            </Header>
                        </Table.HeaderCell>
                        <Table.HeaderCell width={4}>
                            <Header textAlign='center'>
                                Premium Forum
                            </Header>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Price</Table.Cell>
                        <Table.Cell textAlign='center' verticalAlign='top'>
                            <Header>
                                1 STEEM
                                <Header.Subheader>
                                    one time
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center' verticalAlign='top'>
                            <Header>
                                50 STEEM
                                <Header.Subheader>
                                    per year
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center' verticalAlign='top'>
                            <Header>
                                250 STEEM
                                <Header.Subheader>
                                    per year
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Header>
                                Steem Powered
                                <Header.Subheader>
                                    All data exists on the Steem blockchain
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Header>
                                Hosting
                                <Header.Subheader>
                                    Hosted on chainBB.com
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Header>
                                Unique URL
                                <Header.Subheader>
                                    chainbb.com/f/<strong>forum-name</strong>
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            <Header>
                                Moderation
                                <Header.Subheader>
                                    Tools to let you keep the forum free of spam and on-topic.
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>

                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Icon size='big' name='checkmark box' color='green' />
                        </Table.Cell>
                    </Table.Row>
                    {/* <Table.Row>
                        <Table.Cell>
                            <Header>
                                Subforums
                                <Header.Subheader>
                                    Additional subforums within the main forum.
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>

                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Header color='black'>
                                2
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Header color='black'>
                                5
                            </Header>
                        </Table.Cell>
                    </Table.Row> */}
                    <Table.Row>
                        <Table.Cell>
                            <Header>
                                Beneficiary Rewards
                                <Header.Subheader>
                                    Earn a portion of rewards from evert post made in the forum.
                                </Header.Subheader>
                            </Header>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>

                        </Table.Cell>
                        <Table.Cell textAlign='center'>

                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Header color='black'>
                                5%
                            </Header>
                        </Table.Cell>
                    </Table.Row>
                    {actionRow}
                </Table.Body>
            </Table>
        );
    }
}
