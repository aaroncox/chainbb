import React from 'react';

import { Button, Dimmer, Divider, Grid, Header, Icon, Label, Loader, Message, Modal, Segment } from 'semantic-ui-react'
import { Form, Input } from 'formsy-semantic-ui-react'
import slug from 'slug'
import steem from 'steem'
import { Link } from 'react-router-dom'

export default class PostForm extends React.Component {

  state = {}

  constructor(props) {
    super(props)
    const { action, post } = props;
    let tags = (props.forum && props.forum.tags) ? [props.forum.tags[0]] : [];
    if (action === 'edit') {
      if (post.json_metadata && post.json_metadata.tags && post.json_metadata.tags.length) {
        tags = post.json_metadata.tags;
      }
    }
    this.state = {
      post: post || false,
      category: (props.forum && props.forum.tags) ? props.forum.tags[0] : null,
      recommended: (props.forum && props.forum.tags) ? props.forum.tags : [],
      submitting: false,
      waitingforblock: false,
      tags: tags
    };
  }

  handleCancel = (e) => {
    e.preventDefault()
    this.props.onCancel()
    return false
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  addTag = (e) => {
    let additionalTag = this.state.additionalTag,
        tags = this.state.tags
    if(tags.indexOf(additionalTag) === -1 && tags.length < 5) {
      tags.push(additionalTag)
      this.setState({
        additionalTag: '',
        tags: tags
      })
    }
    e.preventDefault()
  }

  removeTag = (e, data) => {
    let tags = this.state.tags,
        idx = tags.indexOf(data.content)
    if(idx !== -1) {
      tags.splice(idx, 1)
      this.setState({ tags: tags })
    }
    e.preventDefault()
  }

  generatePermlink = (title, parent = null) => {
    var permlink = '',
        date = new Date(),
        time = date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString()+"t"+date.getHours().toString()+date.getMinutes().toString()+date.getSeconds().toString()+date.getMilliseconds().toString()+"z"
    if(title && title.trim() !== '') {
      permlink = slug(title).toString()
    }
    if(parent) {
      permlink = "re-" + parent.author + "-" + parent.permlink + "-" + time;
    }
    if(permlink.length > 255) {
      permlink = permlink.substring(permlink.length - 255, permlink.length)
    }
    permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '')
    return permlink;
  }

  onValidSubmit = (formData) => {
    const data = {...formData, ...this.state}
    let t = this,
        // Determine action
        action = this.props.action,
        // The post being edited (if any)
        post = this.props.parent,
        // The parent post (if any)
        parent = this.props.parent,
        // The account posting
        account = this.props.account,
        // Use the title if given, or use the parent's title with a prefix
        title = (data.title) ? data.title : '',
        // Generate a permlink based off the choosen title
        permlink = this.generatePermlink(title, parent),
        // json_metadata to associate with the post
        json = {
          app: 'chainbb/0.1',
          format: 'markdown+html',
          tags: data.tags
        },
        ops = []
    switch(action) {
      case "edit": {
        ops.push(['comment', {
          author: post.author,
          body: data.body,
          json_metadata: data.tags ? JSON.stringify(json) : JSON.stringify(post.json_metadata),
          parent_author: post.parent_author,
          parent_permlink: post.parent_permlink,
          permlink: post.permlink,
          title: data.title || post.title,
        }])
        break;
      }
      default: {
        ops.push(['comment', {
          author: account.name,
          body: data.body,
          json_metadata: JSON.stringify(json),
          parent_author: (parent) ? parent.author : '',
          parent_permlink: (parent) ? parent.permlink : data.category,
          permlink: permlink,
          title: title
        }])
        ops.push(['comment_options', {
          allow_curation_rewards: true,
          allow_votes: true,
          author: account.name,
          extensions: [[0, { "beneficiaries": [{ "account":"chainbb", "weight":1500 }] }]],
          max_accepted_payout: "1000000.000 SBD",
          percent_steem_dollars: 10000,
          permlink: permlink
        }]);
        break;
      }
    }
    this.setState({
      submitting: true
    })
    steem.broadcast.send({ operations: ops, extensions: [] }, { posting: account.key }, function(err, result) {
      if(err) {
        t.setState({
          submitting: false,
          hasError: true,
          errorMsg: err.message
        })
      } else {
        setTimeout(function() {
          t.setState({
            submitting: false,
            waitingforblock: true,
            hasError: false
          })
          setTimeout(function() {
            t.setState({
              waitingforblock: false
            })
            // If we have a parent, reload all of the children
            if(parent) {
              let parent_author = (parent.root_author) ? parent.root_author : parent.author,
                  parent_category = (parent.category) ? parent.category : 'tag',
                  parent_permlink = (parent.root_permlink) ? parent.root_permlink : parent.permlink
              if(parent.root_post) {
                [ parent_author, parent_permlink ] = parent.root_post.split('/')
              }
              t.props.actions.fetchPostResponses({
                author: parent_author,
                category: parent_category,
                permlink: parent_permlink
              })
            }
            t.props.onComplete(data)
          }, 5000)
        }, 5000)
      }
    });
  }

  dismissError = (e) => this.setState({
    hasError: false,
    errorMsg: false
  })

  render() {
    let formHeader = this.props.formHeader,
        post = this.state.post,
        tags = this.state.tags,
        formFieldTitle = false,
        formFieldTags = false,
        addTagButton = (
          <Button color='green' onClick={this.addTag}>
            Add Tag (Enter)
          </Button>
        ),
        display = (
          <Dimmer inverted active style={{minHeight: '100px', display: 'block'}}>
            <Loader size='large' content='Loading'/>
          </Dimmer>
        )
    const errorLabel = <Label color="red" pointing/>
    if(this.props.elements.indexOf('tags') !== -1) {
      formFieldTags = (
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={8}>
              <Form.Field>
                <label>Add additional tags</label>
                <Input
                  name='additionalTag'
                  value={this.state.additionalTag}
                  placeholder='Add up to 4 additional tags to this post.'
                  action={addTagButton}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column width={8}>
              <Form.Field>
                <label>Active Tags</label>
                {tags.map((tag, i) => <Label horizontal size='large' color='green' onRemove={this.removeTag} content={tag} key={tag} />)}
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }

    if(this.props.elements.indexOf('title') !== -1) {
      formFieldTitle = (
        <Form.Field>
          <Form.Input
            name="title"
            label="Post Title"
            required
            defaultValue={ (post) ? post.title : '' }
            placeholder='What should this post be titled?'
            validationErrors={{
              isDefaultRequiredValue: 'A title is required'
            }}
            errorLabel={ errorLabel }
          />
        </Form.Field>
      )
    }

    display = (
      <Segment stacked>
        <Dimmer inverted active={this.state.submitting} style={{minHeight: '100px'}}>
          <Loader size='large' indeterminate content='Submitting to Blockchain'/>
        </Dimmer>
        <Dimmer inverted active={this.state.waitingforblock} style={{minHeight: '100px'}}>
          <Loader size='large' content='Waiting for next Block'/>
        </Dimmer>
        <Modal
          open={this.state.hasError}
          onClose={this.dismissError}
          basic
          size='small'
          >
          <Header icon='alarm outline' content='Error Submitting to the Blockchain' />
          <Modal.Content>
            <h3>An error has occured.</h3>
            <p>If you need assistance, please notify @jesta here on the forums, on steemit.com, or via steemit.chat. Please include the error message shown below.</p>
            <code>
            <pre>
              {this.state.errorMsg}
            </pre>
            </code>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' onClick={this.dismissError} inverted>
              <Icon name='checkmark' /> Got it
            </Button>
          </Modal.Actions>
        </Modal>
        <Form
          ref={ ref => this.form = ref }
          onValidSubmit={ this.onValidSubmit }
        >
          {formHeader}
          {formFieldTitle}
          <Form.TextArea
            name="body"
            label="Post Body (Markdown Supported)"
            placeholder='Write your post here.'
            required
            defaultValue={ (post) ? post.body : '' }
            errorLabel={ <Label color="red" pointing/> }
            validationErrors={{
              isDefaultRequiredValue: 'A post body is required.',
            }}
          />
          {formFieldTags}
          <Divider />
          <Message
            header="chainBB.com Beta Forums"
            content={
              <div>
                Notice: These beta forums use the following rewards model: 60% Author, 25% Curators, 15% Platform
                {' - '}
                <Link to="/chainbb/@jesta/chainbb-beta-beneficiaries-moving-to-15">read more</Link>.
              </div>
            }
          />
          <Button primary>Submit Post</Button>
          <Button color='orange' onClick={this.handleCancel}>Cancel</Button>
        </Form>
      </Segment>
    )
    return display
  }

}
