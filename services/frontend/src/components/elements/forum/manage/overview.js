import React from 'react';
import TimeAgo from 'react-timeago'
import { Header, Icon, Label, Popup, Segment, Table } from 'semantic-ui-react'

import AccountLink from '../../account/link'

export default class ForumOverview extends React.Component {
    render() {
        const { forum } = this.props
        const { target } = forum
        const tag_labels = (target.tags) ? target.tags.map((tag) => (
            <Label color='blue' key={tag}>
                <Icon name='tag' />
                {tag}
            </Label>
        )) : []
        return(
            <div>
                <Segment padded attached='top' secondary color='black'>
                    <Header size='large'>
                        {target.name} - Forum Overview
                        <Header.Subheader>
                            Public information related to this forum and it's operations.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Segment attached>
                    <Header>Current Forum Level: XXXX</Header>
                    <Table definition>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell collapsing></Table.HeaderCell>
                                <Table.HeaderCell>/f/{target._id}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Genesis</Table.Cell>
                                <Table.Cell>
                                    Block #
                                    {(target.created_tx)
                                        ? (
                                            <a href={`https://steemd.com/b/${target.created_height}`} target='_blank'>
                                                {target.created_height}
                                            </a>
                                        )
                                        : 'unknown'
                                    }
                                    {' '}
                                    - TXID:
                                    {' '}
                                    {(target.created_tx)
                                        ? (
                                            <a href={`https://steemd.com/tx/${target.created_tx}`} target='_blank'>
                                                {target.created_tx.substring(0,8)}
                                            </a>
                                        )
                                        : 'Unknown'
                                    }

                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Creator</Table.Cell>
                                <Table.Cell>
                                    <AccountLink username={(target.creator) ? target.creator : 'chainbb'} />
                                    {(!target.creator)
                                        ? (
                                            <strong>{' '}(Legacy Forum)</strong>
                                        )
                                        : ''
                                    }
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Creation</Table.Cell>
                                <Table.Cell>
                                    <Popup
                                      trigger={
                                          <TimeAgo date={`${target.created}Z`} />
                                      }
                                      content={target.created}
                                      inverted
                                    />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Tags</Table.Cell>
                                <Table.Cell>
                                    {tag_labels}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Posts</Table.Cell>
                                <Table.Cell>
                                    {(target.stats) ? target.stats.posts : 0}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Replies</Table.Cell>
                                <Table.Cell>
                                    {(target.stats) ? target.stats.replies : 0}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
            </div>
        );
    }
}
