import React from "react";

class Warning extends React.Component {
    render() {
        return (
            <div className="warning">
                <br/>
                <div>
                    Overage is based on 10% of subtotal for up to 100 yards, 5% up to 1000 yards
                    and 50 yards for subtotal greater than 1000 yards.
                </div>
                <br/>
                <div>
                    Note: COM fabric is to be calculated based on tiles that will ship
                    in the same week. IE: 3 floors of product ship in three different weeks
                    you will need to calculate the fabric yardage by floor (3 times).
                </div>
                <br/>
                <div>
                    Inscape System orders should be submitted separately to maintain accuracy
                    of this tool.
                </div>
            </div>
        );
    }

}

export default Warning;