import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Divider, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as forumActions from '../../actions/forumActions'
import * as statusActions from '../../actions/statusActions'
import * as preferenceActions from '../../actions/preferenceActions'

import ForumTypesTable from '../../components/elements/forum/types/table'

class ForumCreate extends React.Component {
    render() {
        return(
            <Segment color='blue'>
                <Segment textAlign='center' padded='very' basic>
                    <Header as='h1'>
                        Interested in starting your own forum?
                        <Header.Subheader>
                            The first step is knowing what type of forum best fits your needs.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Divider />
                <Header size='large'>
                    Forum feature matrix
                    <Header.Subheader>
                        chainBB currently offers 3 different types of forums.
                    </Header.Subheader>
                </Header>
                <Segment padded basic>
                    <ForumTypesTable />
                    <Message
                        content='The pricing below is subject to change as more features become available and as chainBB leaves beta.'
                        header='Beta Price Availability'
                        icon='hourglass start'
                        info
                        style={{margin: '2em 0'}}
                    />
                </Segment>
                <Divider />
                <Segment vertical style={{padding: '2em 0'}}>
                    <Grid verticalAlign='middle' padded='vertically' divided='vertically' container stackable>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header size='large'>
                                    Features of a chainBB Forum
                                    <Header.Subheader>
                                        This initial set of features is just enough to get your community started.
                                    </Header.Subheader>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Steem Powered
                                    <Header.Subheader>
                                        All data exists on the Steem blockchain
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    The chainBB forum engine is powered by the <a href='https://steem.io'>Steem</a> blockchain, which means your data is uncorruptable and permanant. Every post, vote and action you take within a chainBB forum happens on the blockchain. The forum and chainBB itself sit on the blockchain as a specialized app.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <Image size='large' bordered />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Forum Hosting
                                    <Header.Subheader>
                                        Hosted on chainBB.com
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    Forums created on chainBB are indexed within the dedicated infrastructure tailored specifically for this purpose.  No need to setup your own server or run your own software.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <Image size='large' bordered />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Unique URL
                                    <Header.Subheader>
                                        A easy URL to access your forums
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    A short and unique URL makes it easy to share a forums with friends. During the forum creation process you'll get to choose what that URL is.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <Image size='large' bordered />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Moderation
                                    <Header.Subheader>
                                        Tools to let you keep the forum free of spam and on-topic.
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    The <strong>Moderated</strong> and <strong>Premium</strong> forum offerings include a basic set of moderation tools that can be used by the forum owner. In the future, the creator will also be able to assign additional moderators to assist.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <Image size='large' bordered />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Beneficiary Rewards
                                    <Header.Subheader>
                                        Earn a portion of rewards from evert post made in the forum.
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    The <strong>Premium</strong> forum offering also includes a portion of the beneficiary rewards generated by the forum. Currently these rewards are sent to the creator of the forum, and in the future will the creator will be able to automatically divide these rewards with other accounts.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <Image size='large' bordered />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Segment>
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
