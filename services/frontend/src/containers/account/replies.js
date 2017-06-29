import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Grid, Header, Segment } from 'semantic-ui-react'
import { goToTop } from 'react-scrollable-anchor'

import * as accountActions from '../../actions/accountActions'
import * as breadcrumbActions from '../../actions/breadcrumbActions'
import * as postActions from '../../actions/postActions'
import * as preferenceActions from '../../actions/preferenceActions'
import * as stateActions from '../../actions/stateActions'
import * as statusActions from '../../actions/statusActions'

import ForumPostReply from '../../components/elements/forum/post/reply'
import Paginator from '../../components/global/paginator'

class Replies extends React.Component {

  constructor(props) {
    super(props)
    const { post } = props;
    this.changePage = this.changePage.bind(this);
    const user = props.account.name || false
    if(user) {
      this.props.actions.fetchPostRepliesByAuthor(user);
      this.setState({user})
    }
    this.state = {
      loaded: false,
      page: 1,
      post,
      replies: [],
      totalReplies: 0,
      user
    }
  }
  changePage = (page) => {
    this.setState({
      page: page,
      replies: []
    })
    this.props.actions.fetchPostRepliesByAuthor(this.state.user, page);
    goToTop();
  }
  componentWillReceiveProps(nextProps) {
    const user = nextProps.account.name || false
    const { post } = nextProps
    if(nextProps.account && this.state.user !== user) {
      this.props.actions.fetchPostRepliesByAuthor(user);
      this.setState({user})
    }
    if(post.authors[user]) {
      const { replies, totalReplies } = post.authors[user]
      let content = false
      if(replies && replies.length > 0) {
        content = replies.map((topic, idx) => <ForumPostReply topic={topic} key={idx} {... nextProps} />)
      }
      this.setState({ content, replies, totalReplies })
    }
  }
  render() {
    const { totalReplies } = this.state
    let { content } = this.state
    if(!content) content = <Segment attached padded="very" loading style={{margin: '2em 0'}} />
    return (
      <div>
        <Segment stacked color="purple">
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Header
                  icon='inbox'
                  color='purple'
                  size='huge'
                  content='Post Replies'
                  subheader='The most recent replies to your posts.'
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>

            </Grid.Column>
            <Grid.Column width={8}>
              <Paginator
                page={this.state.page}
                perPage={20}
                total={totalReplies}
                callback={this.changePage}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {content}
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>

            </Grid.Column>
            <Grid.Column width={8}>
              <Paginator
                page={this.state.page}
                perPage={20}
                total={totalReplies}
                callback={this.changePage}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    post: state.post,
    preferences: state.preferences,
    state: state.state,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...breadcrumbActions,
    ...postActions,
    ...preferenceActions,
    ...stateActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Replies);
