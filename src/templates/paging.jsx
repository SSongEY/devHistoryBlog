import Pagination from 'materialui-pagination-component'
import React from 'react'

class CustomPagination extends React.Component {
  render() {
    return (
      <div style={{ marginTop: '15px', textAlign: 'end' }}>
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
          page={this.props.currentPage} // The current page.
          totalPages={this.props.totalPage} // The total number of pages.
          elevation={0} // Passed down to Material-UI Paper component.
          onChange={currentPage => {
            if (!currentPage) currentPage = 1
            this.setState({ currentPage, offset: (currentPage - 1) * 5 })
          }
          } // Callback when the page changes.
        />
      </div>
    )
  }
}

export default CustomPagination
