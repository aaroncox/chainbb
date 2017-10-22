import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Button, Dimmer, Grid, Header, Icon, Loader, Menu, Message, Modal, Segment, Table } from 'semantic-ui-react'

import * as accountActions from '../../../actions/accountActions'
import * as forumActions from '../../../actions/forumActions'
import * as statusActions from '../../../actions/statusActions'
import * as preferenceActions from '../../../actions/preferenceActions'

class ForumCreateButton extends React.Component {
    render() {
        const processing = false
        return(
            <Modal
                closeIcon={true}
                color='blue'
                size='small'
                trigger={ <Button color='green'>Create Forum</Button> }
            >
                <Segment basic style={{marginTop: 0}}>
                    <Dimmer active={processing}>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Header icon='settings' content='Step #1 - Reserving the forum name' style={{marginTop: 0}} />
                    <Modal.Content>
                        stuff
                    </Modal.Content>
                </Segment>
            </Modal>
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
        ...accountActions,
        ...forumActions,
        ...preferenceActions,
        ...statusActions,
    }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(ForumCreateButton);
