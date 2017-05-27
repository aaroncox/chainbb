import React from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'

export default class ForumPostResponse extends React.Component {
  render() {
    let {topic} = this.props
    return (
      <Segment attached key={topic._id}>
        <Grid>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column tablet={10} computer={10} mobile={8}>
              <Header size='small'>
                <Link to={`${topic.url}`}>
                  {topic.root_title}
                </Link>
                <Header.Subheader>
                  {'↳ '}
                  replied <TimeAgo date={`${topic.created}Z`} />
                  {' • '}
                  <Link to={`/${topic.category}/@${topic.root_post}`}>
                    view parent post
                  </Link>
                </Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column width={2} only='large screen' className="center aligned">
              <Header size='small'>
                {topic.children}
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
