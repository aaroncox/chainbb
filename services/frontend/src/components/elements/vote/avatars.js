import React from 'react';
import { Link } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'

export default class VoterAvatars extends React.Component {

  render() {
    const { accounts, votes } = this.props;
    const elements = accounts.slice(0,10).map((account, i) => (
      <Link to={`/@${account}`} key={i}>
        <Popup
          trigger={<img key={i} alt='{account}' src={`https://img.steemconnect.com/@${account}?size=35`} className="ui rounded image" />}
          position='bottom center'
          content={`@${account} (${votes[account]/100}%)`}
        />
      </Link>
    ))
    return (<span>{elements}</span>)
  }

}
