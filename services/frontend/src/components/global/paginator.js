import React, { Component } from 'react'
import { goToAnchor } from 'react-scrollable-anchor'

import { Grid, Menu, Segment } from 'semantic-ui-react'

export default class Paginator extends Component {

  changePage = (e, data) => {
    this.props.callback(data.value)
    goToAnchor('comment-top')
    e.preventDefault()
  }

  render() {
    let { page, perPage, total } = this.props,
        pages = Math.ceil(total / perPage),
        elements = [{
          key: 'title',
          header: true,
          name: `Page: ${page}`
        }]
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
    if(page > 3) {
      elements.push({
        key: `page-first`,
        name: 1+'',
        value: 1,
        onClick: this.changePage
      })
    }
    if(page > 4) {
      elements.push({
        key: `page-group-previous`,
        disabled: true,
        content: '...'
      })
    }
    if(page > 2) elements.push({
      key: `page-${page-2}`,
      name: page-2+'',
      value: page-2,
      onClick: this.changePage
    })
    if(page > 1) elements.push({
      key: `page-${page-1}`,
      name: page-1+'',
      value: page-1,
      onClick: this.changePage
    })
    elements.push({
      key: `page-${page}`, active:true,
      name: page+'',
      value: page,
      onClick:  this.changePage
    })
    if(page <= pages - 1) elements.push({
      key: `page-${page+1}`,
      name: page+1+'',
      value: page+1,
      onClick: this.changePage
    })
    if(page <= pages - 2) elements.push({
      key: `page-${page+2}`,
      name: page+2+'',
      value: page+2,
      onClick: this.changePage
    })
    if(page + 3 < pages) {
      elements.push({
        key: `page-page-group-next`,
        disabled: true,
        content: '...'
      })
    }
    if(page + 2 < pages) {
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
      <Grid>
        <Grid.Row stretched>
          <Grid.Column mobile={16} tablet={16} computer={16}>
            <Segment clearing basic padded>
              <Menu pagination floated='right' items={elements} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
