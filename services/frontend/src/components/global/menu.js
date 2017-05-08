import React, { Component } from 'react'
import { Container, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import * as GLOBAL from '../../global';

export default class HeaderMenu extends Component {
  render() {
    return (
      <Menu color='blue' inverted>
        <Container>
          <Link to='/' className='title active item'>
            <strong>chainBB.com</strong>
          </Link>
          <Link to='/' className='title item'>General</Link>
          <Link to='/' className='title item'>Crypto</Link>
        </Container>
      </Menu>
    )
  }
}
