import React from 'react';
import { Button, Confirm, Dimmer, Grid, Header, Icon, Loader, Message, Modal, Segment } from 'semantic-ui-react'
import Noty from 'noty'

import ForumPostModerationStatus from './moderation/status'

export default class ForumPostModeration extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      promptRemovePost: false,
      promptRestorePost: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { moderation, topic } = nextProps
    if(moderation.last) {
      const last_topic = moderation.last.payload[1].topic
      if(last_topic === topic._id) {
        const processing = moderation.last.loading
        if(!processing) {
          switch(moderation.last.type) {
            case "MODERATION_REMOVE_RESOLVED":
            case "MODERATION_RESTORE_RESOLVED":
              new Noty({
                closeWith: ['click', 'button'],
                layout: 'topRight',
                progressBar: true,
                theme: 'semanticui',
                text: 'Post removal operation successfully broadcast.',
                type: 'info',
                timeout: 4000
              }).show();
              this.props.removeTopic(last_topic)
              this.props.onClose()
              break;
            default:
              break;
          }
        }
      }
    }
  }

  handleRemovePrompt = () => {
    this.setState({promptRemovePost: true})
  }

  handleRemoveCancel = () => {
    this.setState({promptRemovePost: false})
  }

  handleRemovePost = () => {
    this.props.actions.moderatorRemoveTopicForum(this.props.account, this.props.topic, this.props.forum)
    this.setState({promptRemovePost: false})
  }

  handleRestorePrompt = () => {
    this.setState({promptRestorePost: true})
  }

  handleRestoreCancel = () => {
    this.setState({promptRestorePost: false})
  }

  handleRestorePost = () => {
    this.props.actions.moderatorRestoreTopicForum(this.props.account, this.props.topic, this.props.forum)
    this.setState({promptRestorePost: false})
  }


  render() {
    const { account, forum, moderation, topic } = this.props
    const moderatorRemoved = (topic._removedFrom && topic._removedFrom.indexOf(forum['_id']) >= 0)
    let removeRestoreRow = (
      <Grid.Row
        verticalAlign='middle'
      >
        <Grid.Column width={5} textAlign="center">
          <Button
            color='orange'
            content='Remove Post'
            icon='trash'
            labelPosition='left'
            onClick={this.handleRemovePrompt}
          />
          <Confirm
            cancelButton='Keep Post'
            confirmButton='Remove Post'
            content='Are you sure you want to remove this post?'
            open={this.state.promptRemovePost}
            onCancel={this.handleRemoveCancel}
            onConfirm={this.handleRemovePost}
          />
        </Grid.Column>
        <Grid.Column width={11}>
          This will remove this post from this specific forum. The post will still exists on the blockchain and other sites, just no longer in this forum. This can be undone by viewing the "removed posts" section of the forum and restoring them.
        </Grid.Column>
      </Grid.Row>
    )
    if(moderatorRemoved) {
      removeRestoreRow = (
        <Grid.Row
          verticalAlign='middle'
        >
          <Grid.Column width={5} textAlign="center">
            <Button
              color='green'
              content='Restore Post'
              icon='circle plus'
              labelPosition='left'
              onClick={this.handleRestorePrompt}
            />
            <Confirm
              cancelButton='Cancel'
              confirmButton='Restore Post'
              content='Are you sure you want to restore this post?'
              open={this.state.promptRestorePost}
              onCancel={this.handleRestoreCancel}
              onConfirm={this.handleRestorePost}
            />
          </Grid.Column>
          <Grid.Column width={11}>
            This will restore/undelete this post for this specific forum.
          </Grid.Column>
        </Grid.Row>
      )
    }
    let processing = false
    let lastResult = false
    if(moderation.last) {
      const last_topic = moderation.last.payload[1].topic
      if(last_topic === topic._id) {
        processing = moderation.last.loading
        if(!processing) {
          let requestType = ''
          switch(moderation.last.type) {
            case "MODERATION_REMOVE_RESOLVED":
              requestType = 'removal'
              break;
            case "MODERATION_RESTORE_RESOLVED":
              requestType = 'restore'
              break;
            default:
              requestType = 'unknown'
              break;
          }
          lastResult = (
            <Message icon color='yellow'>
              <Icon name='circle notched' loading />
              <Message.Content>
                <Message.Header>Your {requestType} request has been broadcast to the blockchain.</Message.Header>
                Please wait up to 5 minutes for your changes to show on chainBB.
              </Message.Content>
            </Message>
          )
        }
      }
    }
    return (
      <Modal
        closeIcon={true}
        color='blue'
        onClose={this.props.onClose}
        onOpen={this.props.onOpen}
        size='small'
        trigger={ <Button size='small' color='blue' icon='settings' /> }
      >
        <Segment basic style={{marginTop: 0}}>
          <Dimmer active={processing}>
            <Loader>Loading</Loader>
          </Dimmer>
          <Header icon='settings' content='Post Moderation' style={{marginTop: 0}} />
          {lastResult}
          <Modal.Content>
            <p>As a moderator of this forum you are allowed to perform the following actions on these posts. Keep in mind, any actions you perform will only apply to this post on this specific chainBB forum.</p>
            <ForumPostModerationStatus
              account={account}
              forum={forum}
              topic={topic}
            />
            <Grid divided='vertically'>
              {removeRestoreRow}
            </Grid>
          </Modal.Content>
        </Segment>
      </Modal>
    )
  }
}
