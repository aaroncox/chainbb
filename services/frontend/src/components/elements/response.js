import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import TimeAgo from 'react-timeago'

import { Button, Dimmer, Divider, Grid, Header, Icon, Label, Loader, Popup, Segment } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as breadcrumbActions from '../../actions/breadcrumbActions'
import * as postActions from '../../actions/postActions'
import * as preferenceActions from '../../actions/preferenceActions'

import MarkdownViewer from '../../utils/MarkdownViewer';
import PostContent from './post/content.js'
import UserLink from '../../utils/link/user'

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
      display = (
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment basic padded textAlign='center'>
              <Header size='huge'>
                No Responses yet!
                <Header.Subheader>
                  Be the first to leave a reply
                </Header.Subheader>
              </Header>
              <Popup
                trigger={
                  <div>
                    <Button primary size='large'>
                      <i className='pencil icon'></i>
                      Leave a Reply
                    </Button>
                  </div>
                }
                title='Not yet implemented'
                content='This is a placeholder - and will work in a later build!'
                position='left center'
                basic
                />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )
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
                              <UserLink username={post.author} />
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
                              <UserLink username={parent_post.author} />
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
                            <Grid.Column only='tablet computer' width={4}>
                              {account}
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={12} computer={12}>
                              <PostContent
                                quote={quote}
                                content={post}
                                scrollToLatestPost={this.scrollToLatestPost}
                                { ...this.props } />
                            </Grid.Column>
                          </Grid.Row>

        })
      }

    }
    return  <Segment basic>
              <Grid stackable divided='vertically'>
                {display}
              </Grid>
            </Segment>
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
