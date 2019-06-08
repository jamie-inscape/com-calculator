import React from "react";

class TableHeaderCell extends React.Component {

    render() {
        return (
            <th> { this.props.value } </th>
        );
    }

}

export default TableHeaderCell;