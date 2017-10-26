import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { goToTop } from 'react-scrollable-anchor'


import { Button, Dimmer, Divider, Loader, Grid, Header, Segment  } from 'semantic-ui-react'

import * as GLOBAL from '../global';
import * as accountActions from '../actions/accountActions'
import * as breadcrumbActions from '../actions/breadcrumbActions'
import * as postActions from '../actions/postActions'
import * as statusActions from '../actions/statusActions'
import * as preferenceActions from '../actions/preferenceActions'

import AccountLink from '../components/elements/account/link'
import ForumIndex from '../components/elements/forum/index'

class Forums extends React.Component {

    constructor(props, state) {
      goToTop()
      super(props);
      this.state = {
        group: false,
        minimized: props.preferences.forums_minimized || [],
        forums: []
      };
      this.getForums = this.getForums.bind(this);
      this.getForums()
    }

    componentDidMount() {
      this.props.actions.setBreadcrumb([])
    }

    componentWillMount() {
      this.props.actions.resetPostState()
    }

    componentWillReceiveProps(nextProps) {
      // console.log(nextProps, this.state)
      // if(nextProps.forums.group !== this.state.group) {
      //   console.log(nextProps.forums.group, this.state.group)
      //   this.props.actions.resetPostState()
      //   this.getForums()
      // }
    }

    toggleVisibility = (e, props) => {
      const forum = props.value;
      let { minimized } = this.state;
      if(minimized.indexOf(forum) !== -1) {
        const index = minimized.indexOf(forum);
        minimized.splice(index, 1);
      } else {
        minimized.push(forum);
      }
      this.props.actions.setPreference({ 'forums_minimized': minimized });
      this.setState({ minimized });
    }

    async getForums() {
      try {
        let uri = GLOBAL.REST_API;
        if(this.props.forums && this.props.forums.group) {
          uri = uri + '/' + this.props.forums.group;
        }
        const response = await fetch(uri);
        if (response.ok) {
          const result = await response.json();
          this.setState({
            forums: result.data.forums,
            users: result.data.users,
            group: this.props.forums.group
          });
          this.props.actions.setStatus({'network': result.network});
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
          activeusers = false,
          display = <Dimmer active inverted style={loader.style}>
                      <Loader size='large' content={loader.content}/>
                    </Dimmer>
      if(loaded) {
        let { forums, users } = this.state,
            // Find the unique forum groupings
            groups = forums.map((forum, index) => {
              return (!this.state.forums[index-1] || this.state.forums[index-1].group !== forum.group) ? forum['group'] : null
            }).filter(function(name) {
              return name !== null
            })

        activeusers = (
          <Segment>
            <Header size='large'>
              Active Posters
              <Header.Subheader>
                {' '}<strong>{users.stats.app}</strong>{' '}
                users have posted on chainBB in the last 24 hours, out of a total of
                {' '}<strong>{users.stats.total}</strong>{' '}
                users.
              </Header.Subheader>
            </Header>
            <Divider horizontal>
              Recent chainBB users
            </Divider>
            {users.list.map((user, i) => <span key={i}>
              {!!i && ", "}
              <AccountLink username={user['_id']} />
            </span>)}
          </Segment>
        )
        display = groups.map((group) => {
          const isMinimized = this.state.minimized.indexOf(group) >= 0
          let groupings = forums.filter(function(forum) {
            return forum['group'] === group
          }).map((forum, index) => {
            return <ForumIndex key={index} forum={forum} isMinimized={isMinimized} />
          })
          return  <div key={group} style={{marginBottom: "10px"}}>
                    <Segment secondary attached>
                      <Grid>
                        <Grid.Row verticalAlign="middle">
                          <Grid.Column computer={1} tablet={2} mobile={2}>
                            <Button
                              basic
                              onClick={this.toggleVisibility}
                              value={group}
                              icon={isMinimized ? "plus" : "minus"}
                              size="small"
                            />
                          </Grid.Column>
                          <Grid.Column computer={6} tablet={8} mobile={8}>
                            <Header>
                              {group}
                            </Header>
                          </Grid.Column>
                          <Grid.Column width={2} className='tablet or lower hidden' textAlign='center'>
                            <Header size='tiny' style={{ display: isMinimized ? "none" : "" }}>
                              Posts
                            </Header>
                          </Grid.Column>
                          <Grid.Column width={2} className='tablet or lower hidden'>
                            <Header size='tiny' textAlign='center' style={{ display: isMinimized ? "none" : "" }}>
                              Replies
                            </Header>
                          </Grid.Column>
                          <Grid.Column computer={5} tablet={6} mobile={6} style={{ display: isMinimized ? "none" : "" }}>
                            <Header size='tiny'>
                              Recently Active
                            </Header>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                    {groupings}
                  </div>
        })
      }
      return(
        <div>
          <Segment stacked color="blue">
            <Grid>
              <Grid.Row>
                <Grid.Column width={12}>
                  <Header
                    icon='users'
                    color='blue'
                    size='huge'
                    content='Forum Index'
                    subheader='A curated list of forum categories to get you started'
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {display}
          <Divider />
          {activeusers}
        </div>
      );
    }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    preferences: state.preferences,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...breadcrumbActions,
    ...postActions,
    ...statusActions,
    ...preferenceActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Forums);
