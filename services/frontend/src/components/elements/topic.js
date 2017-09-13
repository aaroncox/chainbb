import React from 'react';

import { Breadcrumb, Dimmer, Loader, Grid, Header, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import * as GLOBAL from '../../global';
import AccountLink from './account/link'
import TimeAgo from 'react-timeago'

export default class Forum extends React.Component {

    constructor(props) {
      super(props);
      this.state = { topics: [] };
      this.getForum = this.getForum.bind(this);
    }

    componentDidMount() {
      this.getForum()
    }

    async getForum() {
      try {
        const { category } = this.props;
        const response = await fetch(`${ GLOBAL.REST_API }/topics/${ category }`);
        if (response.ok) {
          const result = await response.json();
          this.setState({
            topics: result.data
          });
        } else {
          console.error(response.status);
        }
      } catch(e) {
        console.error(e);
      }
    }

    render() {
      let loaded = (this.state.topics.length > 0),
          loader = {
            style:{
              minHeight: '100px',
              display: 'block'
            },
            content: 'Loading'
          },
          display = <Dimmer inverted active style={loader.style}>
                      <Loader size='large' content={loader.content}/>
                    </Dimmer>
      if(loaded) {
        display = this.state.topics.map((topic, index) => {
                    return <Segment attached key={index}>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={8}>
                            <Header size='medium'>
                              <Link to={`${topic.url}`}>
                                {topic.title}
                              </Link>
                              <Header.Subheader>
                                <AccountLink username={topic.author} />
                                {' • '}
                                <TimeAgo date={`${topic.created}Z`} />
                              </Header.Subheader>
                            </Header>
                          </Grid.Column>
                          <Grid.Column width={8} className="right aligned">
                            <Link to={`/@${topic.last_reply_by}`}>{topic.last_reply_by}</Link>
                            <br/>
                            <TimeAgo date={`${topic.last_reply}Z`} />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                })
      }
      return(
        <div>
          <Breadcrumb>
            <Link to='/' className='section'>Forum Index</Link>
            <Breadcrumb.Divider />
            <Breadcrumb.Section>Tag</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>{this.props.category}</Breadcrumb.Section>
          </Breadcrumb>
          <Segment attached='top'>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header size='small'>
                    Forum
                  </Header>
                </Grid.Column>
                <Grid.Column width={8} className="right aligned">
                  <Header size='small'>
                    Latest Reply
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {display}
        </div>
      );
    }
}
