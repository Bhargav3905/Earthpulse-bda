import { Earthquake } from "../models/earthquake.model.js";

const USGS_FEED =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

export async function syncEarthquakes() {
  const response = await fetch(USGS_FEED);
  if (!response.ok) {
    throw new Error(`USGS request failed: ${response.status}`);
  }

  const data = await response.json();

  const operations = data.features.map((feature) => {
    const properties = feature.properties;
    const [longitude, latitude, depth] = feature.geometry.coordinates;

    return {
      updateOne: {
        filter: { usgsId: feature.id },
        update: {
          $set: {
            usgsId: feature.id,
            magnitude: properties.mag,
            place: properties.place || "Unknown",
            time: new Date(properties.time),
            updatedAtSource: properties.updated
              ? new Date(properties.updated)
              : undefined,
            longitude,
            latitude,
            depth,
            tsunami: Boolean(properties.tsunami),
            eventUrl: properties.url,
          },
        },
        upsert: true,
      },
    };
  });

  if (operations.length) {
    await Earthquake.bulkWrite(operations, { ordered: false });
  }

  return {
    fetched: data.features.length,
    source: "USGS",
    lastSyncedAt: new Date(),
  };
}
