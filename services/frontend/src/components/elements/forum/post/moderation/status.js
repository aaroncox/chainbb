import React from 'react';
import {  Header, Table } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import AccountLink from '../../../account/link'

export default class ForumPostModerationStatus extends React.Component {
  render() {
    let { account, forum, topic } = this.props
    let parent = false
    let subheader = false
    if(forum.parent) {
      parent = (
        <Header.Subheader>
          Child of
          {' '}
          <Link to={`/f/${forum.parent}`}>
            {forum.parent_name}
          </Link>
        </Header.Subheader>
      )
    }
    subheader = (
      <div>
        <Header.Subheader>
          {forum.description}
        </Header.Subheader>
        {parent}
      </div>
    )
    return (
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Forum</Table.Cell>
            <Table.Cell>
              <Header
                content={forum.name}
                subheader={subheader}
              />
            </Table.Cell>
            <Table.Cell>The forum this topic resides within.</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Moderator</Table.Cell>
            <Table.Cell>
              <Header>
                <AccountLink username={account.name} />
              </Header>
            </Table.Cell>
            <Table.Cell>The moderator that will perform these actions.</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Topic</Table.Cell>
            <Table.Cell>
              <Header>
                <Header.Content>
                  {topic.title}
                  <Header.Subheader>
                    {'↳ '}
                    <TimeAgo date={`${topic.created}Z`} />
                    {' • '}
                    <AccountLink username={topic.author} />
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Table.Cell>
            <Table.Cell>The top-level post serving as the topic.</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}
