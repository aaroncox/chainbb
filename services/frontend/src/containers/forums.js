import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { goToTop } from 'react-scrollable-anchor'
import NumericLabel from '../utils/NumericLabel'

import { Dimmer, Divider, Loader, Grid, Header, Popup, Segment  } from 'semantic-ui-react'

import * as GLOBAL from '../global';
import * as breadcrumbActions from '../actions/breadcrumbActions'
import * as postActions from '../actions/postActions'
import * as statusActions from '../actions/statusActions'

import ForumLink from '../utils/forumlink'
import UserLink from '../utils/link/user'
import TimeAgo from 'react-timeago'

class Forums extends React.Component {

    constructor(props, state) {
      goToTop()
      super(props);
      this.state = {
        group: false,
        forums: []
      };
      this.getForums = this.getForums.bind(this);
    }

    componentDidMount() {
      this.props.actions.setBreadcrumb([])
    }

    componentWillMount() {
      this.props.actions.resetPostState()
    }

    async getForums() {
      try {
        const uri = GLOBAL.REST_API;
        if(this.props.forums && this.props.forums.group) {
          uri = uri + '/' + this.props.forums.group;
        }
        const response = await fetch(uri);
        if (response.ok) {
          const result = await response.json();
          this.setState({
            forums: result.data,
            group: this.props.forums.group
          });
          this.props.actions.setStatus({'height': result.height});
        } else {
          console.error(response.status);
        }
      } catch(e) {
        console.error(e);
      }
    }

    render() {
      let loaded = (this.state.forums.length > 0),
          loader = {
            style:{
              minHeight: '100px',
              display: 'block'
            },
            content: 'Loading'
          },
          display = <Dimmer active inverted style={loader.style}>
                      <Loader size='large' content={loader.content}/>
                    </Dimmer>
      if(this.props.forums.group !== this.state.group) {
        this.props.actions.resetPostState()
        this.getForums()
      }
      if(loaded) {
        let forums = this.state.forums,
            // Find the unique forum groupings
            groups = forums.map((forum, index) => {
              return (!this.state.forums[index-1] || this.state.forums[index-1].group !== forum.group) ? forum['group'] : null
            }).filter(function(name) {
              return name !== null
            })
        display = groups.map((group) => {
          let groupings = forums.filter(function(forum) {
            return forum['group'] === group
          }).map((forum, index) => {
            let author = (forum.last_reply && forum.last_reply.created === forum.updated) ? forum.last_reply['author'] : ((forum.last_post) ? forum.last_post['author'] : null),
                url = (forum.last_reply && forum.last_reply.created === forum.updated) ? forum.last_reply['url'] : ((forum.last_post) ? forum.last_post['url'] : null),
                created = (forum.last_reply && forum.last_reply.created === forum.updated) ? forum.last_reply['created'] : ((forum.last_post) ? forum.last_post['created'] : null),
                title = (forum.last_reply && forum.last_reply.created === forum.updated) ? forum.last_reply['title'] : ((forum.last_post) ? forum.last_post['title'].substring(0, 100) : null),
                latest_post = null,
                numberFormat = {
                  shortFormat: true,
                  shortFormatMinValue: 1000
                }
            if(title && title.length > 100) {
              title = title.substring(0, 100) + " ..."
            }
            if(author) {
              latest_post = <Header size='tiny'>
                              <img alt='{author}' src={`https://img.steemconnect.com/@${author}?size=35`} className="ui rounded floated left mini image" style={{minHeight: '35px', minWidth: '35px'}}/>
                              <Link to={`${url.split("#")[0]}`}>
                                {title}
                              </Link>
                              <Header.Subheader>
                                {'↳ '}
                                <Link to={`${url}`}>
                                  <TimeAgo date={`${created}Z`} />
                                </Link>
                                {' • '}
                                <UserLink username={author} />
                              </Header.Subheader>
                            </Header>
            }
            // (this.state.forums[index-1]) && this.state.forums[index-1].group != forum.group
            return <Segment attached key={forum._id}>
              <Grid>
                <Grid.Row verticalAlign='middle'>
                  <Grid.Column width={7}>
                    <Header size='medium'>
                      <ForumLink forum={forum}/>
                      <Header.Subheader style={{marginTop: '0.1rem'}}>
                        {'↳ '}
                        <Popup
                          trigger={<a>{forum.tags.length} Tags</a>}
                          position='left center'
                          hoverable={true}
                          content={forum.tags.map((tag, i) => <span key={i}>
                            {!!i && ", "}
                            <Link to={`/topic/${tag}`}>
                              #{tag}
                            </Link>
                          </span>)}
                        />
                        {
                          (forum.description)
                            ? <p>{forum.description}</p>
                            : ''
                        }
                      </Header.Subheader>
                    </Header>
                  </Grid.Column>
                  <Grid.Column width={2} textAlign='center'>
                    <Header size='small'>
                      <NumericLabel params={numberFormat}>{(forum.stats) ? forum.stats.posts : '?'}</NumericLabel>
                    </Header>
                  </Grid.Column>
                  <Grid.Column width={2} textAlign='center'>
                    <Header size='small'>
                      <NumericLabel params={numberFormat}>{(forum.stats) ? forum.stats.replies : '?'}</NumericLabel>
                    </Header>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    {latest_post}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          })
          return  <div key={group}>
                    <Segment secondary attached>
                      <Grid stackable>
                        <Grid.Row>
                          <Grid.Column width={7}>
                            <Header size='small'>
                              {group}
                            </Header>
                          </Grid.Column>
                          <Grid.Column width={2} textAlign='center'>
                            <Header size='tiny'>
                              Posts
                            </Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header size='tiny' textAlign='center'>
                              Replies
                            </Header>
                          </Grid.Column>
                          <Grid.Column width={5}>
                            <Header size='tiny'>
                              Recently Active
                            </Header>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                    {groupings}
                    <Divider hidden></Divider>
                  </div>
        })
      }
      return(<div>
        {display}
      </div>);
    }
}

function mapStateToProps(state, ownProps) {
  return {
    preferences: state.preferences,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...breadcrumbActions,
    ...postActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Forums);
