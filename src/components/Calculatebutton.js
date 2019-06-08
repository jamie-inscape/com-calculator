import React from "react";

class CalculateButton extends React.Component {

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

  
    handleClick() {
        this.props.callBack(this.props.quantitiesMap, this.props.boltSize, this.props.cutOption);
    }


    render() {
        return (
            <div>
                <button className="calculateButton" onClick={this.handleClick}>Calculate This Run</button>
            </div>
        );
    }

}

export default CalculateButton;