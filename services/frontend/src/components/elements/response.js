import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'

import { Button, Dimmer, Divider, Grid, Header, Icon, Label, Loader, Segment } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as breadcrumbActions from '../../actions/breadcrumbActions'
import * as postActions from '../../actions/postActions'
import * as preferenceActions from '../../actions/preferenceActions'

import AccountLink from './account/link'
import MarkdownViewer from '../../utils/MarkdownViewer';
import PostContent from './post/content'
import Response404 from './response/404'

class Response extends React.Component {

  state = {
    revealed: []
  }

  getParent(post) {
    let collection = this.props.post.responses,
        parent_id = post.parent_author + '/' + post.parent_permlink
    for(var i = 0; i < collection.length; i++) {
      if(collection[i]['_id'] === parent_id) {
        return this.props.post.responses[i];
      }
    }
    return -1;
  }

  handleReveal = (e, data) => {
    console.log(e, data)
    const revealed = this.state.revealed
    if(revealed.indexOf(data.value) === -1) {
      revealed.push(data.value)
    }
    this.setState({revealed})
    e.preventDefault()
    return false
  }

  render() {
    let display = (
            <Grid.Row>
              <Grid.Column width={16}>
                <Segment clearing basic style={{minHeight: '150px'}}>
                  <Dimmer inverted active style={{minHeight: '150px', display: 'block'}}>
                    <Loader size='large' content='Loading Replies...'/>
                  </Dimmer>
                </Segment>
              </Grid.Column>
            </Grid.Row>
        ),
        post = this.props.post,
        count = (post && post.responses) ? post.responses.length : false
    if(post.content && post.content.children === 0) {
      display = <Response404 {...this.props} />
    }
    if(count && count > 0 && post.content.children > 0) {
      let start = (this.props.page - 1) * this.props.perPage,
          end = start + this.props.perPage,
          responses = this.props.post.responses.slice(start, end)
      let jsonMetadata = {}
      let high_quality_post = true
      let formId = 0
      if(count > 0) {
        display = responses.map((post, index) => {
          let account = (
                <Segment basic className="thread-author center aligned">
                  <img alt={post.author} src={`https://img.steemconnect.com/@${post.author}?size=80`} className="ui centered spaced rounded bordered image" />
                  <Header>
                    <AccountLink username={post.author} />
                  </Header>
                </Segment>
              ),
              hidden = (post.net_votes < 0),
              parent_post = this.getParent(post),
              quote = ''
          if(parent_post['_id']) {
            quote = (
              <div>
                <Segment padded>
                  <Header size='small'>
                    <AccountLink username={parent_post.author} />
                    {' '}
                    said
                    {' '}
                    <a onClick={this.props.scrollToPost.bind(this, parent_post._id)}>
                      <TimeAgo date={`${parent_post.created}Z`} />
                    </a>
                    {' '}
                    ...
                  </Header>
                  <Label
                    attached='top right'
                    style={{cursor: 'pointer'}}
                    onClick={this.props.scrollToPost.bind(this, parent_post._id)}>
                      <Icon name='toggle up' />
                      Jump to Original
                  </Label>

                  <MarkdownViewer formId={formId + '-viewer'} text={parent_post.body} jsonMetadata={jsonMetadata} large highQualityPost={high_quality_post}  />
                </Segment>
                <Divider hidden></Divider>
                <Divider hidden></Divider>
              </div>
            )
          }
          if(hidden && this.state.revealed.indexOf(post._id) === -1) {
            return (
              <Grid.Row key={index} id={post._id}>
                <Grid.Column className='mobile hidden' width={4}></Grid.Column>
                <Grid.Column mobile={16} tablet={12} computer={12}>
                  <Divider horizontal>
                    <Button basic size='tiny' onClick={this.handleReveal} value={post._id}>
                      Post by @{post.author} hidden (low ratings) - click to show
                    </Button>
                  </Divider>
                </Grid.Column>
              </Grid.Row>
            )
          }
          return <Grid.Row key={index} id={post._id}>
                  <Grid.Column className='mobile hidden' width={4}>
                    {account}
                  </Grid.Column>
                  <Grid.Column mobile={16} tablet={12} computer={12}>
                    <PostContent
                      content={post}
                      op={false}
                      quote={quote}
                      scrollToLatestPost={this.scrollToLatestPost}
                      { ...this.props } />
                  </Grid.Column>
                </Grid.Row>
        })
      }
    }
    return <Grid>
             {display}
           </Grid>
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
    ...breadcrumbActions,
    ...postActions,
    ...preferenceActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Response);
