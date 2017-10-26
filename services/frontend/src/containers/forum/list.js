import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { goToTop } from 'react-scrollable-anchor'


import { Dimmer, Loader, Grid, Header, Segment  } from 'semantic-ui-react'

import * as GLOBAL from '../../global';
import * as accountActions from '../../actions/accountActions'
import * as breadcrumbActions from '../../actions/breadcrumbActions'
import * as postActions from '../../actions/postActions'
import * as statusActions from '../../actions/statusActions'
import * as preferenceActions from '../../actions/preferenceActions'

import ForumIndex from '../../components/elements/forum/index'

class ForumList extends React.Component {

    constructor(props, state) {
      goToTop()
      super(props);
      this.state = {
        group: false,
        minimized: props.preferences.forums_minimized || [],
        forums: []
      };
      this.getForumList = this.getForumList.bind(this);
      this.getForumList()
    }

    componentDidMount() {
      this.props.actions.setBreadcrumb([])
    }

    componentWillMount() {
      this.props.actions.resetPostState()
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

    async getForumList() {
      try {
        let uri = GLOBAL.REST_API + '/forums';
        const response = await fetch(uri);
        if (response.ok) {
          const result = await response.json();
          this.setState({
            forums: result.data.forums
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
          display = <Dimmer active inverted style={loader.style}>
                      <Loader size='large' content={loader.content}/>
                    </Dimmer>
      if(loaded) {
        let { forums } = this.state
        display = forums.map((forum, index) => {
          return <ForumIndex key={index} forum={forum} displayParent={true} />
        })
      }
      return(
        <div>
          <Segment stacked color="blue">
            <Grid>
              <Grid.Row>
                <Grid.Column width={12}>
                  <Header
                    icon='list layout'
                    color='blue'
                    size='huge'
                    content='All Forums'
                    subheader='Every forum that exists within chainBB listed in alphabetical order'
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {display}
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

export default connect(mapStateToProps, mapDispatchToProps)(ForumList);
