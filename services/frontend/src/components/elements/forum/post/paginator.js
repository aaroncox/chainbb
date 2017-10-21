import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { List } from 'semantic-ui-react'

export default class Paginator extends Component {

  render() {
    let { perPage, total, url } = this.props,
        pages = Math.ceil(total / perPage),
        elements = []
    if(pages <= 1) return false;
    if(pages > 1) {
      elements.push((
        <List.Item key={1}  style={{margin: '0 0.35em'}}>
          <Link to={`${url}#comments-page-1`}>1</Link>
        </List.Item>
      ))
      elements.push((
        <List.Item key={2}  style={{margin: '0 0.35em'}}>
          <Link to={`${url}#comments-page-2`}>2</Link>
        </List.Item>
      ))
    }
    if(pages > 2 && pages < 6) {
      elements.push((
        <List.Item key={3}  style={{margin: '0 0.35em'}}>
          <Link to={`${url}#comments-page-3`}>3</Link>
        </List.Item>
      ))
      if(pages > 3) {
        elements.push((
          <List.Item key={4}  style={{margin: '0 0.35em'}}>
            <Link to={`${url}#comments-page-4`}>4</Link>
          </List.Item>
        ))
      }
      if(pages > 4) {
        elements.push((
          <List.Item key={5}  style={{margin: '0 0.35em'}}>
            <Link to={`${url}#comments-page-5`}>5</Link>
          </List.Item>
        ))
      }
    }
    if(pages >= 6) {
      elements.push((
        <List.Item key={'gap'}  style={{margin: '0 0.35em'}}>
          ...
        </List.Item>
      ))
      elements.push((
        <List.Item key={'2nd-last'}  style={{margin: '0 0.35em'}}>
          <Link to={`${url}#comments-page-${pages-1}`}>{pages-1}</Link>
        </List.Item>
      ))
      elements.push((
        <List.Item key={'last'}  style={{margin: '0 0.35em'}}>
          <Link to={`${url}#comments-page-${pages}`}>{pages}</Link>
        </List.Item>
      ))
    }
    return (
      <List horizontal size='small' style={{margin: '0 0 0 0.35em'}}>
        <List.Item style={{margin: '0'}}>
          • Page
        </List.Item>
        {elements}
      </List>
    )
  }
}
