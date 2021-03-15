import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import Sidebar from '../../components/Sidebar';
import Pagination from "materialui-pagination-component";

class WorksIndexRoute extends React.Component {

  constructor(props) {
    super(props);

    const pagingState = sessionStorage.getItem("pagingState");
    const routePath = this.props.location.pathname;

    if(pagingState) {
      const state = JSON.parse(pagingState);
      console.log(state.routePath)
      console.log(routePath)
      if(state.routePath === routePath) {
        this.state = state;
        return;
      }
    }

    const totalPostCnt = props.data.allMarkdownRemark.edges ? props.data.allMarkdownRemark.edges.length : 0;
    const totalPage = totalPostCnt > 0 ? Math.ceil(props.data.allMarkdownRemark.edges.length/5.0) : 1;

    this.state = {
      totalPostCnt,
      totalPage,
      currentPage: 1,
      perPage: 5,
      offset: 0,
      routePath,
    };
    sessionStorage.setItem("pagingState", JSON.stringify(this.state));

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    sessionStorage.setItem("pagingState", JSON.stringify(this.state));
  }

  render() {
    const items = [];
    const { title, subtitle } = this.props.data.site.siteMetadata;
    const { allMarkdownRemark } = this.props.data;
    const posts = allMarkdownRemark ? allMarkdownRemark.edges : null;

    const totalPostCnt = this.state.totalPostCnt;
    const startIndx = this.state.offset;
    const endIdx = startIndx + this.state.perPage;

    if(posts) {
      const displayPosts = posts.slice(startIndx, endIdx > totalPostCnt ? totalPostCnt : endIdx);
      displayPosts.forEach(post => {
        items.push(<Post data={post} key={post.node.fields.slug} />)
      })
    }

    return (
      <Layout>
        <div id={"category-works"}>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={subtitle} />
          </Helmet>
          <Sidebar {...this.props} />
          <div className="content">
            <div style={{marginTop: "15px", textAlign: "end"}}>
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
                  if(!currentPage) currentPage = 1;
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

export default WorksIndexRoute

export const pageQuery = graphql`
  query WorksIndexRoute {
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
      filter: { frontmatter: { layout: { eq: "post" }, category: { eq: "works" } } }
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
