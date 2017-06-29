import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
import { goToTop } from 'react-scrollable-anchor'
import AccountLink from '../link'
import ForumPostReply from '../../forum/post/reply'
import Paginator from '../../../global/paginator'

export default class AccountReplies extends React.Component {
  constructor(props) {
    super(props)
    const { post } = props;
    const { username } = props.match.params;
    this.state = {
      page: 1,
      post,
      replies: [],
      totalReplies: 0,
      username
    }
    props.actions.fetchPostRepliesByAuthor(username);
    this.changePage = this.changePage.bind(this);
  }
  changePage = (page) => {
    this.setState({
      page: page,
      replies: []
    })
    this.props.actions.fetchPostRepliesByAuthor(this.state.username, page);
    goToTop();
  }
  componentWillReceiveProps(nextProps) {
    const { username } = this.state
    const { post } = nextProps
    if(post.authors[username]) {
      const { replies, totalReplies } = post.authors[username]
      let content = false
      if(replies && replies.length > 0) {
        content = replies.map((topic, idx) => <ForumPostReply topic={topic} key={idx} {... this.props} />)
      }
      this.setState({ content, replies, totalReplies })
    }
  }
  render() {
    const { totalReplies, username } = this.state
    let { content } = this.state
    if(!content) content = <Segment attached padded="very" loading style={{margin: '2em 0'}} />
    return (
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
        {content}
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
}
