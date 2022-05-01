import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Pagination from 'materialui-pagination-component'
import Layout from '../components/Layout'
import Post from '../components/Post'
import Sidebar from '../components/Sidebar'

class IndexRoute extends React.Component {
  constructor(props) {
    super(props)

    const routePath = this.props.location.pathname
    let pagingState
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      pagingState = window.sessionStorage.getItem('pagingState')
    }

    if (pagingState) {
      const state = JSON.parse(pagingState)
      if (state.routePath === routePath) { // paging 유지
        this.state = {
          ...state,
          posts: this.getFilteredPostsBySearchWord(state.searchWord),
        }
        return
      }
    }

    // paging 초기화
    const posts = props.data.allMarkdownRemark.edges
    const totalPostCnt = posts ? posts.length : 0
    const totalPage = totalPostCnt > 0 ? Math.ceil(totalPostCnt / 5.0) : 1

    this.state = {
      searchWord: '',
      totalPostCnt,
      totalPage,
      currentPage: 1,
      perPage: 5,
      offset: 0,
      routePath,
      posts,
    }

    if (typeof window !== 'undefined')
      sessionStorage.setItem('pagingState', JSON.stringify({ ...this.state, posts: [] }))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    sessionStorage.setItem('pagingState', JSON.stringify({ ...this.state, posts: [] }))
  }

  getFilteredPostsBySearchWord(searchWord) {
    let filteredPosts = this.props.data.allMarkdownRemark.edges
    if (searchWord) {
      const upperedSearchWord = searchWord.toUpperCase()
      filteredPosts = filteredPosts.filter(post => {
        const { title, description } = post.node.frontmatter
        return (title.toUpperCase().indexOf(upperedSearchWord) > -1) || (description.toUpperCase().indexOf(upperedSearchWord) > -1)
      })
    }
    return filteredPosts
  }

  onFilterPostsBySearchWord() {
    const filteredPosts = this.getFilteredPostsBySearchWord(this.state.searchWord)
    const totalPostCnt = filteredPosts.length
    const totalPage = totalPostCnt > 0 ? Math.ceil(totalPostCnt/5.0) : 1

    this.setState({
      ...this.state,
      totalPostCnt,
      totalPage,
      currentPage: 1,
      posts: filteredPosts
    })
  }

  render() {
    const items = []
    const { title, subtitle } = this.props.data.site.siteMetadata
    const posts = this.state.posts

    const totalPostCnt = this.state.totalPostCnt
    const startIndx = this.state.offset
    const endIdx = startIndx + this.state.perPage


    if(posts) {
      const displayPosts = posts.slice(startIndx, endIdx > totalPostCnt ? totalPostCnt : endIdx)
      displayPosts.forEach(post => {
        items.push(<Post data={post} key={post.node.fields.slug} />)
      })
    }


    // const items = []
    // const { title, subtitle } = this.props.data.site.siteMetadata
    // const posts = this.props.data.allMarkdownRemark.edges
    // posts.forEach(post => {
    //   items.push(<Post data={post} key={post.node.fields.slug} />)
    // })

    return (
      <Layout>
        <div>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={subtitle} />
          </Helmet>
          <Sidebar {...this.props} />
          <div className="content">
            <div style={{marginTop: '15px', textAlign: 'end'}}>
              <div>
                <input
                  value={this.state.searchWord}
                  placeholder={'Search'}
                  onKeyUp={e => {
                    if(e.key === 'Enter')
                      this.onFilterPostsBySearchWord()
                  }}
                  onChange={(e) => {
                    this.setState({ ...this.state, searchWord: e.currentTarget.value })
                  }} />
              </div>

              <Pagination
                variant="text" // Valid options are ["text", "outlined"].
                selectVariant="tab" // Valid options are ["button", "tab", "select"].
                navigationVariant="icon" // Valid options are ["icon", "text"].
                pageWindowVariant="ellipsis" // Valid options are ["standard", "ellipsis"].
                color="primary" // Passed down to Material-UI components.
                indicatorColor="primary" // Passed down to Material-UI Tabs.
                hideNavigation={false} // Hides the first, last, previous, & next page navigation buttons.
                hideFirst={false} // Hides the first page navigation button.
                hideLast={false} // Hides the last page navigation button.
                hidePrevious={false} // Hides the previous page navigation button.
                hideNext={false} // Hides the next page navigation button.
                disableFirst={false} // Disables the first page navigation button.
                disableLast={false} // Disables the last page navigation button.
                disablePrevious={false} // Disables the previous page navigation button.
                disableNext={false} // Disables the next page navigation button.
                page={this.state.currentPage} // The current page.
                totalPages={this.state.totalPage} // The total number of pages.
                elevation={0} // Passed down to Material-UI Paper component.
                onChange={(currentPage) => {
                  if(!currentPage) currentPage = 1
                  this.setState({currentPage, offset: (currentPage-1)*5})}
                } // Callback when the page changes.
              />
            </div>
            <div className="content__inner">{items}</div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default IndexRoute

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        subtitle
        copyright
        menu {
          label
          path
        }
        author {
          name
          email
          telegram
          twitter
          github
          rss
          vk
        }
      }
    }
    allMarkdownRemark(
      limit: 1000
      filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`
