import React from "react";

class ClearButton extends React.Component {

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.callBack(this.props.quantitiesMap);
    }

    render() {
        return (
            <button onClick={this.handleClick}>Clear</button>
        );
    }

}

export default ClearButton;