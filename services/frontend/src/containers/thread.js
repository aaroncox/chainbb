import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Divider, Grid, Header, Menu, Segment } from 'semantic-ui-react'

import * as accountActions from '../actions/accountActions'
import * as postActions from '../actions/postActions'
import * as preferenceActions from '../actions/preferenceActions'

import Post from '../components/elements/post'
import Response from '../components/elements/response'

class Thread extends React.Component {

  componentWillMount() {
    this.props.actions.resetPostState()
    this.props.actions.fetchPost(this.props.match.params)
    this.props.actions.fetchPostResponses(this.props.match.params)
    if (!this.props.account) {
      this.props.actions.fetchAccount()
    }
  }

  render() {
    let comments_nav = (
      <Grid>
        <Grid.Row stretched>
          <Grid.Column only='tablet computer' width={4}>
            <Header textAlign='center' size='huge' style={{padding: '0.9em 0'}}>
              Comments
            </Header>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Segment clearing basic padded>
              <Menu pagination floated='right'>
                <Menu.Item header>Page:</Menu.Item>
                <Menu.Item name='1'/>
              </Menu>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
    return (
      <div>
        <Post { ...this.props }/>
        <Divider></Divider>
        { comments_nav }
        <Divider horizontal>Page 1</Divider>
        <Response { ...this.props }/>
        <Divider></Divider>
        { comments_nav }
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...postActions,
    ...preferenceActions
  }, dispatch)}
}

export default connect(null, mapDispatchToProps)(Thread);
