import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import * as accountActions from '../../actions/accountActions'
import * as postActions from '../../actions/postActions'
import * as preferenceActions from '../../actions/preferenceActions'

import { Dimmer, Grid, Loader } from 'semantic-ui-react'
import PostContent from './post/content'
import PostSidebar from './post/sidebar'

import "./post/styles.css"

class Post extends React.Component {

  render() {
    let display = (
          <Grid.Column only='tablet computer' width={16}>
            <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
              <Loader size='large' content='Loading Post...'/>
            </Dimmer>
          </Grid.Column>
        ),
        sidebar = null
    if(this.props.post.content) {
      sidebar = (
        <Grid.Column className='mobile hidden' width={4}>
          <PostSidebar
            op={true}
            { ...this.props } />
        </Grid.Column>
      )
      display = (
        <Grid.Column mobile={16} tablet={12} computer={12}>
          <PostContent
            op={true}
            content={this.props.post.content}
            { ...this.props } />
        </Grid.Column>
      )
    }
    return(
            <div id={this.props.post.content._id}>
              <Grid>
                <Grid.Row>
                  {sidebar}
                  {display}
                </Grid.Row>
              </Grid>
            </div>
          );
  }

}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    post: state.post,
    preferences: state.preferences
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...postActions,
    ...preferenceActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
