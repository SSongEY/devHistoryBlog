import React from 'react'
import { graphql } from 'gatsby'
import IndexTemplate from '../../templates/index-template'

class KubernatesIndexRoute extends React.Component {
  render() {
    return (
      <IndexTemplate {...this.props} />
    )
  }
}

export default KubernatesIndexRoute
export const pageQuery = graphql`
  query KubernatesIndexRoute {
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
      filter: { frontmatter: { layout: { eq: "post" }, category: { eq: "k8s" } } }
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
