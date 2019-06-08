import React from 'react';
import logo from './logo.svg';
import './App.css';

import Title from "./components/Title";
import BoltSize from "./components/BoltSize";
import CalculateButton from "./components/Calculatebutton";
import ClearButton from "./components/ClearButton";
import CutOptions from "./components/CutOptions";
//import InscapeLogo from "./components/InscapeLogo";
import Output from "./components/Output";
import Table from "./components/Table";
import Warning from "./components/Warning";
import TableHeaderData from "./components/TableHeaderData";
import columnData from "./components/columnData";
import forbiddenInputs from "./components/ForbiddenInputs";

class App extends React.Component {

    /**
     * constructor
     */
    constructor() {
        super();
        let tileQuantitiesMap = new Map();
        for (let i=0; i < columnData.length; i++) {
            for (let j=0; j<TableHeaderData.length; j++){
                if (TableHeaderData[j].value !== 0) {
                    const key = TableHeaderData[j].value + "@" + columnData[i].value;
                    tileQuantitiesMap.set(key, 0);
                 }
             }
        }
        this.recordChange = this.recordChange.bind(this);
        this.updateCutOption = this.updateCutOption.bind(this);
        this.updateBoltSize = this.updateBoltSize.bind(this);
        this.calculateYards = this.calculateYards.bind(this);
        this.clearTable = this.clearTable.bind(this);
        this.setForbiddenInputs = this.setForbiddenInputs.bind(this);

        this.state = {
            tileQuantities : tileQuantitiesMap,
            boltSize : 54,
            cutOption : "railroad",
            runyards : 0, 
            overageYards : 0,
            totalYards : 0 
        }
        
    }

    
    componentDidMount() {
        const cutOption = this.state.cutOption;
        const boltSize = this.state.boltSize;
        this.setForbiddenInputs(boltSize, cutOption);
    }

    recordChange(columninfo, rowinfo, value) {
        this.setState(prevState => {
            let updatedTileQuantities = new Map(prevState.tileQuantities);
            updatedTileQuantities.set(columninfo+"@"+rowinfo, parseInt(value));
            return {
                tileQuantities : updatedTileQuantities
            }
        });

    }

    updateCutOption(updatedCutOption) {
        this.setState(
            {
                cutOption : updatedCutOption
            }
        );
        const boltSize = this.state.boltSize;
        this.setForbiddenInputs(boltSize, updatedCutOption);
    }

    updateBoltSize(updatedBoltSize) {
        this.setState(
            {
                boltSize : updatedBoltSize
            }
        )
        const cutOption = this.state.cutOption;
        this.setForbiddenInputs(updatedBoltSize, cutOption);
    }

    setForbiddenInputs(boltSize, cutOption) {
        let allInputBoxes = document.querySelectorAll(".quantity");
        let currentForbiddenInputs = forbiddenInputs[cutOption][boltSize];
            for (let i=0; i < allInputBoxes.length; i++) {
                const columninfo = allInputBoxes[i].getAttribute("columninfo");
                const rowinfo = allInputBoxes[i].getAttribute("rowinfo");
                allInputBoxes[i].disabled = false;
                for (let j=0; j < currentForbiddenInputs.length; j++) {
                    
                    if (parseFloat(columninfo) == currentForbiddenInputs[j][0]) {
                        if (parseFloat(rowinfo) == currentForbiddenInputs[j][1]) {
                            allInputBoxes[i].value = "";
                            allInputBoxes[i].disabled = true;
                        }
                    }
                }
        }
    }

    calculateYards(quantitiesMap, boltSize, cutOption) {
        let tiles = [];
        quantitiesMap.forEach((value, key, map) => {
            if (value > 0) {
                for (let i = 0; i < value; i++) {
                    tiles.push(new Tile(key));
                }
            }
        });

        let inchYardage;
        if (cutOption == "railroad") {
            inchYardage = new RailRoadYardageMeter(tiles, boltSize).getYardage();
        } else {
            //inchYardage = new OffBoltYardageMeter(tiles, boltSize).getYardage();
        }
        
        const yardageConversionFactor = 0.027778;
        const subTotalYardage = Math.ceil(inchYardage * yardageConversionFactor);
        let overageYardage = 0;
        if (subTotalYardage <= 100) {
            overageYardage = Math.ceil(0.1 * subTotalYardage);
        } else if (subTotalYardage <= 1000) {
            overageYardage = Math.ceil(0.05 * subTotalYardage);
        } else {
            overageYardage = 50;
        }
        this.setState(
            {
                runyards: subTotalYardage,
                overageYards: overageYardage,
                totalYards: subTotalYardage + overageYardage
            }
        );

    }

    clearTable(quantitiesMap) {
        this.setState(prevState => {
            let updatedQuantitiesMap = new Map(prevState.quantitiesMap);
            updatedQuantitiesMap.forEach((value, key, map) => {
                updatedQuantitiesMap.set(key, 0);
            });
            return {
                tileQuantities : updatedQuantitiesMap,
                runyards : 0, 
                overageYards : 0,
                totalYards : 0 
            }
        });
        let inputBoxes = document.querySelectorAll(".quantity");
        inputBoxes.forEach(item => {
            item.value = "";
            item.className = "quantity";
        })

    }


    render() {
        return (
        <div className="App">
            <Title /> 
            <Table handleChange={this.recordChange}/>
            <Output runyards={this.state.runyards} overageYards={this.state.overageYards} totalYards={this.state.totalYards} />
            <CutOptions handleChange={this.updateCutOption}/>
            <BoltSize handleChange={this.updateBoltSize} />
            
            <CalculateButton callBack={this.calculateYards} 
                            quantitiesMap={this.state.tileQuantities}
                            boltSize={this.state.boltSize}
                            cutOption={this.state.cutOption}/>
            <ClearButton callBack={this.clearTable} quantitiesMap={this.state.tileQuantities}/>
            
            <Warning /> 
        </div>
        );
    }
}

class Tile {
    constructor(tileKey) {
        let dimensions = tileKey.split("@");
        this.label = tileKey;
        let dimension1 = parseFloat(dimensions[0]);
        let dimension2 = parseFloat(dimensions[1]);
        if (dimension1 > dimension2) {
            this.width = dimension1 + 2.55;
            this.height = dimension2 + 3.00;
        } else {
            this.width = dimension2 + 2.55;
            this.height = dimension1 + 3.00;
        }
        
    }
}


class Sheet {
    constructor(width) {
        this.maxWidth = width;
        this.tiles = [];
        this.elevationPoints = [];
        this.usedWidth = 0;
        this.directionFactor = 1;
        this.lastElevationPoint = null;
        this.currentInputHeight = 0;
    }

    addTile(tile) {
        this.tiles.push(tile);
    }
}


/**
 * An Elevation Point used in determing maximum
 */
class ElevationPoint {

    /**
     * Constructor.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}


/**
 * Cavity Monster whos mission is to fill cavities with tiles.
 */
class CavityMonster {

    /**
     * Constructor.
     */
    constructor(width, height, tiles) {
        this.width = width;
        this.height = height;
        this.tiles = tiles;
        this.alive = true;
    }

    /**
     * look for tile which most fills cavity space with width; this.width, and height; this.height.
     * If no tile is found then the cavity monster dies.
     */
    searchForTile() {
        let foundTile;
        let tempTiles = Array.from(this.tiles);
        for (let i = tempTiles.length - 1; i > 0; i--) {
            if (tempTiles[i].width > this.height) {
                break;
            } else {
                if (tempTiles[i].height > this.width) {
                    break;
                }
            }
            foundTile = tempTiles[i];
        }
        if (foundTile) {
            this.eat(foundTile);
        }
    }

    /**
     * remove tile from existing array.
     */
    eat(tile) {
        this.tiles = this.tiles.splice(this.tiles.indexOf(tile), 1);
        this.split(this.width - tile.width, this.height);
    }

    /**
     * split to create another cavity monster with width this.width - tile.width and height this.height. 
     */
    split(width, height) {
        let cavityMonsterJr = new CavityMonster(width, height, this.tiles);
        cavityMonsterJr.searchForTile();
    }
}



/**
 * In RailRoad 
 * tile width increases sheet height;
 * and tile height increases sheet width;
 */
class RailRoadYardageMeter {

    /**
     * Constructor.
     */
    constructor(tiles, boltsize) {
        this.tiles = tiles;
        this.boltSize = boltsize;
        this.sheet = new Sheet(this.boltSize);
    }

    /**
     * Return required yardage for tiles and layout specifications.
     */
    getYardage() {
        let usedHeight = 0;
        this.tiles.sort(function(a, b) {
            if (a.width < b.width) return 1;
            else if (a.width > b.width) return -1;
            else if (a.height < b.height) return 1;
            else if (a.height > b.height) return -1
            return 0;
        });
        this.allocateTiles(this.tiles);
        return this.getHighestElevation();
    }


    /**
     * Return highest elevatoin among elevations.
     */
    getHighestElevation() {
        let elevationPoints = Array.from(this.sheet.elevationPoints);
        elevationPoints.sort(function(a, b) {
            if (a.y < b.y) return -1;
            else if (a.y > b.y) return 1;
            else return 0; 
        });
        return elevationPoints[elevationPoints.length-1].y;
    }

    /**
     * Find Elevation Point used in determining tile position when inserted tile exceeds maximum width of sheet.
     */
    findElevationPoint(tileWidth, currentInputHeight) {
        let tempElevationPoints = Array.from(this.sheet.elevationPoints);
        tempElevationPoints.sort(function(a, b) {
            if (a.y > b.y) return -1;
            else if (a.y < b.y) return 1;
            else {
                if (this.sheet.direction > 0) {
                    if (a.x < b.x) return -1;
                    else if (a.x > b.x) return 1;
                } else {
                    if (a.x < b.x) return 1;
                    else if (a.x > b.x) return -1;
                }
            }
            return 0;
        });
        if (this.sheet.directionFactor > 0) {
            let lastSeenElevationPoint = null;
            for (let i = 0; i < tempElevationPoints; i++) {
                if (tempElevationPoints[i].y > currentInputHeight) {
                    if (lastSeenElevationPoint == null) lastSeenElevationPoint = tempElevationPoints[i];
                    if (tempElevationPoints[i].x > tileWidth) {
                        return lastSeenElevationPoint;
                    }
                    lastSeenElevationPoint = tempElevationPoints[i];
                }
            }
        } else {
            let lastSeenElevationPoint = null;
            for (let i = 0; i < tempElevationPoints; i++) {
                if (tempElevationPoints[i].y > currentInputHeight) {
                    if (lastSeenElevationPoint == null) lastSeenElevationPoint = tempElevationPoints[i];
                    if (tempElevationPoints[i].x < tileWidth) {
                        return lastSeenElevationPoint;
                    }
                    lastSeenElevationPoint = tempElevationPoints[i];
                }
            }
        }
        return null;
    }

    /**
     * allocate tiles on sheet.
     */
    allocateTiles(tiles) {
        let sheet = this.sheet;
        let tempTiles = Array.from(tiles);
        for (let i = 0; i < tiles.length; i++) {
            let tile = tempTiles[0];
            if (tempTiles.length == 0) return;
            if (sheet.lastElevationPoint == null) {
                sheet.addTile(tile);
                let beginningElevationPoint = new ElevationPoint(sheet.usedWidth, sheet.currentInputHeight + tile.width);
                let endElevationPoint = new ElevationPoint(sheet.usedWidth + tile.height, sheet.currentInputHeight + tile.width);
                sheet.elevationPoints.push(beginningElevationPoint);
                sheet.elevationPoints.push(endElevationPoint);
                sheet.usedWidth = sheet.usedWidth + tile.height;
                sheet.lastElevationPoint = endElevationPoint;
                tempTiles.splice(0, 1);
            } else if (sheet.usedWidth + tile.height > sheet.maxWidth) {
                sheet.directionFactor = -sheet.directionFactor;
                let cavityMonster = null;
                if (sheet.directionFactor > 0) {
                    cavityMonster = new CavityMonster(sheet.maxWidth - sheet.lastElevationPoint.x, 
                                                    sheet.lastElevationPoint.y - sheet.currentInputHeight, tempTiles);
                } else {
                    cavityMonster = new CavityMonster(sheet.maxWidth - sheet.lastElevationPoint.x, 
                                                    sheet.lastElevationPoint.y - sheet.currentInputHeight, tempTiles);
                }
                cavityMonster.searchForTile();
                sheet.currentInputHeight = sheet.lastElevationPoint.y;
                sheet.addTile(tile);
                let beginningElevationPoint; 
                let endElevationPoint;
                let foundElevationPoint;
                if (sheet.directionFactor < 0) {
                    foundElevationPoint = this.findElevationPoint(tile.height, sheet.currentInputHeight);
                    beginningElevationPoint= new ElevationPoint(sheet.maxWidth - tile.height, foundElevationPoint.y + tile.width);
                    endElevationPoint = new ElevationPoint(sheet.maxWidth, foundElevationPoint.y + tile.width);
                } else {
                    foundElevationPoint = this.findElevationPoint(tile.height, sheet.currentInputHeight);
                    beginningElevationPoint= new ElevationPoint(0, foundElevationPoint.y + tile.width);
                    endElevationPoint = new ElevationPoint(tile.height, foundElevationPoint.y + tile.width);
                }

                sheet.lastElevationPoint = (sheet.directionFactor > 0 ? endElevationPoint: beginningElevationPoint);
                sheet.currentInputHeight = foundElevationPoint.y + tile.width;
                sheet.usedWidth = tile.height;
            } else if (true) {

            
                
            } else {
                sheet.addTile(tile);
                let beginningElevationPoint = null;
                let endElevationPoint = null;
                if (sheet.directionFactor > 0) {    
                    beginningElevationPoint = new ElevationPoint(sheet.usedWidth, sheet.currentInputHeight + tile.width);
                    endElevationPoint = new ElevationPoint(sheet.usedWidth + tile.height, sheet.currentInputHeight + tile.width);
                } else {
                    beginningElevationPoint = new ElevationPoint(sheet.maxWidth - sheet.usedWidth, sheet.currentInputHeight + tile.width);
                    endElevationPoint = new ElevationPoint(sheet.maxWidth - (sheet.usedWidth + tile.height), sheet.currentInputHeight + tile.width);
                }
                sheet.elevationPoints.push(beginningElevationPoint);
                sheet.elevationPoints.push(endElevationPoint);
                sheet.usedWidth = sheet.usedWidth + tile.height;
                sheet.lastElevationPoint = (sheet.directionFactor > 0 ? endElevationPoint: beginningElevationPoint);
                tempTiles.splice(0, 1);
            }
               
        }

        
    }

  
}





export default App;
