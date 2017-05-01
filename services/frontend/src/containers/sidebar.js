import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Divider, Segment } from 'semantic-ui-react'
import * as accountActions from '../actions/accountActions'
import { Link } from 'react-router-dom'
import Login from '../components/elements/login'

class Sidebar extends React.Component {
  componentDidMount() {
    if (!this.props.account) {
      this.props.actions.fetchAccount()
    }
  }
  render() {
    let requestForum = (
          <div>
            <Segment secondary attached='top'>
              <h3>
                Have an idea for a forum?
              </h3>
            </Segment>
            <Segment attached>
              <p>Leave a response on the <Link to='/forum/chainbb'>chainBB forum</Link> with what you would like to see!</p>
            </Segment>
          </div>
        )
        // ,
        // categories = (
        //   <Menu vertical fluid size='small'>
        //     <Menu.Item disabled>My Feed</Menu.Item>
        //     <Link className='item' to='/'>
        //       Forums
        //     </Link>
        //     <Menu.Item disabled>Communities</Menu.Item>
        //     <Menu.Item disabled>Trending</Menu.Item>
        //     <Menu.Item disabled>New Posts</Menu.Item>
        //     <Menu.Item disabled>Promoted</Menu.Item>
        //     <Menu.Item disabled>Tags</Menu.Item>
        //   </Menu>
        // )

    return (
      <div>
        <Login {... this.props}/>
        {/*
        <Divider hidden />
        {categories}
        */}
        <Divider hidden />
        {requestForum}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {account: state.account}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(accountActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
