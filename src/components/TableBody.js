import React from "react"
import TableHeaderData from "./TableHeaderData"
import columnData from "./columnData"

class TableBody extends React.Component {

    constructor() {
        super();
        this.handleValueInput = this.handleValueInput.bind(this);
    }

    handleValueInput(event) {
        const {id, value} = event.target;
        let inputBox = document.getElementById(id);
        if (event.target.value != "") {
            inputBox.className += " filled";
            let columninfo;
            let rowinfo;
            for (let i =0; i < inputBox.attributes.length; i++) {
                if (inputBox.attributes[i].name == "columninfo") {
                    columninfo = inputBox.attributes[i].nodeValue;
                } else if (inputBox.attributes[i].name == "rowinfo") {
                    rowinfo = inputBox.attributes[i].nodeValue;
                }
                
            }
            this.props.handleChange(columninfo, rowinfo, value);
        } else {
            if (inputBox.className.includes("filled")) {
                inputBox.className = "quantity";
            }
        }
    }


    render() {
        let rows = [];
        for (let i = 0; i < columnData.length; i++) {
            let inputTags = [];
            let rowItem = columnData[i];
            for (let j=0; j < TableHeaderData.length; j++) {
                let colItem = TableHeaderData[j]; 
                if (colItem.value !== 0) 
                inputTags.push(
                    <td key={colItem.value}>
                        <input 
                            id={"i"+colItem.value+"@"+rowItem.value}
                            className="quantity" 
                            onChange={this.handleValueInput}  
                            key={colItem.value+"@"+rowItem.value} 
                            type="text" 
                            columninfo={colItem.value}
                            rowinfo={rowItem.value} 
                            placeholder="0"/>
                    </td>
                    );
            }
            rows.push(<tr key={rowItem.value}><td><strong>{rowItem.text}</strong></td>{inputTags}</tr>);
        }
        
        return (
            <tbody>
                {rows}
           </tbody>
        ); 
     }
}   


export default TableBody;