import React from 'react'

import { Grid } from 'semantic-ui-react'

import Topic from '../elements/topic'
import Sidebar from '../../containers/sidebar'

export default class TopicLayout extends React.Component {
  render() {
    const { category } = this.props.match.params;
    return(
      <Grid divided>
        <Grid.Row>
          <Grid.Column width={4}>
            <Sidebar />
          </Grid.Column>
          <Grid.Column width={12}>
            <Topic category={category} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
