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
          dispatch(fetchAccountFollowing(payload.name))
        })
      }, 50)
    }
  }
}

export function fetchAccountFollowing(name, start="", limit=100) {
  return dispatch => {
    steem.api.getFollowing(name, start, "blog", limit, function(err, result) {
      if(!result) return
      const accounts = result.map((c) => { return c.following })
      if(result.length === limit) {
        const last = result[result.length-1].following
        setTimeout(function() {
          dispatch(fetchAccountFollowing(name, last, limit))
        }, 50)
      }
      dispatch({
        type: types.ACCOUNT_FOLLOWING_APPEND,
        following: accounts
      })
    })
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

export function follow(payload) {
  return (dispatch: () => void) => {
    const wif = payload.account.key
    const account = payload.account.name
    const who = payload.who
    const what = (payload.action === 'follow') ? ['blog'] : []
    const json = JSON.stringify(['follow', {follower: account, following: who, what: what}])
    steem.broadcast.customJsonAsync(wif, [], [account], 'follow', json, function(err, result) {
      if(payload.action === 'follow') {
        dispatch({
          type: types.ACCOUNT_FOLLOWING_APPEND,
          following: [who]
        })
      } else {
        dispatch({
          type: types.ACCOUNT_FOLLOWING_REMOVE,
          account: who
        })
      }
    })
  }
}
