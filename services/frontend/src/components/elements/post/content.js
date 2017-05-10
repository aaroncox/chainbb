import React from 'react';

import { Link } from 'react-router-dom'
import { Button, Divider, Header, Popup, Segment } from 'semantic-ui-react'
import MarkdownViewer from '../../../utils/MarkdownViewer';
import PostControls from './controls'
import PostForm from './form'
import PostFormHeader from './form/header'
import PlatformLink from '../../../utils/link/platform'
import TimeAgo from 'react-timeago'

export default class PostContent extends React.Component {

  handleResponding = (e) => {
    this.setState({
      responding: (this.state && this.state.responding) ? !this.state.responding : true,
    })
  }

  handleNewPost = (id) => {
    this.handleResponding()
    this.props.scrollToPost(id)
  }

  render() {
    let post = this.props.content,
        postContent = false,
        quote = this.props.quote,
        title = false,
        formHeader = (
          <PostFormHeader
            title='Leave a Reply'
            subtitle=''
            />
        ),
        responding = (this.state && this.state.responding) ? this.state.responding : false,
        postForm = false,
        postButton = (
          <Popup
            trigger={
              <Button floated='right'>
                <i className={"left quote icon"}></i>
                Leave a Reply
              </Button>
            }
            position='bottom center'
            inverted
            content='You must be logged in to post.'
            basic
          />
        )
    if(this.props.account.isUser) {
      postButton = <Button onClick={this.handleResponding} color='green' icon='left quote' content=' Leave a Reply' floated='right' />
    }
    if(responding) {
      postForm = (
        <PostForm
          formHeader={formHeader}
          elements={['body']}
          parent={post}
          onCancel={this.handleResponding}
          onComplete={this.handleNewPost}
          { ... this.props } />
      )
    }
    if(post.depth === 0) {
      let tags = false
      if(post.json_metadata && post.json_metadata.tags) {
        tags = post.json_metadata.tags.map((tag, i) => <span key={i}>
          {!!i && " • "}
          <Link to={`/topic/${tag}`}>
            #{tag}
          </Link>
        </span>)
      }
      title = (
        <Segment color='blue' secondary attached={(this.props.op && this.props.page === 1) ? 'top' : false} stacked={(this.props.op && this.props.page !== 1)}>
          <div className='ui huge header'>
            <h1 style={{margin: 0}}>
              {post.title}
            </h1>
            <Header.Subheader>
            {'↳ '}
            tagged
            {' '}
            {tags}
            </Header.Subheader>
          </div>
        </Segment>
      )
    }
    if(!this.props.op || (this.props.op && this.props.page === 1)) {
      postContent = (
        <div>
          <Segment attached='top' className='thread-post'>
            {quote}
            <MarkdownViewer formId={'viewer'} text={post.body} jsonMetadata={{}} large highQualityPost={true}  />
            <Divider hidden></Divider>
          </Segment>
          <PostControls
            target={post}
            { ...this.props }
            />
          <Segment basic clearing secondary attached='bottom'>
            {postButton}
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
        </div>
      )
    }
    return (
      <div>
        {title}
        {postContent}
        {postForm}
      </div>
    )
  }
}
