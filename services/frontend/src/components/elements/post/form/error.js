import React from 'react';

import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { Form, TextArea } from 'formsy-semantic-ui-react'

export default class PostFormError extends React.Component {
  render() {
    const { error } = this.props
    if(!error) return false
    const message = window.location.href + "\n\n" + error.err.message
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        basic
        size='small'
        >
        <Header icon='alarm outline' content='Error Submitting to the Blockchain' />
        <Modal.Content>
          <Header color='red'>{error.message}</Header>
          <Form>
           <Form.Field
             control={TextArea}
             defaultValue={message}
             name='error'
           />
           <p>If you need assistance, please notify @jesta here on the forums, on steemit.com, or via steemit.chat. Please include the error messages, all of the text in the box above, and a description of what you were attempting to do.</p>
         </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.props.onClose} inverted>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
