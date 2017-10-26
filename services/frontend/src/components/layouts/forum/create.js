import React from 'react'

import { Grid } from 'semantic-ui-react'

import ForumCreate from '../../../containers/forum/create'
import Sidebar from '../../../containers/sidebar'

export default class ForumCreateLayout extends React.Component {
    render() {
        return(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4} className='mobile hidden'>
                        <Sidebar />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={12} computer={12}>
                        <ForumCreate />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
