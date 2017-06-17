import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { goToTop } from 'react-scrollable-anchor'
import ReactDOMServer from 'react-dom/server';
import Noty from 'noty';

import { Button, Dimmer, Divider, Grid, Header, Label, Loader, Popup, Segment } from 'semantic-ui-react'

import * as GLOBAL from '../global';
import * as breadcrumbActions from '../actions/breadcrumbActions'
import * as postActions from '../actions/postActions'
import * as statusActions from '../actions/statusActions'

import Paginator from '../components/global/paginator'
import ForumIndex from '../components/elements/forum/index'
import ForumHeader from '../components/elements/forum/header'
import ForumTitle from '../components/elements/forum/title'
import Forum404 from '../components/elements/forum/404'
import ForumPost from '../components/elements/forum/post'
import PostForm from './post/form'
import PostFormHeader from '../components/elements/post/form/header'

class Forum extends React.Component {
  constructor(props, state) {
    goToTop()
    super(props, state);
    this.state = {
      children: [],
      page: 1,
      topics: false,
      showNewPost: false,
      forum: {
        name: this.props.forumid
      }
    };
    this.getForum = this.getForum.bind(this);
  }

  changePage = (page) => {
    this.setState({page: page})
    this.getForum(page)
  }

  showNewPost = (e) => {
    this.setState({
      page: 1,
      showNewPost: true
    })
  }

  handleNewPost = (data) => {
    new Noty({
      closeWith: ['click', 'button'],
      layout: 'topRight',
      progressBar: true,
      theme: 'semanticui',
      text: ReactDOMServer.renderToString(
        <Header>
          Your post has been submitted!
          <Header.Subheader>
            It may take a few moments to appear on chainBB.com.
          </Header.Subheader>
        </Header>
      ),
      type: 'success',
      timeout: 8000
    }).show();
    this.setState({
      topics: false,
      showNewPost: false,
      loadingPosts: true
    })
    setTimeout(() => {
      this.getForum(1);
    }, 4000)
  }

  hideNewPost = (e) => {
    this.setState({
      showNewPost: false
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.forumid !== this.props.forumid) {
      this.getForum(1);
    }
  }

  componentWillMount() {
    this.props.actions.resetPostState()
  }

  componentDidMount() {
    this.getForum()
  }

  async getForum(page = 1) {
    this.setState({
      topics: false,
      showNewPost: false,
      loadingPosts: true
    })
    if (!page) page = 1;
    try {
      const { forumid } = this.props
      const response = await fetch(`${ GLOBAL.REST_API }/forum/${ forumid }?page=${ page }`)
      if (response.ok) {
        const result = await response.json()
        this.setState({
          forum: result.forum,
          children: result.children,
          topics: result.data
        });
        this.props.actions.setStatus({'network': result.network});
        const trail = [
          {
            name: result.forum.name,
            link: `/forum/${result.forum._id}`
          }
        ];
        if(result.forum && result.forum.parent) {
          trail.unshift({
            name: result.forum.parent_name,
            link: `/forum/${result.forum.parent}`
          });
        }
        this.props.actions.setBreadcrumb(trail)
      } else {
        console.error(response.status);
      }
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    let forum = this.state.forum,
        children = this.state.children,
        display = false,
        rows = false,
        controls = false,
        subforums = false,
        page = this.state.page,
        isUser = this.props.account.isUser,
        perPage = 20,
        posts = 0,
        topics = this.state.topics,
        newPostButton = (
          <Popup
            trigger={
              <Button floated='left' size='tiny'>
                <i className='pencil icon'></i>
                New Post
              </Button>
            }
            position='bottom center'
            inverted
            content='You must be logged in to post.'
            basic
          />
        )

    if(isUser) {
      newPostButton = (
        <Button floated='left' color='green' size='tiny' onClick={this.showNewPost}>
          <i className='pencil icon'></i>
          New Post
        </Button>
      )
    }
    // Disable posting for forums based on a list of accounts
    if(forum.accounts && forum.accounts.length > 0) {
      newPostButton = false
    }
    if(children.length > 0) {
      subforums = (
        <Segment secondary attached='bottom'>
          <Header
            icon='fork'
            content='Sub-forums'
          />
          {children.map((forum, index) => {
            return <ForumIndex forum={forum} key={index} />
          })}
        </Segment>
      )
    }
    if(forum._id) {
      if(this.state.showNewPost) {
        subforums = false
        display = (
          <PostForm
            formHeader={(
              <PostFormHeader
                title='Create a new Post'
                color='green'
                subtitle={
                  <span>
                    This post will automatically be tagged with
                    <Label horizontal>
                      #{forum.tags[0]}
                    </Label>
                    as the first tag to post in the
                    {' '}
                    <Link to={`/forum/${forum._id}`}>
                      {forum.name}
                    </Link>
                    {' '}
                    forum.
                  </span>
                }
                />
            )}
            forum={forum}
            elements={['body', 'rewards', 'title', 'tags']}
            onCancel={this.hideNewPost}
            onComplete={this.handleNewPost}
            { ... this.props } />
        )
      } else {
        if(topics.length > 0) {
          posts = (forum.stats) ? forum.stats.posts : 0
          if(topics.length > 0) {
            rows = topics.map((topic, idx) => <ForumPost topic={topic} key={idx} />)
            controls = (
              <Grid.Row>
                <Grid.Column width={6} verticalAlign="middle">
                  {newPostButton}
                </Grid.Column>
                <Grid.Column width={10} verticalAlign="middle">
                  <Paginator
                    page={page}
                    perPage={perPage}
                    total={posts}
                    callback={this.changePage}
                    />
                </Grid.Column>
              </Grid.Row>
            )
          }
          display = (
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Divider horizontal>Forum Threads</Divider>
                </Grid.Column>
              </Grid.Row>
              {controls}
              <Grid.Row>
                <Grid.Column width={16}>
                  <ForumHeader />
                  {rows}
                </Grid.Column>
              </Grid.Row>
              {controls}
            </Grid>
          )
        } else if(this.state.loadingPosts) {
          display = (
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Divider horizontal>Forum Threads</Divider>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16} style={{minHeight: '200px'}}>
                  <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
                    <Loader size='large' content='Loading Post...'/>
                  </Dimmer>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )
        } else {
          display = (
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Divider section>Forum Threads</Divider>
                  <Forum404 forum={forum} isUser={isUser} showNewPost={this.showNewPost} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )
        }
      }
    } else {
      display = <Segment>
        <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
          <Loader size='large' content='Loading Posts'/>
        </Dimmer>
      </Segment>
    }
    return(
      <div>
        <ForumTitle
          forum={forum}
          attached={(subforums) ? 'top' : false}
          { ... this.props } />
        {subforums}
        {display}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    post: state.post
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...breadcrumbActions,
    ...postActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Forum);
