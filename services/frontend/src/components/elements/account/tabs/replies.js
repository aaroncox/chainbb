import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
import { goToTop } from 'react-scrollable-anchor'
import AccountLink from '../link'
import ForumPostReply from '../../forum/post/reply'
import Paginator from '../../../global/paginator'

export default class AccountReplies extends React.Component {
  constructor(props) {
    super(props)
    const { username } = props.match.params;
    const page = 1;
    this.state = { username, page }
    props.actions.fetchPostRepliesByAuthor(username);
  }
  changePage = (page) => {
    this.setState({
      page: page
    })
    this.props.actions.fetchPostRepliesByAuthor(this.state.username, page);
    goToTop();
  }
  render() {
    const { username } = this.props.match.params;
    let content = <Segment attached padded="very" loading />
    if(this.props && this.props.post && this.props.post.authors && this.props.post.authors[username] && this.props.post.authors[username].replies) {
      const { authors } = this.props.post;
      const { replies, totalReplies } = authors[username];
      content = (
        <Segment attached>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header size="large">
                  Post Replies
                  <Header.Subheader>
                    The most recent replies to
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
                  total={totalReplies}
                  callback={this.changePage}
                  />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {replies.map((topic, idx) => <ForumPostReply topic={topic} key={idx} {... this.props} />)}
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>

              </Grid.Column>
              <Grid.Column width={8}>
                <Paginator
                  page={this.state.page}
                  perPage={20}
                  total={totalReplies}
                  callback={this.changePage}
                  />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )
    }
    return content
  }
}
