import React from 'react';
import { Link } from 'react-router-dom'

import { Button, Header, Grid, Label, Segment, Table } from 'semantic-ui-react'
import { Form, Input } from 'formsy-semantic-ui-react'

export default class PostFormFieldTags extends React.Component {
  state = {
    tagname: ''
  }
  addTag = (e, data) => {
    this.props.addTag(e, data);
    this.setState({
      tagname: ''
    })
  }
  handleChange = (e, data) => {
    this.props.handleChange(e, data);
    this.setState({tagname: data.value})
  }
  render() {
    const { forum, tags } = this.props
    const { target } = forum
    const category = this.props.filter || target.tags[0]
    const userTags = tags.slice(1,5)
    let tagsDisplay = 'None'
    let forumDisplay = false
    let namespaceDisplay = false
    if(userTags.length) {
      tagsDisplay = userTags.map((tag, i) => (
        <Label horizontal size='large' color='green' style={{marginBottom: '5px'}} onRemove={this.props.removeTag} content={tag} key={tag} />
      ))
    }
    if(target) {
      forumDisplay = (
        <Table.Row>
          <Table.Cell collapsing>Forum</Table.Cell>
          <Table.Cell>
            <Link to={`/f/${target._id}`}>
              {target.name}
            </Link>
          </Table.Cell>
        </Table.Row>
      )
      namespaceDisplay = (
          <Table.Row>
            <Table.Cell collapsing>Namespace</Table.Cell>
            <Table.Cell>
              <Link to={`/f/${target._id}`}>
                /f/{target._id}
              </Link>
            </Table.Cell>
          </Table.Row>
      )

    }
    const addTagButton = (
            <Button color='green' onClick={this.addTag}>
              Add Tag (Enter)
            </Button>
          )
    return (
      <Grid stackable={true}>
        <Grid.Row>
          <Grid.Column width={8}>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>Category</Table.Cell>
                  <Table.Cell>
                    <Label horizontal size='large' color='blue' style={{marginBottom: '5px'}} content={category} />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell collapsing>Tags ({userTags.length})</Table.Cell>
                  <Table.Cell>
                    {tagsDisplay}
                  </Table.Cell>
                </Table.Row>
                {forumDisplay}
                {namespaceDisplay}
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column width={8}>
            <Segment secondary>
              <Header>
                Additional Tags
                <Header.Subheader>
                  You may add an additional ({4 - userTags.length}) tags to help categorize your post.
                </Header.Subheader>
              </Header>
              <Form.Field>
                <Input
                  ref={(input) => { this.textInput = input }}
                  disabled={(userTags.length >= 4)}
                  name='additionalTag'
                  value={this.state.tagname}
                  placeholder='Enter a tag and hit enter'
                  action={addTagButton}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Header>
                <Header.Subheader>
                  Click the green button or press enter after each tag to add it.
                </Header.Subheader>
              </Header>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
