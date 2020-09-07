import React, { useState,useEffect } from 'react';
import {MenuItem,FormControl,Select,Card, CardContent} from "@material-ui/core";
  import InfoBox from "./InfoBox";
 import Map from './Map';
  import TableInfo from './TableInfo';
  import   {sortData, prettyPrintStat} from './util';
  import LineGraph from './LineGraph';
  import "leaflet/dist/leaflet.css";
import './App.css';
 
function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry] =useState('worldwide')
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({lat :34.80746, lng:  -40.4796 });
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState ([]);
  const [casesType,setCasesType] = useState("cases");
  //https://disease.sh/v3/covid-19/countries"
  //useeffect runs a piece of code based on a given condition
  useEffect(()=>{
    //the code here will run once when the component loads and not again
    //the piece of code here is async since it sends a request to a server
    const getCountriesData = async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) =>response.json())
      .then((data)=>{
        const countries = data.map((country)=>
        ({name:country.country, 
          value:country.countryInfo.iso2}));
          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries);
      });
      

    };
    getCountriesData();
  },[])

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data)
    })
  },[])

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    setCountry(countryCode)

    const url=countryCode === "worldwide" 
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then((response) => response.json())
    .then((data)=>{
      setCountry(countryCode);
      
      setCountryInfo(data);
      countryCode === "worldwide"? setMapCenter([34.80746, 40.4796])
      :setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);

    }) 
  }
  
  return (
    <div className="app" >
      <div className="app__left">
      <div className="app__header">
      <h1>Covid-19 tracker</h1>
     <FormControl className="app__dropdown">
       <Select
       variant="outlined"
       onChange={onCountryChange}
       value={country} >
         {/*loop through all the countries and show a dropdown of list of options*/}
  <MenuItem value={country}>{country}</MenuItem> 
        {countries.map((country)=>(
         <MenuItem value={country.value}>{country.name}</MenuItem> 
        ))}

       </Select>
     </FormControl>
      </div>
    <div className="app__stats">
      <InfoBox
      isRed
      active={casesType==="cases"}
      onClick={(e) => setCasesType("cases")}
       title="Covid-19 Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
      <InfoBox 
      active={casesType==="recovered"}
      onClick={(e) => setCasesType("recovered")}
      title="Recovered"cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
      <InfoBox 
      isRed
      active={casesType==="deaths"}
      onClick={(e) => setCasesType("deaths")}
      title="Deaths"cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} /> 
      

    </div>
    <div className="app__map">
      <Map
      casesType={casesType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}/>
    </div>

      </div>
   <Card className="app__right">
     <CardContent>
       <h3>Live Cases By country</h3>
       <TableInfo countries={tableData}/>
       <h3 className="app__graphtitle">Worldwide {casesType}</h3>
       <LineGraph className="app__graph" casesType={casesType} />
     </CardContent>
          {/*Table*/}
     {/*Graph*/}
     </Card>   
      
    
    
     
     
    

    </div>
  );
}

export default App;
