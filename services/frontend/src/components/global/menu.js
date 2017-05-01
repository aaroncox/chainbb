import React, { Component } from 'react'
import { Container, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import * as GLOBAL from '../../global';

export default class HeaderMenu extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  constructor(props) {
    super(props)
    this.state = { height: '' }
    this.getHeight = this.getHeight.bind(this)
  }

  componentDidMount() {
    this.getHeight()
  }

  async getHeight() {
    try {
      const response = await fetch(`${ GLOBAL.REST_API }/height`)
      if (response.ok) {
        const result = await response.json()
        this.setState({
          height: result.data.value
        })
      } else {
        console.error(response.status)
      }
    } catch(e) {
      console.error(e)
    }
  }


  render() {
    const { height } = this.state
    return (
      <Menu inverted>
        <Container>
          <Link to='/' className='title item'>chainBB</Link>
          <Link to='/' className='title active item'>Forums</Link>
          <Menu.Item position='right'>Block Height: {height}</Menu.Item>
        </Container>
      </Menu>
    )
  }
}
