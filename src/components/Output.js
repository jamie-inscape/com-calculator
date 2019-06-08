import React from "react";

class Output extends React.Component {
    render() {
        return (
            <div className="outputDiv">
                <div className="output">{ this.props.runyards} Running Yards</div>
                <div className="output">{ this.props.overageYards } Overage Yards</div>
                <div className="output">{ this.props.totalYards } Total Yards</div>
            </div>
        );
    }

}

export default Output;