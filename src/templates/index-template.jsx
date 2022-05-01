import React from 'react'
import Helmet from 'react-helmet'
import Post from '../components/Post'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import CustomPagination from './paging'

class IndexTemplate extends React.Component {
  constructor(props) {
    super(props)

    console.log('here! ', props.data)
    let pagingState
    console.log('pagingState: ', pagingState)
    if (typeof window !== 'undefined') {
      pagingState = sessionStorage.getItem('pagingState')
    }

    const routePath = this.props.location.pathname

    if (pagingState) {
      const state = JSON.parse(pagingState)
      if (state.routePath === routePath) {
        this.state = state
        return
      }
    }

    const totalPostCnt = props.data.allMarkdownRemark.edges ? props.data.allMarkdownRemark.edges.length : 0
    const totalPage = totalPostCnt > 0 ? Math.ceil(props.data.allMarkdownRemark.edges.length / 5.0) : 1

    this.state = {
      totalPostCnt,
      totalPage,
      currentPage: 1,
      perPage: 5,
      offset: 0,
      routePath,
    }

    if (typeof window !== 'undefined') { sessionStorage.setItem('pagingState', JSON.stringify(this.state)) }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    sessionStorage.setItem('pagingState', JSON.stringify(this.state))
  }


  render() {
    const items = []
    const { title, subtitle } = this.props.data.site.siteMetadata
    const { allMarkdownRemark } = this.props.data
    const posts = allMarkdownRemark ? allMarkdownRemark.edges : null

    const totalPostCnt = this.state.totalPostCnt
    const startIndx = this.state.offset
    const endIdx = startIndx + this.state.perPage

    console.log('totalPostCnt: ', totalPostCnt)
    if (posts) {
      const displayPosts = posts.slice(startIndx, endIdx > totalPostCnt ? totalPostCnt : endIdx)
      displayPosts.forEach(post => {
        items.push(<Post data={post} key={post.node.fields.slug} />)
      })
    }

    return (
      <Layout>
        <div>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={subtitle} />
          </Helmet>
          <Sidebar {...this.props} />
          <div className="content">
            <CustomPagination
              currentPage={this.state.currentPage}
              totalPage={this.state.totalPage}
            />
            <div className="content__inner">{items}</div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default IndexTemplate
