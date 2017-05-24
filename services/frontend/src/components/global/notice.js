import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Container, Icon, Message } from 'semantic-ui-react'

import * as statusActions from '../../actions/statusActions'

class GlobalNotice extends Component {
  render() {
    const { height, head_block_number } = this.props.status.network
    let warning = false
    if ( head_block_number > height + 10) {
      warning = (
        <Container style={{margin: '0.5em 0 1em'}}>
          <Message warning>
            <Icon name='warning' />
            chainBB is currently behind on syncronization due to network issues by <strong>{head_block_number - height} blocks</strong>. Posts may take longer to appear than usual, but will show up.
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
