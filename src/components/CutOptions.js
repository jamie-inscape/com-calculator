import React from "react";

class CutOptions extends React.Component {

   constructor() {
       super();
       this.state = {
           cutOption : "railroad"
       }
       this.handleClick = this.handleClick.bind(this);
    } 


   handleClick(event) {
       const updatedCutOption = event.target.value;
       this.setState(
           {
               cutOption : updatedCutOption
           }
       )
       this.props.handleChange(updatedCutOption);
   }

   render() {
       return (
           <div className="cutPatternDiv">
                <div><strong>Cut Pattern</strong></div>
                <div>
                    <input type="radio" id="railroad" name="cut" value="railroad" checked={this.state.cutOption == "railroad"} onChange={this.handleClick}/>
                    <label htmlFor="railroad">Railroad</label>
                </div>
                <div>
                    <input type="radio" id="offBolt" name="cut" value="offBolt" checked={this.state.cutOption == "offBolt"} onChange={this.handleClick}/>
                    <label htmlFor="offBolt">Off the Bolt</label>
                </div>
           </div>
       );
    };

}

export default CutOptions;