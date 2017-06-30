import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Card, Popup } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as statusActions from '../../actions/statusActions'

import AccountAvatar from '../../components/elements/account/avatar'
import AccountFollow from '../../components/elements/account/follow'
import AccountLink from '../../components/elements/account/link'

class AccountCard extends React.Component {
  render() {
    let { username, trigger } = this.props;
    return (
      <Popup
        hoverable
        basic
        trigger={trigger}
        content={
          <Card
            raised={true}
          >
            <AccountAvatar
              noPopup={true}
              size={290}
              username={username}
            />
            <Card.Content>
              <Card.Header>
                <AccountLink
                  noPopup={true}
                  username={username}
                />
              </Card.Header>
            </Card.Content>
            <Card.Content extra>
              <div className='ui two buttons'>
                <AccountFollow who={username} {...this.props}/>
              </div>
            </Card.Content>
          </Card>
        }
        style={{
          background: 'transparent',
          padding: 0
        }}
      />
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    preferences: state.preferences,
    state: state.state
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountCard);
