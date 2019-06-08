import React from "react";
import TableHeaderData from "./TableHeaderData";
import TableHeaderCell from "./TableHeaderCell";
import TableBody from "./TableBody";

class Table extends React.Component {

    render() {
        const tableHeadData = TableHeaderData.map(item => <TableHeaderCell key={item.id} value={item.text} />);
        return (
            <div>
                <h3>Inscape System COM Calculator</h3>
                <table>
                    <thead>
                        <tr>{tableHeadData}</tr>
                    </thead>
                    <TableBody handleChange={this.props.handleChange} />
                </table>
            </div>
        );
    }
}

export default Table;