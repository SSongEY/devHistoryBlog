import React from 'react'
import { graphql } from 'gatsby'
import IndexTemplate from '../../templates/index-template'

class ShellIndexRoute extends React.Component {
  render() {
    return (
      <IndexTemplate {...this.props} />
    )
  }
}
export default ShellIndexRoute
export const pageQuery = graphql`
  query ShellIndexRoute {
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
      filter: { frontmatter: { layout: { eq: "post" }, category: { eq: "shell" } } }
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
            type
            description
          }
        }
      }
    }
  }
`
