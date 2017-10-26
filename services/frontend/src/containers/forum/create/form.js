import React from 'react';
import _ from 'lodash'

import { Button, Divider, Header, Icon, Label, Message, Segment } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

export default class ForumCreateForm extends React.Component {
    render() {
        const { name, namespace, suggestion } = this.props
        let namespace_unavailable = false
        if(this.props.namespace_unavailable) {
            namespace_unavailable = (
                <Message
                    negative
                    header="This namespace is unavailable."
                    content="Please choose a different namespace for this forum and try again."
                />
            )
        }
        const errorLabel = <Label color="red" pointing/>
        let form = (
            <Form
                loading={this.props.loading}
                onValidSubmit={this.props.handleSubmit}
                >
                <Message icon>
                    <Icon name='circle info' />
                    <Message.Content>
                        <Message.Header>
                            This reservation <strong>will be valid for 1 hour</strong>.
                        </Message.Header>
                        You will be responsible for completing the initial funding of this forum of 1 STEEM within one hour or the reservation will be cancelled automatically.
                    </Message.Content>
                </Message>
                <Segment>
                    <Header>
                        Display Name
                        <Header.Subheader>
                            The friendly forum name displayed on chainBB.com to the users. This string does not have to be unique but must be between 3 and 80 characters in length. This name can be modified at any time.
                        </Header.Subheader>
                    </Header>
                    <Form.Input
                        autoFocus
                        errorLabel={ errorLabel }
                        label='Forum Display Name'
                        name='name'
                        onChange={this.props.handleNameChange}
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
                    <Divider />
                    <Header>
                        Namespace
                        <Header.Subheader>
                            This cannot be modified after the reservation. The namespace is used in URLs and is the primary ID of this forum. A valid namespace must a unique lowercase string made up of a combination of numbers, letters, and dashes.
                        </Header.Subheader>
                    </Header>
                    <Form.Input
                        errorLabel={ errorLabel }
                        label='Forum Namespace'
                        name='namespace'
                        onChange={this.props.handleNamespaceChange}
                        placeholder=''
                        required
                        validationErrors={{
                            isDefaultRequiredValue: 'This field is required.',
                            matchRegexp: 'Invalid characters - only lowercase letters, numbers and dashes.',
                            nsUnique: 'This namespace is currently either taken or reserved, choose another.',
                        }}
                        validations={{
                            matchRegexp: /^[a-zA-Z0-9](?!.*--)[a-zA-Z0-9-]*[a-zA-Z0-9]$/,
                        }}
                        value={(namespace) ? namespace : suggestion}
                    />
                    <p>
                        <strong>Unique URL</strong>: https://chainbb.com/f/{(namespace) ? namespace : suggestion}
                    </p>
                    <Divider />
                    <Header>
                        Forum Creator
                        <Header.Subheader>
                            This account will be in control over any upgrades or moderation of this forum.
                        </Header.Subheader>
                    </Header>
                    <Form.Input
                        label='Forum Creator'
                        name='account'
                        required
                        value={this.props.account.name}
                    />
                    {namespace_unavailable}
                </Segment>
                <Button fluid color='blue' type='submit'>
                    Submit Forum Name Reservation
                </Button>
            </Form>
        )
        return form
    }
}
