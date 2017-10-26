import React from 'react';

import { Header, List, Modal, Progress, Segment } from 'semantic-ui-react'

import ForumTypesTable from '../../types/table'

export default class ForumUpgradeMeter extends React.Component {
    render() {
        const { target } = this.props
        const { funded } = target
        const tier = this.props.getTier(funded)
        const nextTier = this.props.getTier(funded + tier.bounds[1])
        let progress = false
        let nextTierProgress = false
        if(nextTier) {
            nextTierProgress = target.funded / nextTier.bounds[0] * 100
            progress = (
                <div>
                    <Header>
                        Next Upgrade: {nextTier.name}
                    </Header>
                    <Progress percent={nextTierProgress} indicating size='small'>
                        {target.funded} STEEM / {nextTier.bounds[0]} STEEM
                    </Progress>
                </div>
            )
        }


        return(
            <div>
                {progress}
                <List divided>
                    {(nextTier)
                        ? (
                            <div>
                                <List.Item>
                                    <List.Header>
                                        New features that will unlock...
                                    </List.Header>
                                </List.Item>
                                {nextTier.features.map((feature) => <List.Item key={feature} content={feature} />)}
                            </div>
                        )
                        : (
                            <List.Item>
                                <List.Header>
                                    All features unlocked
                                </List.Header>
                            </List.Item>
                        )
                    }
                    <Segment basic textAlign='center'>
                        <Modal
                            closeIcon={true}
                            size='small'
                            trigger={
                                <a href='#'>Learn about all the different types of forums</a>
                            }
                        >
                            <Segment basic padded='very'>
                                <Header>chainBB Forum Types</Header>
                                <ForumTypesTable activeRow={false} />
                            </Segment>
                        </Modal>
                    </Segment>
                </List>
            </div>
        );
    }
}
