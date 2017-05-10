import React, { Component } from 'react'

import { Menu } from 'semantic-ui-react'

export default class Paginator extends Component {

  changePage = (e, data) => {
    this.props.callback(data.value, `comments-page-${data.value}`)
    e.preventDefault()
  }

  render() {
    let { page, perPage, total } = this.props,
        pages = Math.ceil(total / perPage),
        elements = []
    if(pages === 1) return false
    if(page !== 1 && page > 1) {
      elements.push({
        key: `page-prev`,
        name: page-1+'',
        value: page-1,
        content: 'Prev',
        onClick: this.changePage
      })
    }
    if(page > 1) {
      elements.push({
        key: `page-first`,
        name: 1+'',
        value: 1,
        onClick: this.changePage
      })
    }
    if(page > 2 && pages > 3) {
      elements.push({
        key: `page-group-previous`,
        disabled: true,
        content: '...'
      })
    }
    elements.push({
      key: `page-${page}`, active:true,
      name: page+'',
      value: page,
      onClick:  this.changePage
    })
    if(page !== 2 && page < 3 && pages > 1) {
      elements.push({
        key: `page-second`,
        name: 2+'',
        value: 2,
        onClick: this.changePage
      })
    }
    if(page + 3 <= pages) {
      elements.push({
        key: `page-page-group-next`,
        disabled: true,
        content: '...'
      })
    }
    if(page !== pages) {
      elements.push({
        key: `page-last`,
        name: pages+'',
        value: pages,
        onClick: this.changePage
      })
    }
    if(page !== pages && pages > 1) {
      elements.push({
        key: `page-next`,
        name: page+1+'',
        value: page+1,
        content: 'Next',
        onClick: this.changePage
      })
    }
    // elements.push({
    //   key: 'per-page',
    //   content: (
    //     <Dropdown item text={`Display: ${perPage}`} style={{padding: 0}}>
    //       <Dropdown.Menu>
    //         <Dropdown.Item text='Display 5 per page' />
    //         <Dropdown.Item text='Display 10 per page' />
    //         <Dropdown.Item text='Display 25 per page' />
    //         <Dropdown.Item text='Display 50 per page' />
    //       </Dropdown.Menu>
    //     </Dropdown>
    //   )
    // })
    return (
      <Menu pagination floated='right' items={elements} />
    )
  }
}
