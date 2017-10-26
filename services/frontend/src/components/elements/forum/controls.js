import React from 'react';

import { Button, Checkbox, Menu, Popup } from 'semantic-ui-react'

import Paginator from '../../global/paginator'

export default class ForumIndex extends React.Component {
    render() {
        const { isUser, page, perPage, posts } = this.props
        let newPostButton = (
                <Popup
                    trigger={
                        <Button floated='left' size='tiny'>
                            <i className='pencil icon'></i>
                            New Post
                        </Button>
                    }
                    position='bottom center'
                    inverted
                    content='You must be logged in to post.'
                    basic
                />
            )
        if(isUser) {
            newPostButton = (
                <Button floated='left' color='green' size='tiny' onClick={this.props.showNewPost}>
                    <i className='pencil icon'></i>
                    Post
                </Button>
            )
        }
        return (
            <Menu fluid style={{border: 'none', boxShadow: 'none'}} attached size='small'>
                <Menu.Item>
                    {newPostButton}
                </Menu.Item>
                <Menu.Item>
                    <Checkbox
                        label='Show hidden'
                        name='moderatedVisible'
                        onChange={this.props.changeVisibility}
                        checked={this.props.showModerated}
                    />
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Paginator
                            page={page}
                            perPage={perPage}
                            total={posts}
                            callback={this.props.changePage}
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}
