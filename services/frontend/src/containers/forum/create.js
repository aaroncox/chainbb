import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Button, Grid, Header, Icon, Menu, Segment, Table } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as forumActions from '../../actions/forumActions'
import * as statusActions from '../../actions/statusActions'
import * as preferenceActions from '../../actions/preferenceActions'

class ForumCreate extends React.Component {
    render() {
        return(
            <div>
                <Segment textAlign='center' padded='very' color='blue'>
                    <Header as='h2'>
                        Choose what type of forum you'd like to create
                        <Header.Subheader>
                            Select which chainBB forum package that fits the needs of this new community.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Table definition celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell width={4}>
                                <Header textAlign='center'>
                                    Free Forum
                                </Header>
                            </Table.HeaderCell>
                            <Table.HeaderCell width={4}>
                                <Header textAlign='center'>
                                    Paid Forum
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
                                    0 STEEM
                                    <Header.Subheader>
                                        Create a proposal
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
                                        Tools to keep the forum free of spam and on-topic.
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
                        <Table.Row>
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
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <Header>
                                    Beneficiary Rewards
                                    <Header.Subheader>
                                        Earn a portion of rewards from posts in the forum.
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
                        <Table.Row>
                            <Table.Cell>
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Button color='blue'>
                                    Create a Proposal
                                </Button>
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Button color='green'>
                                    Create Forum
                                </Button>
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Button color='green'>
                                    Create Forum
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        account: state.account,
        forum: state.forum,
        preferences: state.preferences,
        status: state.status
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({
        ...accountActions,
        ...forumActions,
        ...preferenceActions,
        ...statusActions,
    }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(ForumCreate);
