// This function encodes real-time transit-view data to GEOJSON format

import capitalizeFirstLetter from "./capitalizeFirstLetter";

export default function makeBusFeatureCollection(busArray) {
  const buses = {
    type: "FeatureCollection",
    features: [],
  };
  busArray.forEach((bus) => {
    const direction = capitalizeFirstLetter(bus.Direction);
    const busFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [Number(bus.lng), Number(bus.lat)],
      },
      properties: {
        route: bus.route_id,
        timestamp: bus.timestamp,
        direction: direction,
        trip: bus.trip,
        vehicle: bus.VehicleID,
        nextStopId: bus.next_stop_id,
        nextStopName: bus.next_stop_name,
      },
    };
    buses.features.push(busFeature);
  });
  return buses;
}
