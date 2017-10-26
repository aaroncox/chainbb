import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Noty from 'noty';

import { Link } from 'react-router-dom'
import { Button, Divider, Header, Popup, Segment } from 'semantic-ui-react'

import MarkdownViewer from '../../../utils/MarkdownViewer';
import PostControls from './controls'
import PostForm from '../../../containers/post/form'
import PostFormHeader from './form/header'
import PlatformLink from '../../../utils/link/platform'
import TimeAgo from 'react-timeago'
import UserAvatar from '../account/avatar'
import AccountLink from '../account/link'

export default class PostContent extends React.Component {

  handleResponding = (e) => {
    this.setState({
      responding: (this.state && this.state.responding) ? !this.state.responding : true,
    })
  }

  handleRespondingComplete = (e) => {
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
    this.setState({
      responding: false
    })
  }

  handleEditing = () => {
    if(this.props.scrollToPost) {
      this.props.scrollToPost(this.props.content._id)
    }
    this.setState({
      editing: (this.state && this.state.editing) ? !this.state.editing : true,
    })
  }

  handleEditingComplete = (data) => {
    new Noty({
      closeWith: ['click', 'button'],
      layout: 'topRight',
      progressBar: true,
      theme: 'semanticui',
      text: ReactDOMServer.renderToString(
        <Header>
          Your post has been edited
          <Header.Subheader>
            It may take a few moments to update throughout chainBB.com.
          </Header.Subheader>
        </Header>
      ),
      type: 'success',
      timeout: 8000
    }).show();
    this.setState({
      editing: false,
      updatedPost: data.post
    })
  }

  render() {
    let post = this.props.content,
        postContent = false,
        postControls = false,
        postFooter = false,
        quote = this.props.quote,
        title = false,
        postFormHeader = (
          <PostFormHeader
            title='Leave a Reply'
            subtitle=''
            />
        ),
        editFormHeader = (
          <PostFormHeader
            title='Edit your Post'
            color='green'
            subtitle=''
            />
        ),
        responding = (this.state && this.state.responding) ? this.state.responding : false,
        editing = (this.state && this.state.editing) ? this.state.editing : false,
        editButton = false,
        editForm = false,
        postButton = (
          <Popup
            trigger={
              <Button floated='right'>
                <i className={"left quote icon"}></i>
                Reply
              </Button>
            }
            position='bottom center'
            inverted
            content='You must be logged in to post.'
            basic
          />
        ),
        postForm = false
    if (this.state && this.state.updatedPost) {
      const { updatedPost } = this.state;
      post.title = updatedPost.title;
      post.body = updatedPost.body;
      if (updatedPost.json_metadata && updatedPost.json_metadata.tags) {
        post.json_metadata.tags = updatedPost.json_metadata.tags;
      }
    }
    if(this.props.account && this.props.account.isUser) {
      postButton = (
        <Button
          onClick={this.handleResponding}
          color='green'
          icon='left quote'
          content='Reply'
          floated='right'
        />
      )
    }
    if(this.props.account && this.props.account.name === post.author) {
      editButton = (
        <Popup
          trigger={
            <Button
              basic
              onClick={this.handleEditing}
              color='grey'
              icon='pencil'
              floated='right'
            />
          }
          position='bottom center'
          inverted
          content='Edit your post'
          basic
        />
      )
    }
    if(responding) {
      postForm = (
        <Segment secondary color='green'>
          <PostForm
            action='create'
            actions={this.props.actions}
            formHeader={postFormHeader}
            elements={['body']}
            parent={post}
            onCancel={this.handleResponding}
            onComplete={this.handleRespondingComplete}
            { ... this.props }
          />
        </Segment>
      )
    }
    if(editing) {
      editForm = (
        <Segment basic>
          <PostForm
            action='edit'
            actions={this.props.actions}
            formHeader={editFormHeader}
            elements={(post.depth === 0) ? ['title', 'body', 'tags'] : ['body']}
            existingPost={post}
            account={this.props.account}
            onCancel={this.handleEditing}
            onComplete={this.handleEditingComplete}
          />
        </Segment>
      )
    }
    if(post.depth === 0) {
      let tags = false
      if(post.json_metadata && post.json_metadata.tags && typeof Array.isArray(post.json_metadata.tags)) {
        tags = post.json_metadata.tags.map((tag, i) => <span key={i}>
          {!!i && " • "}
          <Link to={`/topic/${tag}`}>
            #{tag}
          </Link>
        </span>)
      }
      title = (
        <Segment style={{ borderTop: '2px solid #2185D0' }} secondary attached stacked={(this.props.op && this.props.page !== 1)}>
          <Header size='huge'>
            <h1 style={{margin: 0}}>
              {post.title}
            </h1>
            <Header.Subheader>
            {'↳ '}
            tagged
            {' '}
            {tags}
            </Header.Subheader>
          </Header>
        </Segment>
      )
    }
    if(!this.props.op || (this.props.op && this.props.page === 1) || this.props.preview) {
      let postHeader = (
        <Header size='small' className='mobile only'>
          <UserAvatar username={post.author} />
          <Header.Subheader>
            posted by
          </Header.Subheader>
          <AccountLink username={post.author} />
          <Divider></Divider>
        </Header>
      )
      if(this.props.hideAuthor) {
        postHeader = false
      }
      postContent = (
        <Segment attached className='thread-post'>
          {postHeader}
          {quote}
          <MarkdownViewer formId={'viewer'} text={post.body} jsonMetadata={{}} large highQualityPost={true}  />
          <Divider hidden></Divider>
        </Segment>
      )
      if (!this.props.preview) {
        postControls = (
          <PostControls
            target={post}
            { ...this.props }
            />
        )
        postFooter = (
          <Segment basic clearing secondary attached='bottom'>
            {postButton}
            {editButton}
            <Link to={`#${post._id}`}>
              Posted <TimeAgo date={`${post.created}Z`} />
            </Link>
            <br/>
            <small>
              via
              {' '}
              <PlatformLink platform={post.json_metadata.app} />
            </small>
          </Segment>
        )
      }
    }
    return (
      <div>
        {title}
        {(editForm)
          ? (editForm)
          : (
            <div>
              {postContent}
              {postControls}
              {postFooter}
            </div>
          )
        }
        {postForm}
      </div>
    )
  }
}
