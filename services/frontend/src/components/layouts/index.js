import React from 'react'

import { Grid } from 'semantic-ui-react'

import Forums from '../../containers/forums'
import Sidebar from '../../containers/sidebar'

export default class IndexLayout extends React.Component {
  render() {
    return(
      <Grid divided stackable>
        <Grid.Row>
          <Grid.Column width={4} only='tablet computer'>
            <Sidebar />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Forums />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
