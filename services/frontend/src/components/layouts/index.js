import React from 'react'

import { Grid } from 'semantic-ui-react'

import Forums from '../../containers/forums'
import Sidebar from '../../containers/sidebar'

export default class IndexLayout extends React.Component {
  render() {
    const params = this.props.match.params;
    return(
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={4} className='mobile hidden'>
            <Sidebar
              section='index'
              forums={params}
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Forums forums={params} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
