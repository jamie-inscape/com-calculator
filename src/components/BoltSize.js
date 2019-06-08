import React from "react";

class BoltSize extends React.Component {


    constructor(){
        super();
        this.state = {
            boltSize: 54
        }
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(event) {
        const updatedBoltSize = event.target.value;
        this.setState(
            {
                boltSize: updatedBoltSize
            }
        )
        this.props.handleChange(updatedBoltSize);
    }

    render() {
        return (
            <div className="boltSizeDiv">
                <div><strong>Bolt Size</strong></div>
                <div>
                    <input onChange={this.handleClick} type="radio" name="boltSize" id="fiftyFourBolt" value={54} checked={this.state.boltSize == 54 ? true : false}/>
                    <label htmlFor="fiftyFourBolt">54"</label>
                </div>
                <div>
                    <input onChange={this.handleClick} type="radio" name="boltSize" id="sixtySixBolt" value={66} checked={this.state.boltSize == 66 ? true : false}/>
                    <label htmlFor="sixtySixBolt">66"</label>
                </div>
            </div>
        );
    }
}

export default BoltSize;