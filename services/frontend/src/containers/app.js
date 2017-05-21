import React from 'react'
import { BrowserRouter, browserHistory, Route } from 'react-router-dom';

import { Container } from 'semantic-ui-react'

import IndexLayout from '../components/layouts/index'
import ForumLayout from '../components/layouts/forum'
import Thread from '../containers/thread'
import TopicLayout from '../components/layouts/topic'

import BreadcrumbMenu from '../components/global/breadcrumb'
import FooterMenu from '../components/global/footer'
import HeaderMenu from '../components/global/menu'
import GlobalNotice from '../components/global/notice'

import './app.css'

const App = () => (
  <BrowserRouter history={browserHistory}>
    <div className="AppContainer">
      <HeaderMenu />
      <BreadcrumbMenu />
      <GlobalNotice />
      <Container>
        <Route exact path="/" component={IndexLayout} />
        <Route path="/forums/:group" component={IndexLayout} />
        <Route path="/forum/:id" component={ForumLayout} />
        <Route path="/topic/:category" component={TopicLayout} />
        <Route path="/:category/@:author/:permlink" component={Thread} />
      </Container>
      <BreadcrumbMenu />
      <FooterMenu />
    </div>
  </BrowserRouter>
)

export default App
