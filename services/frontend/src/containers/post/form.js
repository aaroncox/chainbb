import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _ from 'lodash'
import store from 'store'
import ReactDOMServer from 'react-dom/server';

import { Button, Dimmer, Divider, Header, Loader, Menu, Segment } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

import Noty from 'noty'

import PostFormError from '../../components/elements/post/form/error'
import PostFormFieldBody from '../../components/elements/post/form/field/body'
import PostFormFieldRewards from '../../components/elements/post/form/field/rewards'
import PostFormFieldTags from '../../components/elements/post/form/field/tags'
import PostFormFieldTitle from '../../components/elements/post/form/field/title'

import PostPreview from '../../components/elements/post/form/preview'

import * as postActions from '../../actions/postActions'
import * as statusActions from '../../actions/statusActions'

class PostForm extends React.Component {

  state = {}
  drafts = {}
  preview = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  constructor(props) {
    super(props)
    const { action, filter, forum, existingPost } = props;
    const { target } = forum
    let tags = (filter) ? [filter] : (target && target.tags) ? [target.tags[0]] : [];
    if (action === 'edit') {
      if (existingPost.json_metadata && existingPost.json_metadata.tags && existingPost.json_metadata.tags.length) {
        tags = existingPost.json_metadata.tags;
      }
    }
    this.drafts = props.drafts || {}
    this.state = {
      formId: _.uniqueId('postform_'),
      activeItem: 'post',
      beneficiaries: {},
      existingPost: (existingPost) ? existingPost : false,
      category: (existingPost) ? existingPost.parent_permlink : (filter) ? filter : (target && target.tags) ? target.tags[0] : false,
      recommended: (target && target.tags) ? target.tags : [],
      submitting: false,
      waitingforblock: false,
      preview: {},
      submitted: {},
      tags: tags
    };
  }

  onKeyDown = (e) => {
    if(e.nativeEvent.metaKey){
      if (e.nativeEvent.keyCode === 13) {
        this.formSubmit.handleClick()
        e.nativeEvent.preventDefault()
        e.stopPropagation()
        return false
      }
    }
  }

  componentWillMount() {
    const draft = this.drafts[this.getIdentifier()]
    if(draft) {
      new Noty({
        closeWith: ['click', 'button'],
        layout: 'topRight',
        progressBar: true,
        theme: 'semanticui',
        text: ReactDOMServer.renderToString(
          <Header>
            Draft Loaded
            <Header.Subheader>
              chainBB has loaded unsubmitted draft you had for this forum/thread. Hit cancel to delete this draft.
            </Header.Subheader>
          </Header>
        ),
        type: 'success',
        timeout: 8000
      }).show();
      this.setState({preview: draft || {}})
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.post && nextProps.post.submitted) {
      const submitted = nextProps.post.submitted
      if(submitted.formId === this.state.formId && submitted.ts !== this.state.submitted.ts) {
        if(submitted.hasError) {
          this.setState({
            hasError: true,
            submitted,
            submitting: false,
            error: submitted.error
          })
        } else {
          // If we have a parent, reload all of the children
          const t = this
          const { parent } = this.props
          if(parent) {
            let parent_author = (parent.root_author) ? parent.root_author : parent.author,
                parent_category = (parent.category) ? parent.category : 'tag',
                parent_permlink = (parent.root_permlink) ? parent.root_permlink : parent.permlink
            if(parent.root_post) {
              [ parent_author, parent_permlink ] = parent.root_post.split('/')
            }
            setTimeout(() => {
              t.props.actions.fetchPostResponses({
                author: parent_author,
                category: parent_category,
                permlink: parent_permlink
              })
            }, 5000)
          }
          // Remove the draft from storage
          this.removeDraft()
          // Parent callback
          this.props.onComplete(submitted)
          // Set our new state
          this.setState({
            submitted,
            submitting: false,
            hasError: false
          })
        }
      }
    }
  }

  handleCancel = (e) => {
    e.preventDefault()
    // Remove any drafts upon cancel
    this.removeDraft()
    // Clear the preview
    this.setState({preview: {}})
    // Reset the form
    this.form.formsyForm.reset()
    // Parent callback
    this.props.onCancel()
    e.preventDefault()
    return false
  }

  removeDraft = () => {
    const identifier = this.getIdentifier()
    const drafts = store.get('drafts') || {}
    delete drafts[identifier]
    store.set('drafts', drafts)
    this.drafts = drafts
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleBeneficiariesUpdate = (beneficiaries) => this.setState({beneficiaries})

  handleOnChange = _.debounce((data) => {
      const drafts = this.drafts || store.get('drafts') || {}
      const identifier = this.getIdentifier();
      const { title, body, rewards } = data
      const preview = { body, title, rewards, updated: +new Date() }
      // Store the preview as a draft
      if(title || body || rewards) {
        drafts[identifier] = { ...preview, beneficiaries: this.state.beneficiaries }
        store.set('drafts', drafts)
      }
      this.drafts = drafts
  }, 50);

  handleOnBlur = () => {
    this.setState({preview: this.drafts[this.getIdentifier()] || {}})
  }

  addTag = (e, data) => {
    let additionalTag = this.state.additionalTag,
        tags = this.state.tags
    if(tags.indexOf(additionalTag) === -1 && tags.length < 5) {
      tags.push(additionalTag)
      this.setState({
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

  submit = (e) => {
    const form = this.form.formsyForm
    const model = form.getModel()
    const _id = (this.props.forum.target) ? this.props.forum.target._id : this.props.forum._id
    const data = {
        ...model,
        ...this.state,
        forum: this.props.forum,
        namespace: _id,
    }
    const { action, account, parent } = this.props
    this.props.actions.submit(account, data, parent, action)
    this.setState({
      submitting: true
    })
    return false
  }

  cancelSubmitting = (e) => {
    e.preventDefault()
    window.location.reload()
    return false
  }


  dismissError = (e) => this.setState({
    hasError: false,
    errorMsg: false
  })

  getIdentifier = () => {
    let identifier = this.state.category
    let { action, existingPost, parent } = this.props
    if(!action) action = 'post'
    if(existingPost) {
      identifier = [action, existingPost.author, existingPost.permlink].join("/")
    }
    if(parent) {
      identifier = [action, parent.author, parent.permlink].join("/")
    }
    return identifier
  }

  render() {
    const { activeItem } = this.state
    const { account } = this.props
    const identifier = this.getIdentifier(),
          draft = this.drafts[identifier] || {}
    const disableAutoFocus = this.props.disableAutoFocus || false
    let formHeader = this.props.formHeader,
        { existingPost, tags } = this.state,
        enableMenu = false,
        formFieldTitle = false,
        formNotice = false,
        menu = false,
        menuDisplay = false

    if(this.props.elements.indexOf('title') !== -1) {
      formFieldTitle = (
        <PostFormFieldTitle
          value={(draft.title) ? draft.title : (existingPost) ? existingPost.title : ''}
        />
      )
    }

    if(this.props.elements.length > 1) {
      enableMenu = true
      const items = [
        {
          key: 'post',
          active: (activeItem === 'post'),
          name: 'post',
          onClick: this.handleItemClick
        },
        {
          key: 'tags',
          active: (activeItem === 'tags'),
          name: 'tags',
          onClick: this.handleItemClick
        },
      ]
      if(this.props.elements.indexOf('rewards') !== -1) {
        items.push({
          key: 'rewards',
          active: (activeItem === 'rewards'),
          name: 'rewards',
          onClick: this.handleItemClick
        })
      }
      // items.push({
      //   key: 'debug',
      //   active: (activeItem === 'debug'),
      //   name: 'debug',
      //   onClick: this.handleItemClick
      // })
      menu = (
        <Menu
          attached
          tabular
          items={items}
          onItemClick={this.handleItemClick}
        />
      )
    }
    if(enableMenu) {
      menuDisplay = (
        <div>
          <Segment attached='bottom' padded className={`${activeItem === 'debug' ? 'active ' : ''}tab`}>
            <code>
              <pre>
                {JSON.stringify((this.form) ? this.form.formsyForm.getModel() : {}, null, 2)}
              </pre>
            </code>
          </Segment>
          <Segment attached='bottom' padded className={`${activeItem === 'tags' ? 'active ' : ''}tab`}>
            <PostFormFieldTags
              additionalTag={this.state.additionalTag}
              addTag={this.addTag}
              filter={this.props.filter}
              forum={this.props.forum}
              handleChange={this.handleChange}
              removeTag={this.removeTag}
              tags={tags}
            />
          </Segment>
          <Segment attached='bottom' padded className={`${activeItem === 'post' ? 'active ' : ''}tab`}>
            {formFieldTitle}
            <PostFormFieldBody
              disableAutoFocus={disableAutoFocus}
              value={ (draft.body) ? draft.body : (existingPost) ? existingPost.body : '' }
            />
          </Segment>
          <Segment attached='bottom' padded className={`${activeItem === 'rewards' ? 'active ' : ''}tab`}>
            <PostFormFieldRewards
              author={account.name}
              draft={draft}
              handleBeneficiariesUpdate={this.handleBeneficiariesUpdate}
            />
          </Segment>
        </div>
      )
    } else {
      menuDisplay = (
        <PostFormFieldBody
          disableAutoFocus={disableAutoFocus}
          value={ (draft.body) ? draft.body : (existingPost) ? existingPost.body : '' }
        />
      )
    }
    return (
      <div>
        <Dimmer inverted active={this.state.submitting} style={{minHeight: '100px'}}>
          <Loader size='large' indeterminate>
            <Header>
              Submitting to the Steem blockchain
              <Header.Subheader>
                If you get stuck submitted, hit cancel below to reload this page and reconnect. Your post will be saved as a draft.
              </Header.Subheader>
            </Header>
            <Button onClick={this.cancelSubmitting}>Cancel</Button>
          </Loader>
        </Dimmer>
        <Dimmer inverted active={this.state.waitingforblock} style={{minHeight: '100px'}}>
          <Loader size='large' content='Waiting for next Block'/>
        </Dimmer>
        <PostFormError
          error={this.state.error}
          open={this.state.hasError}
          onClose={this.dismissError}
        />
        <Form
          ref={ref => this.form = ref }
          onChange={ this.handleOnChange }
          onKeyDown={this.onKeyDown}
          onBlur={this.handleOnBlur}
        >
          {formHeader}
          {formNotice}
          {menu}
          {menuDisplay}
          <Divider hidden />
          <Button
            ref={ref => this.formSubmit = ref}
            primary
            onClick={this.submit}
          >
            Post
          </Button>
          <PostPreview preview={this.state.preview} author={this.props.account.name} />
          <Button floated='right' color='orange' onClick={this.handleCancel}>Cancel & Delete Draft</Button>
        </Form>
      </div>
    )
  }

}

function mapStateToProps(state, ownProps) {
  const drafts = store.get('drafts');
  return {
    account: state.account,
    forum: state.forum,
    post: state.post,
    drafts: (typeof drafts === 'object') ? drafts : {}
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...postActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
