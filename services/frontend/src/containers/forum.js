import React from 'react'
import { Helmet } from "react-helmet";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";
import { goToTop } from 'react-scrollable-anchor'
import ReactDOMServer from 'react-dom/server'
import Noty from 'noty'
import slug from 'slug'

import { Accordion, Dimmer, Grid, Header, Icon, Loader, Message, Segment } from 'semantic-ui-react'

import * as GLOBAL from '../global';
import * as breadcrumbActions from '../actions/breadcrumbActions'
import * as forumActions from '../actions/forumActions'
import * as moderationActions from '../actions/moderationActions'
import * as subscriptionActions from '../actions/subscriptionActions'
import * as postActions from '../actions/postActions'
import * as statusActions from '../actions/statusActions'

import ForumControls from '../components/elements/forum/controls'
import ForumManage from './forum/manage'
import ForumIndex from '../components/elements/forum/index'
import ForumHeader from '../components/elements/forum/header'
import ForumTitle from '../components/elements/forum/title'
import Forum404 from '../components/elements/forum/404'
import ForumPost from '../components/elements/forum/post'
import PostForm from './post/form'
import PostFormHeader from '../components/elements/post/form/header'

const tiers = [
    {
        bounds: [0, 0.999],
        moderation: false,
        name: 'Reservation',
        features: [

        ],
    },
    {
        bounds: [1, 49.999],
        moderation: false,
        name: 'Basic Forum',
        features: [
            'chainBB.com Hosting',
            'Users can post + vote',
            'Unique namespace and URL',
        ],
    },
    {
        bounds: [50, 249.999],
        moderation: true,
        name: 'Moderated Forum',
        features: [
            'Moderation controls for forum creator.'
        ],
    },
    {
        bounds: [250, 99999],
        moderation: true,
        name: 'Premium Forum',
        features: [
            '5% Beneficiary Rewards for forum creator.'
        ],
    },
]

const configSections = ['overview', 'funding', 'permissions', 'configuration']

class Forum extends React.Component {
  constructor(props, state) {
    goToTop()
    const hash = props.history.location.hash.replace('#','')
    super(props, state);
    this.state = {
      children: [],
      loadingPosts: true,
      page: 1,
      topics: false,
      filter: (hash) ? hash : false,
      newForum: false,
      showConfig: (['overview', 'funding', 'permissions', 'configuration'].indexOf(props.section) >= 0) ? true : false,
      showNewPost: false,
      showModerated: false,
      showSubforums: false,
      forum: {
        name: this.props.forumid
      }
    };
    this.getForum = this.getForum.bind(this);
  }

  changePage = (page) => this.setState({ page: page }, () => this.getForum(page))
  showNewPost = () => this.setState({ page: 1, showNewPost: true })
  hideNewPost = (e) => this.setState({ showNewPost: false })
  showConfig = () => {
      if(!this.state.showConfig) {
          this.setState({showConfig: true})
          this.props.history.push(`/f/${this.props.forumid}/overview`);
      }
  }
  hideConfig = () => {
      if(this.state.showConfig) {
          this.setState({showConfig: false})
          this.props.history.push(`/f/${this.props.forumid}`);
          this.getForum()
      }
  }
  toggleConfig = () => (this.state.showConfig) ? this.hideConfig() : this.showConfig()
  showSubforums = () => this.setState({showSubforums: true})
  hideSubforums = () => this.setState({showSubforums: false})
  toggleSubforums = () => (this.state.showSubforums) ? this.hideSubforums() : this.showSubforums()
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

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.forumid !== this.props.forumid) {
      this.getForum(1);
    }
    if(prevProps.section !== this.props.section) {
        this.setState({
            showConfig: (configSections.indexOf(this.props.section) >= 0) ? true : false,
        })
    }
    let hash = this.props.location.hash.replace('#','')
    if(!hash) hash = false
    if(hash !== this.state.filter) {
        this.setState({
            filter: hash,
        }, this.getForum)
    }
  }

  componentWillMount() {
    this.props.actions.resetPostState()
  }

  componentDidMount() {
    this.getForum()
  }

  setForum = (forum) => {
      this.setState({forum})
      this.props.actions.setForum(forum)
  }
  setBreadcrumb = (result) => {
      if (result.forum) {
          const trail = [
            {
              name: result.forum.name,
              link: `/f/${result.forum._id}`
            }
          ];
          if(result.forum.parent) {
            trail.unshift({
              name: result.forum.parent_name,
              link: `/f/${result.forum.parent}`
            });
          }
          this.props.actions.setBreadcrumb(trail)
      }
  }
  completeReservation = () => {
      this.setState({
          newForum: true,
          reservation: false,
          filter: 'configuration',
          showConfig: true
      }, () => {
          this.props.history.push(`/f/${this.props.forumid}/configuration`)
          this.getForum()
      })
  }

  changeFilter = (data) => {
      let filter = slug(data).toString()
      if(filter === 'false') {
          filter = false
      }
      const hash = this.props.history.location.hash.replace('#','')
      if(filter && filter !== hash) {
          this.props.history.push(`/f/${this.props.forumid}#${filter}`)
      } else if(hash) {
          this.props.history.push(`/f/${this.props.forumid}`)
      }
  }

  async getForum(page = false) {
    this.setState({
      topics: false,
      showNewPost: false,
      loadingPosts: true
    })
    if (!page) page = this.state.page;
    try {
      const { forumid } = this.props
      let url = `${ GLOBAL.REST_API }/forum/${ forumid }?page=${ page }`
      if (this.state.showModerated) {
        url += `&filter=all`
      } else if (this.state.filter && this.state.filter !== 'false') {
        url += `&filter=${this.state.filter}`
      }
      const response = await fetch(url)
      if (response.ok) {
          const result = await response.json()
          this.props.actions.setStatus({'network': result.network});
          this.setForum(result.forum)
          this.setBreadcrumb(result)
          // If a valid forum is found
          if (result.status === 'ok') {
              // and we have data
              if (result.data && (!result.meta || result.meta.configured !== false)) {
                  // display the forum
                  this.setState({
                    loadingPosts: false,
                    children: result.children,
                    topics: result.data
                  });
              }
              // if we are returned the configured flag as false
              if (result.meta && result.meta.configured === false) {
                  // display the config panel
                  this.setState({
                      loadingPosts: false,
                      showConfig: true,
                  })
              }
          }
          // If this forum is not found, but we have a reservation
          if (result.status === 'not-found') {
              // show the reservation
              this.setState({
                  reservation: result.meta.reservation,
                  loadingPosts: false
              })
          }
      } else {
        console.error(response.status);
      }
    } catch(e) {
      console.error(e);
    }
  }

  changeVisibility = (e, data) => {
    this.setState({showModerated: data.checked}, () => {
      this.getForum()
    })
  }

  removeTopic = (id) => {
    const topics = this.state.topics.filter(function(topic) {
      return topic._id !== id;
    });
    this.setState({topics})
  }
  getTier(funded) {
      if(!funded) funded = 0
      return tiers.filter((tier) => {
          return (funded >= tier.bounds[0] && funded < tier.bounds[1])
      }).pop()
  }
  getTierFeatures(funded) {
      if(!funded) funded = 0
      return [].concat.apply([], (tiers.filter((tier) => {
          return (funded >= tier.bounds[0])
      }).map((tier) => {
          return tier.features
      })))
  }
  render() {
    let account = this.props.account,
        forum = this.state.forum,
        tier = (forum) ? this.getTier(forum.funded) : this.getTier(0),
        reservation = this.state.reservation,
        children = this.state.children,
        controls = false,
        display = false,
        subforums = false,
        page = this.state.page,
        isUser = this.props.account.isUser,
        perPage = 20,
        posts = (forum && forum.stats) ? forum.stats.posts : 0,
        topics = this.state.topics
    if(children.length > 0) {
        const panels = [
            {
              key: 'subforums',
              title: (
                  <Header
                      size='small'
                      key='subforums-title'
                      as={Accordion.Title}
                      content={`Subforums (${children.length})`}
                      icon='fork'
                      onClick={this.toggleSubforums}
                      style={{marginBottom: 0}}
                  />
              ),
              content: {
                  active: this.state.showSubforums,
                  content: (
                      <Segment basic>
                          {children.map((forum, index) => {
                            return <ForumIndex forum={forum} key={index} />
                          })}
                      </Segment>
                  ),
                  key: 'subforums'
              },
            }
        ]
        subforums = (
            <Segment secondary attached='bottom'>
                <Accordion panels={panels} />
            </Segment>
        )
    }
    if(forum && forum._id) {
        controls = (
            <Segment basic vertical>
                <ForumControls
                    changePage={this.changePage.bind(this)}
                    changeVisibility={this.changeVisibility.bind(this)}
                    isUser={isUser}
                    page={page}
                    perPage={perPage}
                    posts={posts}
                    showModerated={this.state.showModerated}
                    showNewPost={this.showNewPost.bind(this)}
                />
            </Segment>
          )
    }
    if(!this.state.loadingPosts) {
      if(forum && forum._id) {
          if(this.state.showConfig) {
            controls = false
            display = (
                <ForumManage
                    account={account}
                    forum={forum}
                    newForum={this.state.newForum}
                    getTier={this.getTier.bind(this)}
                    getTierFeatures={this.getTierFeatures.bind(this)}
                    hideConfig={this.hideConfig.bind(this)}
                    tier={tier}
                    section={this.props.section}
                />
            )
          } else if(this.state.showNewPost) {
            controls = false
            display = (
              <PostForm
                formHeader={(
                  <PostFormHeader
                    title='Create a new Post'
                    color='green'
                    subtitle={
                      <span>
                        This post will automatically be placed within /f/{forum._id}.
                      </span>
                    }
                    />
                )}
                forum={forum}
                filter={this.state.filter}
                elements={['body', 'rewards', 'title', 'tags']}
                onCancel={this.hideNewPost}
                onComplete={this.handleNewPost}
                { ... this.props } />
            )
          } else {
            if(topics.length > 0) {
              display = (
                <div>
                    <ForumHeader />
                    {topics.map((topic, idx) => (
                      <ForumPost
                        account={account}
                        actions={this.props.actions}
                        changeFilter={this.changeFilter.bind(this)}
                        forum={forum}
                        tier={tier}
                        key={idx}
                        moderation={this.props.moderation}
                        topic={topic}
                        removeTopic={this.removeTopic.bind(this)}
                      />
                    ))}
                </div>
              )
            } else if(this.state.loadingPosts) {
              display = (
                <Grid.Column width={16} style={{minHeight: '200px'}}>
                  <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
                    <Loader size='large' content='Loading Post...'/>
                  </Dimmer>
                </Grid.Column>
              )
            } else {
              display = <Forum404 forum={forum} isUser={isUser} showNewPost={this.showNewPost} />
            }
          }
      } else if(this.state.reservation) {
          display = (
              <ForumManage
                status={this.props.status}
                reservation={this.state.reservation}
                completeReservation={this.completeReservation.bind(this)}
              />
          )
      } else {
        display = <Segment basic>
            <Message
                warning
                header='Was this forum recently requested?'
                content='If this forum was created within the last few minutes, please wait a moment and then refresh the page to try again.'
            />
            <Segment padded textAlign='center'>
                <Icon name='warning' size='huge' />
                <Header>
                    A forum at this URL does not yet exist
                    <Header.Subheader>
                        Please check the URL and try again.
                    </Header.Subheader>
                </Header>
            </Segment>
        </Segment>
      }
    } else {
      display = (
        <Segment>
            <Grid.Column width={16} style={{minHeight: '200px'}}>
                <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
                    <Loader size='large' content='Loading Post...'/>
                </Dimmer>
            </Grid.Column>
        </Segment>
      )
    }
    let meta = false
    if(forum && forum._id) {
        meta = (
            <Helmet>
                <title>{`/f/${forum._id} - ${forum.name}`}</title>
                <meta name="description" content={forum.description} />
                <meta itemprop="name" content={`${forum._id} - ${forum.name}`} />
                <meta itemprop="description" content={forum.description} />
                <meta itemprop="image" content="https://steemit-production-imageproxy-upload.s3.amazonaws.com/DQmckc76UaBZSicePvDG9dKwrgyS5GoZRxAnBZ8AzxtVwH8" />
                <meta name="twitter:title" content={`${forum._id} - ${forum.name}`} />
                <meta name="twitter:description" content={forum.description} />
                <meta name="twitter:image:src" content="https://steemit-production-imageproxy-upload.s3.amazonaws.com/DQmckc76UaBZSicePvDG9dKwrgyS5GoZRxAnBZ8AzxtVwH8" />
                <meta property="og:title" content={`${forum._id} - ${forum.name}`} />
                <meta property="og:url" content={`http://netify.chainbb.com/f/${forum._id}`} />
                <meta property="og:description" content={forum.description} />
            </Helmet>
        )
    }
    return(
      <div>
        {meta}
        <ForumTitle
            active={this.state.filter}
            tier={tier || {}}
          forum={forum || reservation}
          account={account}
          attached={(subforums) ? 'top' : false}
          changeFilter={this.changeFilter.bind(this)}
          hideConfig={this.hideConfig}
          history={this.props.history}
          showConfig={this.showConfig}
          subforums={(this.state.showConfig) ? false : subforums}
          { ... this.props } />
        {controls}
        <Segment basic vertical style={{padding: 0}}>
            {display}
        </Segment>
        {controls}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    moderation: state.moderation,
    post: state.post,
    status: state.status,
    subscriptions: state.subscriptions
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...breadcrumbActions,
    ...moderationActions,
    ...forumActions,
    ...postActions,
    ...statusActions,
    ...subscriptionActions,
  }, dispatch)}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forum));
