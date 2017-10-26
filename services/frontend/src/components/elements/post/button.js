import React from 'react';

import { Link } from 'react-router-dom'

export default class PostButton extends React.Component {
  render() {
    return (
      <Link className='ui button right floated' to={`/f/${this.props.category}/post`}>
        <i className='pencil icon'></i>
        New Post
      </Link>
    )
  }
}
