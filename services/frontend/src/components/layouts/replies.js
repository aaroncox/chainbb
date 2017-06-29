import React from 'react'

import { Grid } from 'semantic-ui-react'

import Replies from '../../containers/account/replies'
import Sidebar from '../../containers/sidebar'

export default class RepliesLayout extends React.Component {
  render() {
    return(
      <Grid divided>
        <Grid.Row>
          <Grid.Column width={4} className='mobile hidden'>
            <Sidebar
              section='replies'
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Replies />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
