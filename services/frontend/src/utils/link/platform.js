import React from 'react'

export default class PlatformLink extends React.Component {
    render() {
      let platform = this.props.platform,
          link = <span>{platform}</span>
      if(platform) {
        let [id, version] = platform.split("/")
        switch(id) {
          case "chainbb":
            link = <a rel='nofollow' alt={`${id}/${version}`} href='https://chainbb.com'>chainbb.com</a>
            break
          case "steemit":
            link = <a rel='nofollow' alt={`${id}/${version}`} href='https://steemit.com'>steemit.com</a>
            break
          default:
            break
        }
      } else {
        link = <span>unknown client</span>
      }
      return(link);
    }
}
