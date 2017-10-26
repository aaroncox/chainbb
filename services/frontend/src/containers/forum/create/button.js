import React from 'react';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _ from 'lodash'

import { Button, Dimmer, Header, Icon, Loader, Modal, Segment } from 'semantic-ui-react'
import ForumCreateForm from './form'

import * as GLOBAL from '../../../global';
import * as accountActions from '../../../actions/accountActions'
import * as forumActions from '../../../actions/forumActions'
import * as statusActions from '../../../actions/statusActions'
import * as preferenceActions from '../../../actions/preferenceActions'

class ForumCreateButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            account: '',
            loading: false,
            name: '',
            namespace: '',
            namespace_unavailable: false,
            payload: [],
            redirecting: false,
            suggestion: '',
        }
    }
    componentWillReceiveProps(nextProps) {
        const { forum } = nextProps
        const t = this
        if(forum.last) {
            switch(forum.last.type) {
                case "FORUM_RESERVATION_RESOLVED":
                    const { namespace } = forum.last.payload[1]
                    t.setState({
                        loading: false,
                        redirecting: true,
                        payload: forum.last.payload,
                    })
                    setTimeout(() => {
                        this.props.history.push(`/f/${namespace}`);
                    }, 6000)
                    break;
                default:
            }
        }
    }

    handleNamespaceChange = (e, data) => {
        this.setState({namespace: data.value})
    }
    handleNameChange = (e, data) => {
        let nextState = {name: data.value}
        if (this.state.namespace === '') {
            const suggestion = data.value.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
            nextState['suggestion'] = suggestion
        }
        this.setState(nextState)
    }
    handleSubmit = (data) => {
        const t = this
        this.setState({
            loading: true,
            namespace_unavailable: false,
        })
        this.nsUnique(data.namespace).then((exists) => {
            if(exists) {
                t.setState({
                    loading: false,
                    namespace_unavailable: true,
                })
            } else {
                t.props.actions.forumReservation(this.props.account, data.name, data.namespace)
                console.log("submitted to action")
            }
        })
    }
    async nsUnique(value) {
        try {
          let uri = GLOBAL.REST_API + `/api/ns_lookup?ns=${value}`;
          const response = await fetch(uri);
          if (response.ok) {
            const result = await response.json();
            return result.data.exists
          } else {
            console.error(response.status);
          }
        } catch(e) {
          console.error(e);
        }
    }
    render() {
        const processing = false
        let form = (
            <ForumCreateForm
                account={this.props.account}
                handleSubmit={this.handleSubmit.bind(this)}
                handleNameChange={this.handleNameChange.bind(this)}
                handleNamespaceChange={this.handleNamespaceChange.bind(this)}
                loading={this.state.loading}
                name={this.state.name}
                namespace={this.state.namespace}
                namespace_unavailable={this.state.namespace_unavailable}
                suggestion={this.state.suggestion}
            />
        )
        if(this.state.redirecting) {
            const reservation = this.state.payload[1] || {}
            form = (
                <Segment textAlign='center' padded size='huge' color='blue'>
                    <Icon name='circle notched' loading />
                    <Header size='huge'>
                        <Header.Subheader>
                            Reservation Broadcast Successful
                        </Header.Subheader>
                        You will be redirected to the reservation for <strong>{reservation.name}</strong> in a moment.
                    </Header>
                    <p>
                        If you are not redirected,
                        {' '}
                        <a href={`/f/${reservation.namespace}`}>click here to continue</a>.
                    </p>
                </Segment>
            )
        }
        let display = (
            <Modal
                closeIcon={true}
                color='blue'
                size='small'
                trigger={ <Button color='purple'>Reserve Forum</Button> }
            >
                <Segment basic style={{marginTop: 0}}>
                    <Dimmer active={processing}>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Header icon='square outline' content='Step #1 - Create a Forum Reservation' style={{marginTop: 0}} />
                    <Modal.Content>
                        <Segment basic padded>
                            {form}
                        </Segment>
                    </Modal.Content>
                </Segment>
            </Modal>
        )
        if(!this.props.account.isUser) {
            display = (
                <Button color='grey'>You must be logged in</Button>
            )
        }
        return display
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForumCreateButton));
