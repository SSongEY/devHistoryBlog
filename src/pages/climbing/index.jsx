import React from 'react'
import { graphql } from 'gatsby'
import IndexTemplate from '../../templates/index-template'

class ClimbingIndexRoute extends React.Component {
  render() {
    return (
      <IndexTemplate {...this.props} />
    )
  }
}
export default ClimbingIndexRoute
export const pageQuery = graphql`
  query ClimbingIndexRoute {
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
      filter: { frontmatter: { layout: { eq: "post" }, category: { eq: "climbing" } } }
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
