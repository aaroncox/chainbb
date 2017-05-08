import React, { Component } from 'react'
import { Container, Grid, Segment } from 'semantic-ui-react'
// import { Link } from 'react-router-dom'

export default class HeaderMenu extends Component {
  render() {
    return (
      <Segment inverted vertical className="footer" style={{marginTop: "2em"}}>
        <Container>
          <Grid stackable className="divided equal height stackable">
            {/*
            <Grid.Column width={3}>
              <h4 class="ui inverted header">About</h4>
              <List class="ui inverted link list">
                <Link to="#" className="item">Sitemap</Link>
                <Link to="#" className="item">Contact Us</Link>
                <Link to="#" className="item">Religious Ceremonies</Link>
                <Link to="#" className="item">Gazebo Plans</Link>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <h4 class="ui inverted header">Services</h4>
              <List class="ui inverted link list">
                <Link to="#" className="item">Banana Pre-Order</Link>
                <Link to="#" className="item">DNA FAQ</Link>
                <Link to="#" className="item">How To Access</Link>
                <Link to="#" className="item">Favorite X-Men</Link>
              </List>
            </Grid.Column>
            */}
            <Grid.Column width={16} textAlign='center'>
              <h4 className="ui inverted header">chainBB.com</h4>
              <p>
                An experimental forum build on top of the
                <a href='https://steemit.com' target='_new'> Steem </a>
                blockchain,
                <br />
                brought to you by
                <a href='http://jesta.us' target='_new'> jesta</a>.
              </p>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    )
  }
}
