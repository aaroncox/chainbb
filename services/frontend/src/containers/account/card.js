import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Button, Card, Image, Popup } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as statusActions from '../../actions/statusActions'
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
          <Card>
            <Image
              src={`https://img.steemconnect.com/@${username}?size=290`}
              style={{
                minHeight: '290px',
                minWidth: '290px'
              }}
            />
            <Card.Content>
              <Card.Header>
                <AccountLink
                  noPopup={true}
                  username={username}
                />
              </Card.Header>
            </Card.Content>
            {/*
            <Card.Content extra>
              <div className='ui two buttons'>
                <Button basic color='green'>Follow</Button>
              </div>
            </Card.Content>
            */}
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
