import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'

import { Container, Icon, Message } from 'semantic-ui-react'

import * as statusActions from '../../actions/statusActions'

class GlobalNotice extends Component {
  render() {
    const { height, height_processed } = this.props.status.network
    let warning = false
    if ( height > height_processed + 10) {
      const blocksBehind = height - height_processed
      const timeBehind = new Date() - blocksBehind * 3 * 1000
      warning = (
        <Container style={{margin: '0.5em 0 1em'}}>
          <Message warning>
            <Icon name='warning' />
            chainBB is currently <strong>{blocksBehind} blocks</strong> (<TimeAgo date={timeBehind} />) behind on syncronization due to networking issues. This may cause a delay in your actions displaying on chainBB.com.
          </Message>
        </Container>
      )
    }
    return warning
  }
}


function mapStateToProps(state, ownProps) {
  return {
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalNotice);
