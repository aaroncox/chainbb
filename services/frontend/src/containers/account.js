import React from 'react'
import { Helmet } from "react-helmet";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Grid } from 'semantic-ui-react'
import { goToTop } from 'react-scrollable-anchor'

import * as accountActions from '../actions/accountActions'
import * as breadcrumbActions from '../actions/breadcrumbActions'
import * as postActions from '../actions/postActions'
import * as preferenceActions from '../actions/preferenceActions'
import * as stateActions from '../actions/stateActions'
import * as statusActions from '../actions/statusActions'

import AccountSidebar from '../components/elements/account/sidebar'
import AccountTabs from '../components/elements/account/tabs'

class Account extends React.Component {

  constructor(props) {
    super(props);
    goToTop()
  }

  componentWillMount() {
    const { username } = this.props.match.params;
    this.props.actions.setBreadcrumb([
      {
        name: 'Accounts',
        link: '/'
      },
      {
        name: `@${username}`,
        link: `/@${username}`
      }
    ]);
  }

  render() {
    const { username } = this.props.match.params;
    return (
      <Grid>
        <Helmet>
            <title>{username}</title>
        </Helmet>
        <Grid.Row>
          <Grid.Column className='mobile hidden' width={4}>
            <AccountSidebar {...this.props} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <AccountTabs {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    post: state.post,
    preferences: state.preferences,
    state: state.state,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...breadcrumbActions,
    ...postActions,
    ...preferenceActions,
    ...stateActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
