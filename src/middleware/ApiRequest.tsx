//const API_KEY = process.env.REACT_APP_UNSPLASH_API_KEY; //apikey, setup for .env
const API_KEY = 'Leuv9hsZjxwo0UGA22z77yGBMdXZa_cGDmXBeIpgzuk'; //public API key
const url = "https://api.unsplash.com/search";

//API query 
async function pullFromSite(search, pages) {
  try {
    const res = await fetch(urlBuilder(search, pages));
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return '';
  }
}

//returns 10 random images for the landing page
export async function getDefaults() {
    try {
        const res = await fetch('https://api.unsplash.com/photos/random?count=10&client_id=Leuv9hsZjxwo0UGA22z77yGBMdXZa_cGDmXBeIpgzuk');
        const data = await res.json();
        return data;
    }
    catch(err) {
        console.log(err);
        return null;
    }
}

//returns the API requested data to the frontend
export default function getPhotos(search: string, pages: number) {
  const photoMap = pullFromSite(search, pages);
  return photoMap;
}

//format - https://api.unsplash.com/search?per_page=20&page=1&query="{searchTerm}"
//creates the URL for the API request
function urlBuilder(search: string, pageNum: number) {
  const new_url =
    url + "?per_page=20&page=" + pageNum + "&query=" + search + "&client_id=Leuv9hsZjxwo0UGA22z77yGBMdXZa_cGDmXBeIpgzuk";
  return new_url;
}

