import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'

import { Container, Icon, Message } from 'semantic-ui-react'

import * as statusActions from '../../actions/statusActions'

class GlobalNotice extends Component {
  render() {
    const { height, head_block_number } = this.props.status.network
    let warning = false
    if ( head_block_number > height + 10) {
      const timeBehind = new Date() - (head_block_number - height) * 3 * 1000
      console.log(timeBehind)
      warning = (
        <Container style={{margin: '0.5em 0 1em'}}>
          <Message warning>
            <Icon name='warning' />
            chainBB is currently <strong>{head_block_number - height} blocks</strong> (<TimeAgo date={timeBehind} />) behind on syncronization due to networking issues. This may cause a delay in your actions displaying on chainBB.com.
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
