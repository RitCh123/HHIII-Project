import * as React from 'react';

import {useRef} from 'react'

import { useEffect, useState } from 'react';


import MapView from './components/MapView.jsx'

import { Map, Marker } from "pigeon-maps"


import Info from './components/Info.jsx'




import './App.css';

import { ChakraProvider, Input, Heading, Text, Stack, InputGroup, InputLeftElement, LinkBox, Box, LinkOverlay, Center, Button } from '@chakra-ui/react';

import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';

import { Select } from '@chakra-ui/react'







import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';


import { Flex, Spacer } from '@chakra-ui/react'


function Card ({ description, title, color, buttonText }) {
  return (
    <LinkBox as='article' maxW='lg' p='5' borderWidth='1px' rounded='md'>
      <Stack spacing={8} direction="column">
        <Heading size='md' my='2'>
          <LinkOverlay href='#'>
            {title}
          </LinkOverlay>
        </Heading>
        <Text>
          {description}
        </Text>
        <Button colorScheme={color}>{buttonText}</Button>
      </Stack>
    </LinkBox>
  )
  
}

function Dropdown({ labelText, options, placeholder, onChange }) {
  return (
    <FormControl>

      <FormLabel>{labelText}</FormLabel>
      
      <Select placeholder={placeholder} size='lg' onChange={onChange}>
        {
          (!options) ? options: options.map((x) => {
            return(<option value={x} key={x}>{x}</option>)
          })
        }
      </Select>
    </FormControl>
  )
}







function App() {

  const [states, setStates] = useState([])

  const [selected, setSelected] = useState([])

  const [data, setData] = useState([])

  const [location, setLocation] = useState("")

  const [city, setCity] = useState("")

  const [state, setState] = useState("")

  const [coordinates, setCoordinates] = useState("")

  const [range, setRange] = useState(40225)

  const [results, setResults] = useState("")

  
  useEffect(() => {

  fetch("https://gist.githubusercontent.com/ahmu83/38865147cf3727d221941a2ef8c22a77/raw/c647f74643c0b3f8407c28ddbb599e9f594365ca/US_States_and_Cities.json")
    .then((response) => response.json())
    .then((data) => {
      setStates(Object.keys(data));
      setData(data)
      })
    
  }, []);

  async function fetchCurrentLocation() {
    await fetch('https://api.geoapify.com/v1/ipinfo?apiKey=c2ab3b7832a045cfb9571724e565339b')
    .then(response => response.json())
    .then(response => {
      setLocation(response)

      setCoordinates([response.location.latitude, response.location.longitude]);

      
      return [response.location.latitude, response.location.longitude]
    });
  
  }

  async function fetchCoordinates() {
    setLocation({
      city: {
        name: city,
      },
      state: {
        name: state,
      },
    });
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${city.concat(
        ", ",
        state
      )}&format=json&apiKey=c2ab3b7832a045cfb9571724e565339b`
    );
    const data = await res.json();
    const filtredData = data.results.filter((x) => x.result_type === "city");
    setCoordinates(
      !filtredData[0].lat && !filtredData[0].long ? "" : [filtredData[0].lat, filtredData[0].lon]
    );
    return [filtredData[0].lat, filtredData[0].lon];
  }

  async function FinalSearch() {
    try {
      var cordinates = await fetchCoordinates();
      var places = await getPlaces(...cordinates);
      setResults(places)
      console.log(places)
      
    } catch (error) {
      console.log(error);
      return [null, null, null];
    }
  }

  async function FinalSearchLocation() {
    try {
      var coordinates = await fetchCurrentLocation()
      var places = await getPlaces(...coordinates)
      setResults(places)
      console.log(results)
      
    } catch(error) {
      console.log(error)
      return [null, null, null]
    }
  }

  async function getPlaces(lat, long) {
  const res = await fetch(
    `https://api.geoapify.com/v2/places?categories=office.charity,office.association,office.non_profit&filter=circle:${long},${lat},5000&bias=proximity:${long},${lat}&limit=20&apiKey=c2ab3b7832a045cfb9571724e565339b`
  );
  const data = res.json();
  
    
    return data
    
}
  

  
  
  
  return (
    <div style={{padding: "1em"}}>
      <ChakraProvider>
        <Stack spacing={3}>
          <div className="title" style={{alignItems: "center", justifyContent: "center", width: "100%"}}>
            <Stack spacing={8} direction='row'>
  
              <Card title="Check With Your School!" description="Before using this site, check with what volunteering opportunities your school or area has. Some schools/areas have partnerships with nonprofit organizations. The results displayed with this tool are do not have any affiliation with these tools and is merely used to find locations near you." color="blue" buttonText="Learn More" />
  
              <Card title="Understanding Restrictions" description="Local opportunities have have restrictions on how many people can volunteer, the size of volunteering groups, and age restrictions. Be mindful in checking with these restrictions before signing up or visiting external links to reserve your opportunities." color="orange" buttonText="Learn More" />
              
            </Stack>
            
            
          </div>
          <div className="tool">
              <Stack direction="column" spacing={8}>
                <Text fontSize='5xl'>Volunteer Search</Text>
    
  
                  <div className="form-control-state" style={{width: "50%"}}>
                    
                    <Dropdown labelText="Select a state:" placeholder="Select a state" options={states} onChange={(x) => {
        setSelected(x.target.value);
        setState(x.target.value);
      }} />
                    
  
                    
                  </div>
  
                  <Stack spacing={3} direction="row">
  
                    <div className="form-control-city" style={{width: "25%"}}>
    
                      <Dropdown labelText="Select a city:" placeholder="Select a city" options={!(states && selected) ? "": data[selected]} onChange={x => setCity(x.target.value)}/>
                      
                    </div>
                    <div className="form-control-city" style={{width: "25%"}}>
    
                      <Dropdown labelText="Select a range:" placeholder="Select a range" options={[5,10,15,20,25].map(x => x.toString().concat(" ", "miles"))} onChange={x => setRange(x.target.value)}/>
                      
                    </div>
                    
                </Stack>
                <Stack direction="row" spacing={10}>
                  <div className="form-control-submit">
                        <Button colorScheme='teal' size='lg' onClick={async () => await FinalSearch()}>Search</Button>
                  </div>
                </Stack>

                <div className="results">
                  <Flex>
                    <Stack spacing = {8} direction="column" flex='3'>
                      <Text fontSize='2xl'>{(!location) ? "Please enter a query!" : `Using ${location.city.name}, ${location.state.name} as location`}</Text>
                      <div style={{height: '450px', overflowY: 'scroll'}}>
                        <Stack spacing={5} direction="column">
                          {
                            (results.features) ? results.features.map((e) => {
                            return (<Info title={e.properties.name} description={`Located in ${e.properties.suburb} in ${e.properties.county}, ${e.properties.name} is a nonprofit that matches your filters. This place is located only ${e.properties.distance} meters from your location!`} address={e.properties.formatted} />)
                          }): ""
                          }
                        </Stack>
                      </div>
                      
                    </Stack>
                    
                    <Spacer />
                    {(coordinates[0]) ? <MapView coordinates={[coordinates[0], coordinates[1]]} data={results} /> : ""}
                  </Flex>
                </div>
                
                
              </Stack>
            </div>
          </Stack>
      </ChakraProvider>
    </div>
  );
}

export default App;