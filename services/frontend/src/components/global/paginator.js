import React, { Component } from 'react'

import { Menu, Select } from 'semantic-ui-react'
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

export default class Paginator extends Component {

  changePage = (data) => {
    this.props.callback(data, `comments-page-${data}`)
  }

  render() {
    let { page, perPage, total } = this.props
    return (
      <Pagination
        showLessItems
        defaultPageSize={perPage}
        current={page}
        onShowSizeChange={this.onShowSizeChange}
        onChange={this.changePage}
        total={total}
        style={{ float: 'right' }}
      />
    )
  }
}
