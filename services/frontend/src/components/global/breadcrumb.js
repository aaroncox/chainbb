import React, { Component } from 'react'
import { Breadcrumb, Container, Grid, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as breadcrumbActions from '../../actions/breadcrumbActions'

class BreadcrumbMenu extends Component {

  render() {
    let trail = this.props.breadcrumb.trail,
        post = this.props.post
    if(post && post.breadcrumb) {
      trail = trail.concat(post.breadcrumb)
      trail = Array.from(trail.reduce((m, t) => m.set(t.link, t), new Map()).values());
    }
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Container>
              <Segment attached>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={12}>
                      <Breadcrumb>
                        {trail.map((crumb, i) => <span key={i}>
                          {!!i && <Breadcrumb.Divider></Breadcrumb.Divider>}
                          <Link to={crumb.link} className='section'>{crumb.name}</Link>
                        </span>)}
                      </Breadcrumb>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      {effectiveness}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}



function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    breadcrumb: state.breadcrumb,
    post: state.post
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(breadcrumbActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(BreadcrumbMenu);
