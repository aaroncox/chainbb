import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'

import { Dimmer, Divider, Grid, Header, Icon, Label, Loader, Segment } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as breadcrumbActions from '../../actions/breadcrumbActions'
import * as postActions from '../../actions/postActions'
import * as preferenceActions from '../../actions/preferenceActions'

import AccountLink from './account/link'
import MarkdownViewer from '../../utils/MarkdownViewer';
import PostContent from './post/content'
import Response404 from './response/404'

class Response extends React.Component {

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

  render() {
    let display = (
          <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
            <Loader size='large' content='Loading Post...'/>
          </Dimmer>
        ),
        count = (this.props.post && this.props.post.responses) ? this.props.post.responses.length : false
    if(count === 0) {
      display = <Response404 {...this.props} />
    }
    if(count && count > 0) {
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
