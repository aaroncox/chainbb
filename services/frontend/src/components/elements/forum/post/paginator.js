import React, { Component } from 'react'

import { List } from 'semantic-ui-react'

export default class Paginator extends Component {

  render() {
    let { perPage, total, url } = this.props,
        pages = Math.ceil(total / perPage),
        elements = []
    if(pages <= 1) return false;
    if(pages > 1) {
      elements.push((
        <List.Item key={1}>
          <a href={`${url}#comments-page-1`}>1</a>
        </List.Item>
      ))
      elements.push((
        <List.Item key={2}>
          <a href={`${url}#comments-page-2`}>2</a>
        </List.Item>
      ))
    }
    if(pages > 2 && pages < 6) {
      elements.push((
        <List.Item key={3}>
          <a href={`${url}#comments-page-3`}>3</a>
        </List.Item>
      ))
      if(pages > 3) {
        elements.push((
          <List.Item key={4}>
            <a href={`${url}#comments-page-4`}>4</a>
          </List.Item>
        ))
      }
      if(pages > 4) {
        elements.push((
          <List.Item key={5}>
            <a href={`${url}#comments-page-5`}>5</a>
          </List.Item>
        ))
      }
    }
    if(pages >= 6) {
      elements.push((
        <List.Item key={'gap'}>
          ...
        </List.Item>
      ))
      elements.push((
        <List.Item key={'2nd-last'}>
          <a href={`${url}#comments-page-${pages-1}`}>{pages-1}</a>
        </List.Item>
      ))
      elements.push((
        <List.Item key={'last'}>
          <a href={`${url}#comments-page-${pages}`}>{pages}</a>
        </List.Item>
      ))
    }
    return (
      <div style={{marginLeft: '1.25em'}}>
        <List horizontal size='small'>
          <List.Item header>Pages</List.Item>
          {elements}
        </List>
      </div>
    )
  }
}
