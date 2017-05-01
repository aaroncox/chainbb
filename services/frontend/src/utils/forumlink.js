import React from 'react'
import { Link } from 'react-router-dom'

export default class ForumLink extends React.Component {
    render() {
      return(<Link to={"/forum/" + this.props.forum._id}>{this.props.forum.name}</Link>);
    }
}
