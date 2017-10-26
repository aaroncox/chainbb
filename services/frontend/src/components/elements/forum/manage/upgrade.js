import React from 'react';

import { Divider, Dimmer, Header, List, Loader, Segment } from 'semantic-ui-react'

import ForumUpgradeMeter from './upgrade/meter'
import ForumUpgradeHistory from './upgrade/history'

export default class ForumUpgrade extends React.Component {
    render() {
        const { funding, target } = this.props.forum
        const history = (funding) ? funding.history : []
        let tier = {}
        let features = []
        let display = (
            <Dimmer active inverted>
                <Loader size='large' content='Loading...' />
            </Dimmer>
        )
        if (target) {
            tier = this.props.getTier(target.funded)
            features = this.props.getTierFeatures(target.funded)
            display = (
                <ForumUpgradeMeter target={target} getTier={this.props.getTier}/>
            )
        }
        return(
            <div>
                <Segment padded attached='top' secondary color='blue'>
                    <Header size='large'>
                        Funding History
                        <Header.Subheader>
                            Record of all accounts that have participated in funding this forum.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Segment.Group horizontal>
                    <Segment padded='very' attached loading={!target}>
                        <Header>
                            Current: {tier.name}
                        </Header>
                        <Divider />
                        <List divided>
                            <List.Item>
                                <List.Header>
                                    Features unlocked...
                                </List.Header>
                            </List.Item>
                            {(features.map((feature) => <List.Item key={feature} content={feature} />))}
                        </List>
                    </Segment>
                    <Segment padded='very' attached loading={!target}>
                        {display}
                    </Segment>
                </Segment.Group>
                <Segment attached='bottom'>
                    <Header>
                        Transaction History
                    </Header>
                    <ForumUpgradeHistory history={history} />
                </Segment>
            </div>
        );
    }
}
