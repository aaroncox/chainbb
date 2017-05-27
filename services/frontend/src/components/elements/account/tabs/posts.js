import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
// import AccountAvatar from './avatar'
import AccountLink from '../link'
import ForumPost from '../../forum/post'
import ForumHeader from '../../forum/header'
import Paginator from '../../../global/paginator'

export default class AccountPosts extends React.Component {
  constructor(props) {
    super(props)
    const { username } = props.match.params;
    const page = 1;
    this.state = { username, page }
    props.actions.fetchPostByAuthor(username);
  }
  componentWillReceiveProps(nextProps) {
    const { username } = nextProps.match.params;
    if(username !== this.state.username) {
      this.setState({username});
      nextProps.actions.fetchPostByAuthor(username);
    }
  }
  changePage = (page) => {
    this.setState({
      page: page
    })
    this.props.actions.fetchPostByAuthor(this.state.username, page);
  }
  render() {
    const { username } = this.state;
    let content = <Segment attached padded="very" loading />
    if(this.props && this.props.post && this.props.post.authors && this.props.post.authors[username] && this.props.post.authors[username].posts) {
      const { authors } = this.props.post;
      const { posts, totalPosts } = authors[username];
      content = (
        <Segment attached>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="large">
                  Authored Posts
                  <Header.Subheader>
                    Posts created by
                    {' '}
                    <AccountLink
                      noPopup={true}
                      username={username}
                    />
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column width={8}>
                <Paginator
                  page={this.state.page}
                  perPage={20}
                  total={totalPosts}
                  callback={this.changePage}
                  />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <ForumHeader />
          {posts.map((topic, idx) => <ForumPost topic={topic} key={idx} />)}
        </Segment>
      )
    }
    return content
  }
}
