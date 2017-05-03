import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { goToAnchor } from 'react-scrollable-anchor'

import { Divider, Grid, Header } from 'semantic-ui-react'

import * as accountActions from '../actions/accountActions'
import * as postActions from '../actions/postActions'
import * as preferenceActions from '../actions/preferenceActions'

import Post from '../components/elements/post'
import Response from '../components/elements/response'
import Paginator from '../components/global/paginator'

class Thread extends React.Component {

  componentWillMount() {
    this.props.actions.resetPostState()
    this.props.actions.fetchPost(this.props.match.params)
    this.props.actions.fetchPostResponses(this.props.match.params)
    if (!this.props.account) {
      this.props.actions.fetchAccount()
    }
  }

  scrollToPost = (id) => {
    let page = this.getPageForPost(id)
    // Couldn't determine page, goto last and bottom
    if(page === false) {
      let total = this.props.post.responses.length,
          perPage = this.props.preferences.threadPostsPerPage
      page = Math.ceil(total / perPage)
      id = 'comments-new'
    }
    // Change page and focus
    this.changePage(page, id)
  }

  getPageForPost = (id) => {
    let collection = this.props.post.responses,
        perPage = this.props.preferences.threadPostsPerPage,
        position = false
    for(var i = 0; i < collection.length; i++) {
      if(collection[i]['_id'] === id) {
        position = i
      }
    }
    if(position === false) return position
    return Math.floor(position / perPage) + 1;
  }

  changePage = (page, scrollTo = false) => {
    this.setState({
      page: page,
      scrollTo: scrollTo
    })
  }

  componentDidUpdate() {
    if(this.state && this.state.scrollTo) {
      goToAnchor(this.state.scrollTo, true)
      this.setState({scrollTo: false})
    }
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.hashChange.bind(this), false);
  }

  hashChange() {
    const { hash } = location;
    const regex = /#comments-page-(\d+)+$/
    let matches = hash.match(regex)
    if(!matches) {
      this.setState({page: 1})
    } else {
      this.setState({page: parseInt(matches[1])})
    }
  }

  render() {
    let page = (this.state) ? this.state.page : 1,
        perPage = this.props.preferences.threadPostsPerPage,
        responses = (this.props.post) ? this.props.post.responses : 0
    let comments_nav = (
      <Grid>
        <Grid.Row stretched>
          <Grid.Column only='tablet computer' width={4}>
            <Header textAlign='center' size='huge' style={{padding: '0.9em 0'}}>
              Comments ({responses.length})
            </Header>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12} id={`comments-page-${page}`}>
            <Paginator
              page={page}
              perPage={perPage}
              total={responses.length}
              callback={this.changePage}
              />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
    return (
      <div>
        <Post
          changePage={this.changePage}
          scrollToPost={this.scrollToPost}
          { ...this.props }/>
        <Divider></Divider>
        { comments_nav }
        <Divider horizontal>Page {page}</Divider>
        <Response
          page={page}
          perPage={perPage}
          changePage={this.changePage}
          scrollToPost={this.scrollToPost}
          { ...this.props } />
        <Divider horizontal id='comments-new'>Page {page}</Divider>
        { comments_nav }
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
