import * as types from './actionTypes';
import steem from 'steem'
import store from 'store'
import Noty from 'noty'

export function claimRewards(params) {
  return (dispatch: () => void) => {
    const { account, reward_steem, reward_sbd, reward_vests } = params;
    const { name, key } = account;
    const ops = [
      ['claim_reward_balance', {
        account: name,
        reward_steem,
        reward_sbd,
        reward_vests
      }]
    ];
    steem.broadcast.send({
      operations: ops,
      extensions: []
    }, {
      posting: key
    }, (err, result) => {
      dispatch(fetchAccount());
      new Noty({
        closeWith: ['click', 'button'],
        layout: 'topRight',
        progressBar: true,
        theme: 'semanticui',
        text: 'Rewards successfully claimed!',
        type: 'success',
        timeout: 8000
      }).show();
    });
  };
}

export function fetchAccount() {
  return dispatch => {
    let payload = {
      isUser: (typeof store.get('account') !== 'undefined'),
      name: store.get('account'),
      key: store.get('key'),
    }
    dispatch({
      type: types.ACCOUNT_FETCH,
      payload: payload,
      loading: true
    })
    if(payload.isUser) {
      setTimeout(function() {
        steem.api.getAccounts([payload.name], function(err, data) {
          dispatch(fetchAccountResolved(Object.assign({}, payload, {
            data: data[0],
            loading: false
          })))
        })
      }, 500)
    }
  }
}

export function fetchAccountResolved(payload) {
  return {
    type: types.ACCOUNT_FETCH,
    payload: payload
  }
}

export function signoutAccount() {
  return {type: types.ACCOUNT_SIGNOUT}
}

export function signinAccount(account, key, data) {
  let payload = {
    account: account,
    key: key,
    data: data
  }
  return {type: types.ACCOUNT_SIGNIN, payload: payload}
}
