import React from 'react'
import { Helmet } from "react-helmet";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { goToTop, goToAnchor } from 'react-scrollable-anchor'
import ReactDOMServer from 'react-dom/server';
import Noty from 'noty';

import { Divider, Grid, Header, Segment } from 'semantic-ui-react'

import * as accountActions from '../actions/accountActions'
import * as postActions from '../actions/postActions'
import * as preferenceActions from '../actions/preferenceActions'
import * as statusActions from '../actions/statusActions'

import Post from '../components/elements/post'
import PostForm from './post/form'
import PostFormHeader from '../components/elements/post/form/header'
import Response from '../components/elements/response'
import Paginator from '../components/global/paginator'

class Thread extends React.Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.match.params, { page: 1 })
  }

  componentWillMount() {
    this.fetchPost(this.state)
  }

  fetchPost(params) {
    goToTop();
    this.props.actions.resetPostState()
    this.props.actions.fetchPost(params)
    this.props.actions.fetchPostResponses(params)
    if (!this.props.account) {
      this.props.actions.fetchAccount()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.permlink !== this.state.permlink) {
      this.state = Object.assign({}, nextProps.match.params, { page: 1 });
      this.fetchPost(nextProps.match.params);
    }
  }

  scrollToPost = (id) => {
    let page = this.getPageForPost(id)
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

  changePage = (page = false, scrollTo = false) => {
    let state = {}
    if(page) {
      state.page = page
    }
    if(scrollTo) {
      state.scrollTo = scrollTo
    } else {
      goToTop()
    }
    this.setState(state)
  }

  componentDidUpdate() {
    const anchor = (this.state) ? this.state.scrollTo : false
    if(this.state && this.state.scrollTo && this.props.post.responses.length > 0) {
      this.setState({scrollTo: false})
      setTimeout(function() {
        goToAnchor(anchor)
      }, 50)
    }
    if(this.state && this.state.scrollToWhenReady && this.props.post.responses.length > 0) {
      this.scrollToPost(this.state.scrollToWhenReady)
      this.setState({
        scrollToWhenReady: false
      })
    }
  }

  componentDidMount() {
    const { hash } = location;
    const regexPage = /#comments-page-(\d+)+$/
    const regexPost = /#@?([A-Za-z0-9\-_]+)\/([A-Za-z0-9\-_]+)$/
    let matchesPage = hash.match(regexPage)
    let matchesPost = hash.match(regexPost)
    if(matchesPage) {
      this.setState({
        page: parseInt(matchesPage[1], 10)
      })
    }
    if(matchesPost) {
      let anchor = matchesPost[1] + '/' + matchesPost[2]
      this.setState({
        scrollToWhenReady: anchor
      })
    }
  }

  handleCancel = () => {}

  handleResponse = () => {
    new Noty({
      closeWith: ['click', 'button'],
      layout: 'topRight',
      progressBar: true,
      theme: 'semanticui',
      text: ReactDOMServer.renderToString(
        <Header>
          Your post has been submitted!
          <Header.Subheader>
            It may take a few moments to appear on chainBB.com, and will appear at the end of this thread.
          </Header.Subheader>
        </Header>
      ),
      type: 'success',
      timeout: 8000
    }).show();
    this.setState({ submitted: new Date() })
  }

  render() {
    let page = (this.state) ? this.state.page : 1,
        perPage = this.props.preferences.threadPostsPerPage,
        responses = (this.props.post) ? this.props.post.responses : 0,
        content = (this.props.post) ? this.props.post.content : false,
        pages = Math.ceil(responses.length / perPage),
        postForm = false
    let comments_nav = (
      <Grid id={(page ? `comments-page-${page}` : '')}>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column className='mobile hidden' width={4}>
            <Header textAlign='center' size='huge' style={{padding: '0.9em 0'}}>
              Comments ({responses.length})
              <Header.Subheader>
                Page {page} of {pages}
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
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
    let postFormHeader = (
      <PostFormHeader
        title='Reply to Thread'
        subtitle='Replying to the thread will reply leave a response at the end of the thread responding to the original post.'
        />
    )
    if(this.props.post && this.props.post.content && this.props.account && this.props.account.isUser) {
      postForm = (
        <Segment secondary>
          <PostForm
            key={this.state.submitted}
            action='threadReply'
            actions={this.props.actions}
            formHeader={postFormHeader}
            disableAutoFocus={true}
            elements={['body']}
            parent={this.props.post.content}
            onCancel={this.handleCancel}
            onComplete={this.handleResponse}
            { ... this.props } />
          </Segment>
      )
    }
    let image = 'https://steemit-production-imageproxy-upload.s3.amazonaws.com/DQmckc76UaBZSicePvDG9dKwrgyS5GoZRxAnBZ8AzxtVwH8'
    if(content && content.json_metadata && content.json_metadata.image && content.json_metadata.image.length > 0) {
        image = content.json_metadata.image[0]
    }
    return (
      <div>
        <Helmet>
            <title>{content.title}</title>
            <meta name="description" content={`Posted by ${content.author} on ${content.created} UTC.`} />
            <meta itemprop="name" content={content.title} />
            <meta itemprop="description" content={`Posted by ${content.author} on ${content.created} UTC.`} />
            <meta itemprop="image" content={image} />
            <meta name="twitter:title" content={content.title} />
            <meta name="twitter:description" content={`Posted by ${content.author} on ${content.created} UTC.`} />
            <meta name="twitter:image:src" content={image} />
            <meta property="og:title" content={content.title} />
            <meta property="og:url" content={`http://netify.chainbb.com/${(content.post && content.post.forum) ? content.post.forum._id : content.category}/@${content.author}/${content.permlink}`} />
            <meta property="og:description" content={`Posted by ${content.author} on ${content.created} UTC.`} />
        </Helmet>
        <Post
          page={page}
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
        <Divider />
        <Grid>
          <Grid.Row>
            <Grid.Column className='mobile hidden' width={4}>

            </Grid.Column>
            <Grid.Column mobile={16} tablet={12} computer={12}>
              {postForm}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    post: state.post,
    preferences: state.preferences,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...postActions,
    ...preferenceActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
