import React from 'react';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux'
import _ from 'lodash'
import slug from 'slug'
import Noty from 'noty'

import { Button, Dimmer, Divider, Header, Icon, Label, Loader, Modal, Segment, Table } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

import * as types from '../../../actions/actionTypes';
import * as forumActions from '../../../actions/forumActions'

import AccountLink from '../../../components/elements/account/link'

const fields = ['name', 'description', 'tags', 'exclusive']

class ForumConfigForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            tags: '',
            exclusive: false,
            awaitingBlock: false,
            processing: false,
            showConfirm: false,
            tags_detected: []
        }
        const state = {}
        fields.map((field) => state[field] = null)
        this.state = state
    }
    componentWillMount() {
        const { target } = this.props.forum
        fields.map((field) => this.handleChange(false, {
            name: field,
            value: target[field] || false
        }))
        if(target.exclusive) {
            this.setState({
                exclusive: target.exclusive
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        const { forum } = nextProps
        if(forum.last) {
            switch(forum.last.type) {
                case types.FORUM_CONFIG_PROCESSING:
                    this.setState({processing: true})
                    break;
                case types.FORUM_CONFIG_RESOLVED:
                    if (this.state.showConfirm && this.state.processing) {
                        this.setState({
                            processing: false,
                            awaitingBlock: true,
                        })
                        this.timeout = setTimeout(() => {
                            this.setState({
                                showConfirm: false,
                                awaitingBlock: false,
                            })
                            new Noty({
                                closeWith: ['click', 'button'],
                                layout: 'topRight',
                                progressBar: true,
                                theme: 'semanticui',
                                text: ReactDOMServer.renderToString(
                                    <Header>
                                      Forum configuration submitted!
                                      <Header.Subheader>
                                        If these changes do not appear immediately - wait a few moment and then refresh the page.
                                      </Header.Subheader>
                                    </Header>
                                ),
                                type: 'success',
                                timeout: 8000
                            }).show();
                        }, 3000)
                    }
                    break;
                default:
                    break;
            }
        }
    }
    handleChange = (e, data) => {
        if (data.value && data.value.constructor === Array) {
            data.value = data.value.join(",")
        }
        if (typeof this.state[data.name] !== 'undefined') {
            if (data.name === 'tags' && data.value) {
                const detected = data.value.split(',').filter((tag) => {
                    return !!tag && tag.trim() !== ''
                }).map((tag) => {
                    return slug(tag, {
                        replacement: '-',
                        remove: /[._]/g,
                        lower: true
                    })
                })
                this.setState({'tags_detected': detected})
            }
            this.setState({[data.name]: data.value})
        }
    }
    toggleExclusivity = (e, data) => {
        this.setState({exclusive: data.checked})
    }
    handleSubmit = (data) => {
        this.setState({showConfirm: true})
    }
    hideConfirm = () => this.setState({showConfirm: false})
    broadcast = () => {
        const settings = {
            description: this.state.description,
            exclusive: this.state.exclusive,
            name: this.state.name,
            tags: this.state.tags_detected,
        }
        const namespace = this.props.forum.target._id
        this.props.actions.forumConfig(this.props.account, namespace, settings)
    }
    render() {
        const { account, forum } = this.props
        const { target } = forum
        const { _id } = target
        const { name, description, tags } = this.state
        const tag_labels = (this.state.tags) ? this.state.tags_detected.map((tag) => (
            <Label as='a' color='blue' key={tag}>
                <Icon name='tag' />
                {tag}
            </Label>
        )) : []
        const errorLabel = <Label color="red" pointing/>
        let submit = (
            <Button fluid disabled>
                You do not have access to edit this forum.
            </Button>
        )
        if (account.name === target.creator) {
            submit = (
                <Button fluid color='blue' type='submit'>
                    Submit Changes
                </Button>
            )
        }
        let modal = false
        if (this.state.showConfirm) {
            let { awaitingBlock, processing } = this.state
            modal = (
                <Modal
                    open={true}
                    closeIcon={true}
                    color='blue'
                    onClose={this.hideConfirm}
                    size='small'
                >
                    <Segment basic style={{marginTop: 0}} color='orange'>
                        <Dimmer active={processing}>
                            <Loader>Submitting...</Loader>
                        </Dimmer>
                        <Dimmer active={awaitingBlock}>
                            <Loader indeterminate>Waiting for next block...</Loader>
                        </Dimmer>
                        <Header icon='wait' content='Confirm Information' style={{marginTop: 0}} />
                        <Modal.Content>
                            <Segment basic padded>
                                <p style={{fontSize: '1.33em'}}>
                                    Please review this information to ensure it is correct. Broadcast the transaction once completed.
                                </p>
                                <Table definition>
                                    <Table.Row>
                                        <Table.Cell collapsing>Account</Table.Cell>
                                        <Table.Cell><AccountLink username={account.name} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing>Namespace</Table.Cell>
                                        <Table.Cell>{target._id}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing>Exclusive</Table.Cell>
                                        <Table.Cell>
                                            {(this.state.exclusive)
                                                ? <Icon color='green' name='checkmark' />
                                                : <Icon color='red' name='close' />
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing>Name</Table.Cell>
                                        <Table.Cell>{this.state.name}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing>Description</Table.Cell>
                                        <Table.Cell>{this.state.description}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing>Tags</Table.Cell>
                                        <Table.Cell>{tag_labels}</Table.Cell>
                                    </Table.Row>
                                </Table>
                                <Segment basic textAlign='center'>
                                    <Button
                                        color='blue'
                                        content='Confirmed - Broadcast Transaction'
                                        onClick={this.broadcast}
                                    />
                                </Segment>
                            </Segment>
                        </Modal.Content>
                    </Segment>
                </Modal>
            )
        }
        let newForumDisplay = false
        if (this.props.newForum) {
            newForumDisplay = (
                <Segment>
                    <Header size='large'>
                        <Icon name='checkmark box' />
                        <Header.Content>
                            Reservation confirmed!
                            <Header.Subheader>
                                This forum has successfully been created.
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Segment padded>
                        <Header>
                            <Icon name='square outline' />
                            <Header.Content>
                                Step #3 - Finish configuring the forum settings
                                <Header.Subheader>
                                    The last step is to configure how this forum will be displayed and interact with the blockchain. You can revisit these page and alter these settings whenever you'd like to make changes.
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Segment>
                </Segment>
            )
        }
        return (
            <div>
                {modal}
                {newForumDisplay}
                <Form
                    loading={this.state.loading}
                    onValidSubmit={this.handleSubmit}
                    >
                    <Segment padded attached='top' secondary color='orange'>
                        <Header size='large'>
                            Forum Configuration
                            <Header.Subheader>
                                These settings control the how this forum interacts with the Steem blockchain and can be changed at any time.
                            </Header.Subheader>
                        </Header>
                    </Segment>
                    <Segment attached>
                        <Segment padded basic>
                            <Header>
                                Display Name
                                <Header.Subheader>
                                    The friendly forum name displayed on chainBB.com to the users. This string does not have to be unique but must be between 3 and 80 characters in length.
                                </Header.Subheader>
                            </Header>
                            <Form.Input
                                autoFocus
                                errorLabel={ errorLabel }
                                label='Forum Display Name'
                                name='name'
                                onChange={this.handleChange}
                                placeholder=''
                                required
                                validationErrors={{
                                  minLength: '3 or more characters required.',
                                  maxLength: '80 or less characters required.',
                                  isDefaultRequiredValue: 'This field is required.'
                                }}
                                validations={{
                                  minLength: 3,
                                  maxLength: 80,
                                }}
                                value={name}
                            />
                        </Segment>
                        <Segment padded basic>
                            <Header>
                                Description
                                <Header.Subheader>
                                    A short description describing the primary subject of this forum. This description is optional and has a maximum of 255 characters in length.
                                </Header.Subheader>
                            </Header>
                            <Form.Input
                                errorLabel={ errorLabel }
                                label='Forum Description'
                                name='description'
                                onChange={this.handleChange}
                                placeholder=''
                                validationErrors={{
                                    maxLength: 255,
                                }}
                                value={description}
                            />
                        </Segment>
                        <Segment padded basic>
                            <Header>
                                Content Tags
                                <Header.Subheader>
                                    Specify the tags required for a post to be displayed within this forum. Tags must be a combination of lowercase letters, numbers, and dashes. Any invalid characters entered will be stripped. Use commas to seperate different tags, up to 5.
                                </Header.Subheader>
                            </Header>
                            <Form.Input
                                errorLabel={ errorLabel }
                                label='Forum Content Tags'
                                name='tags'
                                onChange={this.handleChange}
                                placeholder=''
                                value={tags}
                            />
                            <div>
                                <Header>
                                    <Header.Subheader>
                                        The following tags have been detected based on the input above:
                                    </Header.Subheader>
                                </Header>
                                {tag_labels}
                            </div>
                        </Segment>
                        <Segment padded basic>
                            <Header>
                                Content Exclusivity
                                <Header.Subheader>
                                    Enable this option to prevent posts from other websites from showing up in this forum. This only applies to posts - comments made by other platforms will be displayed in the discussion threads as usual.
                                </Header.Subheader>
                            </Header>
                            <Form.Checkbox
                                name='exclusive'
                                onChange={this.toggleExclusivity}
                                defaultChecked={this.state.exclusive}
                                label='Only display posts made through this forum.'
                            />
                        </Segment>
                        <Divider section />
                        {submit}
                    </Segment>
                </Form>
            </div>
        )
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
        ...forumActions
    }, dispatch)}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForumConfigForm));
