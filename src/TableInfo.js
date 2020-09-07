import React from 'react';
import './Table.css';
import numeral from "numeral";

function TableInfo({countries}) {
    return (
        <div className="table">
            {countries.map(({country,cases})=>(
              <tr>
                  <td>{country}</td>
                  <td><strong>{numeral(cases).format("0,0")}</strong></td>
                  <td></td>
                  </tr>
                
                
            ))}
            
        </div>
    )
}

export default TableInfo
