import React from 'react'
import { graphql } from 'gatsby'
import IndexTemplate from '../../templates/index-template'

class SpringIndexRoute extends React.Component {
  render() {
    return (
      <IndexTemplate {...this.props} />
    )
  }
}
export default SpringIndexRoute
export const pageQuery = graphql`
  query SpringIndexRoute {
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
      filter: { frontmatter: { layout: { eq: "post" }, category: { eq: "spring" } } }
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
            type
            category
            description
          }
        }
      }
    }
  }
`
