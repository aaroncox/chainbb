import React from 'react'

import { Grid } from 'semantic-ui-react'

import ForumList from '../../containers/forum/list'
import Sidebar from '../../containers/sidebar'

export default class ForumsLayout extends React.Component {
  render() {
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column width={4} className='mobile hidden'>
            <Sidebar section='forums' />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <ForumList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
