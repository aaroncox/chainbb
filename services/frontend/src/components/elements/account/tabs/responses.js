import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
// import AccountAvatar from './avatar'
import AccountLink from '../link'
import ForumPostResponse from '../../forum/post/response'
import ForumHeader from '../../forum/header'
import Paginator from '../../../global/paginator'

export default class AccountPosts extends React.Component {
  constructor(props) {
    super(props)
    const { username } = props.match.params;
    const page = 1;
    this.state = { username, page }
    props.actions.fetchPostResponsesByAuthor(username);
  }
  changePage = (page) => {
    this.setState({
      page: page
    })
    this.props.actions.fetchPostResponsesByAuthor(this.state.username, page);
  }
  render() {
    const { username } = this.props.match.params;
    let content = <Segment attached padded="very" loading />
    if(this.props && this.props.post && this.props.post.authors && this.props.post.authors[username] && this.props.post.authors[username].responses) {
      const { authors } = this.props.post;
      const { responses, totalResponses } = authors[username];
      content = (
        <Segment attached>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="large">
                  Responses to other user's posts
                  <Header.Subheader>
                    The most recent responses written by
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
                  total={totalResponses}
                  callback={this.changePage}
                  />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <ForumHeader />
          {responses.map((topic, idx) => <ForumPostResponse topic={topic} key={idx} />)}
        </Segment>
      )
    }
    return content
  }
}
