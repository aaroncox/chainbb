import React from 'react';

import { Label, Popup } from 'semantic-ui-react'

export default class VoterAvatars extends React.Component {

  render() {
    const { count, accounts, votes } = this.props;
    return (
      <Popup
        trigger={
          <Label basic size='large' style={{margin: '0 .25rem .5rem .5rem', minHeight: '35px'}}>
            +{count} more
          </Label>
        }
        position='bottom center'
        hoverable={true}
        wide='very'
        content={accounts.slice(9,-1).map((account, i) => <span key={i}>
          {!!i && ", "}
          <a href={`https://steemit.com/@${account}`} target='_blank' key={i}>
            @{account} ({votes[account]/100}%)
          </a>
        </span>)}
      />
    )
  }

}
