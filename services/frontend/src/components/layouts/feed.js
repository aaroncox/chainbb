import React from 'react'

import { Grid } from 'semantic-ui-react'

import Feed from '../../containers/account/feed'
import Sidebar from '../../containers/sidebar'

export default class FeedLayout extends React.Component {
  render() {
    return(
      <Grid divided>
        <Grid.Row>
          <Grid.Column width={4} className='mobile hidden'>
            <Sidebar
              section='feed'
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Feed />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
