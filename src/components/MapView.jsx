import React, {useState} from "react"
import { Map, Marker } from "pigeon-maps"

export default function MapView(props) {
  const [hue, setHue] = useState(0)
  const color = `hsl(${hue % 360}deg 39% 70%)`
  return (
    <Map height={450} width={600} defaultCenter={props.coordinates} defaultZoom={11}>
      {/*(props.data) ?
        props.data.map((x) => {
          <Marker 
            width={50}
            anchor={[x.geometry.coordinates[0], x.geometry.coordinates[1]]} 
            color={color} 
            onClick={() => setHue(hue + 20)} 
          />
        })
      : [] */}
    </Map>
  )
}