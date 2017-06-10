import React from 'react';

import { Button, Container, Grid, Modal } from 'semantic-ui-react'

import PostContent from '../content'
import PostSidebar from '../sidebar'

export default class PostPreview extends React.Component {

  state = {
    post: {}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: {
        content: {
          author: nextProps.author,
          title: nextProps.preview.title,
          body: nextProps.preview.body
        }
      }
    })
  }

  handleModal = (e) => {
    e.preventDefault()
    return false
  }

  render() {
    let display = null,
        sidebar = null
    if(this.state.post.content) {
      sidebar = (
        <Grid.Column className='mobile hidden' width={4}>
          <PostSidebar
            preview={true}
            { ...this.state } />
        </Grid.Column>
      )
      display = (
        <Grid.Column mobile={16} tablet={12} computer={12}>
          <PostContent
            preview={true}
            content={this.state.post.content}
            { ...this.state } />
        </Grid.Column>
      )
    }

    return (
      <Modal
        size="fullscreen"
        closeIcon={true}
        trigger={
          <Button color='purple' onClick={this.handleModal}>
            Preview
          </Button>
        }>
        <Modal.Content>
          <Container>
            <Grid>
              <Grid.Row>
                {sidebar}
                {display}
              </Grid.Row>
            </Grid>
          </Container>
        </Modal.Content>
      </Modal>
    )
  }

}
