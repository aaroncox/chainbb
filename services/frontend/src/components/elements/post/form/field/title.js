import React from 'react';

import { Label } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

export default class PostFormFieldTitle extends React.Component {
  render() {
    const { value } = this.props
    return (
      <Form.Field>
        <Form.Input
          name="title"
          label="Post Title"
          required
          defaultValue={value}
          placeholder='What should this post be titled?'
          validationErrors={{
            isDefaultRequiredValue: 'A title is required'
          }}
          errorLabel={<Label color="red" pointing/>}
        />
      </Form.Field>
    )
  }
}
