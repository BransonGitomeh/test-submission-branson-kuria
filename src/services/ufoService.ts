
import { Sighting } from "../types/ufo";

const API_URL = "https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings";

export const fetchUfoSightings = async (): Promise<Sighting[]> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching UFO sightings:", error);
    throw error;
  }
};
