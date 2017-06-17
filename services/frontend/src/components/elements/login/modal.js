import React from 'react'
import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react'
import steem from 'steem'

export default class LoginModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      warningOpen: false,
      loginOpen: false,
      error: false,
      loading: false,
      account: '',
      key: ''
    }
  }

  handleOpen = (e) => this.setState({
    warningOpen: true,
    loginOpen: false
  })

  handleSwap = (e) => this.setState({
    warningOpen: false,
    loginOpen: true
  })

  handleClose = (e) => this.setState({
    warningOpen: false,
    loginOpen: false
  })

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = e => {
    e.preventDefault()
    const { account, key } = this.state,
          t = this
    let isValidKey = steem.auth.isWif(key),
        isValidForAccount = false
    // Indicate we're loading
    t.setState({
      loading: true,
      error: false
    })
    if(isValidKey) {
      steem.api.getAccounts([account], function(err, result) {
        if(!result.length) {
          t.setState({
            loading: false,
            error: 'Invalid account name'
          })
          return
        }
        if(result) {
          let public_key = steem.auth.wifToPublic(key),
              key_auths = result[0].posting.key_auths
          for(var i=0; i < key_auths.length; i++) {
            if(key_auths[i][0] === public_key) {
              isValidForAccount = true
            }
          }
        }
        if(isValidForAccount) {
          t.props.actions.signinAccount(account, key, result[0])
          t.handleClose()
        } else {
          t.setState({
            loading: false,
            error: 'Invalid WIF Key for Account'
          })
        }
      })
    } else {
      t.setState({
        loading: false,
        error: 'Invalid WIF Key'
      })
    }


  }

  render() {
    let modal = (
      <Modal
        trigger={<Button fluid onClick={this.handleOpen}>Sign-in</Button>}
        open={this.state.warningOpen}
        onOpen={this.open}
        onClose={this.close}
        basic
        size='small'
        className='modal-warning'
      >
        <Header icon='warning' content='Fair warning: This is beta software' />
        <Modal.Content>
          <h3>Please use your use your keys responsibly.</h3>
          <h5>This is beta software and you use it at your own risk. Please ensure you are only using your posting key within the site to ensure your account balance is safe.</h5>
          {/*<p>For more information and best practices, please <Link to='#' rel='nofollow' target='_blank'>read our post about security and your keys</Link>.</p>*/}
        </Modal.Content>
        <Modal.Actions>
          <Button color='orange' onClick={this.handleClose}>Cancel</Button>
          <Button color='green' icon onClick={this.handleSwap}>Proceed <Icon name='right chevron' /></Button>
        </Modal.Actions>
      </Modal>
    )
    if(this.state.loginOpen) {
      modal = (
        <Modal
          open={this.state.loginOpen}
          size='small'
        >
          <Header icon='lock' content='Login using your account credentials' />
          <Modal.Content>
            <Message>
              <Message.Header>Before you login, please note:</Message.Header>
              <Message.List>
                <Message.Item>chainBB uses Steem&lsquo;s Post Beneficiaries feature to support itself, at a rate of 15% on all posts created.</Message.Item>
                <Message.Item>chainBB will only accept posting keys (WIF) for login, which are currently stored unencrypted in local storage.</Message.Item>
                <Message.Item>chainBB is currently in <strong>BETA</strong> and still may contain bugs.</Message.Item>
              </Message.List>
            </Message>
            <Form
              error={(this.state.error) ? true : false}
              loading={this.state.loading}>
              <Form.Input placeholder='Account Name' name='account' value={this.state.account} onChange={this.handleChange} />
              <Form.Input placeholder='Posting (Private Key)' type='password' name='key' value={this.state.key} onChange={this.handleChange} />
              <p>
                Need help finding your <strong>Posting (Private Key)</strong>?
                {' '}
                <a rel='nofollow' target='_blank' href='https://steemit.com/steemit-guides/@rgeddes/getting-your-posting-key---made-easy'>
                  Read this post by @rgeddes on steemit.com.
                </a>
              </p>
              <Message
                error
                header='Error'
                content={this.state.error}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='orange' onClick={this.handleClose}>Cancel</Button>
            <Button color='blue' icon onClick={this.handleSubmit}>Sign-in <Icon name='right chevron' /></Button>
          </Modal.Actions>
        </Modal>
      )
    }
    return modal
  }
}
