
import React from 'react';
import { Link } from 'react-router-dom'

import { Grid, Header, Segment } from 'semantic-ui-react'

import AccountLink from '../account/link'

export default class ForumTitle extends React.Component {
  render() {
    let { attached, forum } = this.props
    let tags = false
    let subheader = false
    if(forum.tags) {
      tags = (
        <Header.Subheader style={{marginTop: '0.25em'}}>
          {' ↳ '}
          {forum.tags.map((tag, i) => <span key={i}>
            {' '}
            <Link to={`/topic/${tag}`}>
              #{tag}
            </Link>
          </span>)}
        </Header.Subheader>
      )
    }
    subheader = (
      <div>
        <Header.Subheader>
          {forum.description}
        </Header.Subheader>
        {tags}
      </div>
    )

    return (
      <Segment attached={attached} color="blue">
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header
                size='huge'
                key={forum._id}
                content={forum.name}
                subheader={subheader}
              />
            </Grid.Column>
            <Grid.Column width={4} textAlign="right">
              Managed by
              <br/>
              <AccountLink username='chainbb' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
