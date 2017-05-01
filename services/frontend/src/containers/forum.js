import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Dimmer, Header, Label, Loader } from 'semantic-ui-react'

import * as GLOBAL from '../global';
import * as breadcrumbActions from '../actions/breadcrumbActions'
import * as postActions from '../actions/postActions'

import ForumHeader from '../components/elements/forum/header'
import ForumTitle from '../components/elements/forum/title'
import Forum404 from '../components/elements/forum/404'
import ForumPost from '../components/elements/forum/post'
import PostForm from '../components/elements/post/form'

class Forum extends React.Component {
  constructor(props, state) {
    super(props, state);
    this.state = {
      topics: false,
      showNewPost: false,
      forum: {
        name: this.props.forumid
      }
    };
    this.getForum = this.getForum.bind(this);
  }

  showNewPost = (e) => {
    this.setState({
      showNewPost: true
    })
  }

  hideNewPost = (e) => {
    this.setState({
      showNewPost: false
    })
  }

  componentWillMount() {
    this.props.actions.resetPostState()
  }

  componentDidMount() {
    this.getForum()
  }

  async getForum() {
    this.setState({
      topics: false,
      showNewPost: false
    })
    try {
      const { forumid } = this.props;
      const response = await fetch(`${ GLOBAL.REST_API }/forum/${ forumid }`);
      if (response.ok) {
        const result = await response.json();
        this.setState({
          forum: result.forum,
          topics: result.data
        });
        this.props.actions.setBreadcrumb([
          {
            name: result.forum.name,
            link: `/forum/${result.forum._id}`
          }
        ])
      } else {
        console.error(response.status);
      }
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    let forum = this.state.forum,
        loaded = (typeof this.state.topics === 'object'),
        topics = this.state.topics,
        display = (
          <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
            <Loader size='large' content='Loading'/>
          </Dimmer>
        )
    if(loaded) {
      if(topics.length > 0) {
        let posts = topics.map((topic, idx) => <ForumPost topic={topic} key={idx} />)
        display = (
          <div>
            <ForumHeader />
            {posts}
          </div>
        )
      } else {
        display = <Forum404 forum={forum} />
      }
    }
    if(forum._id && this.state.showNewPost) {
      let formHeader = (
        <Header size='large'>
          Create a new Post
          <Header.Subheader>
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
          </Header.Subheader>
        </Header>
      )
      display = (
        <PostForm
          formHeader={formHeader}
          forum={forum}
          elements={['body', 'title', 'tags']}
          onCancel={this.hideNewPost}
          onComplete={this.getForum}
          { ... this.props } />
      )
    }
    return(
      <div>
        <ForumTitle
          forum={forum}
          showNewPost={this.showNewPost}
          { ... this.props } />
        {display}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...breadcrumbActions,
    ...postActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Forum);
