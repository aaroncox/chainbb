import React from 'react';

import { Label } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

export default class PostFormFieldTitle extends React.Component {
  render() {
    const { value } = this.props
    return (
      <Form.TextArea
        name="body"
        label={(<span>Post Body (Markdown Enabled - <a href='https://blog.ghost.org/markdown/' target='_blank'>Learn Markdown (?)</a>)</span>)}
        placeholder='Write your post here.'
        required
        rows={14}
        defaultValue={value}
        errorLabel={ <Label color="red" pointing/> }
        validationErrors={{
          isDefaultRequiredValue: 'A post body is required.',
        }}
      />
    )
  }
}
