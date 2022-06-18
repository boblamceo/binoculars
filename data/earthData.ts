import axios from "axios";

export const current = (city:string) => {
  const noErrors = city.replace(/  +/g, " ");
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${noErrors}&units=metric&appid=f0cb8f4406373b8daccb9354815c6b8f`,
  );
};

export const forecast = (city:string) => {
  const noErrors = city.replace(/  +/g, " ");
  return axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${noErrors}&units=metric&appid=f0cb8f4406373b8daccb9354815c6b8f`,
  );
};

export const urban = (city:string) => {
  const noErrors = city.replace(/  +/g, " ");
  const placesRequestUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${noErrors}&language=en&key=AIzaSyDsglUyv93_Gc5QfjX00r7drRMNLX6vFdQ&inputtype=textquery&fields=name,photos`;
  return axios.get(placesRequestUrl, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
};

export const findLocation = (city:string) => {
  return axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=f0cb8f4406373b8daccb9354815c6b8f`,
  );
};
