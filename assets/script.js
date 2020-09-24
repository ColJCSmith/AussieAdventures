const airtableRead =
  "https://api.airtable.com/v0/appnjLNnNOAa7as5U/Table%201?api_key=keyJY1gNiblDln7CL";
function callAirtable() {
  $.ajax({
    url: airtableRead,
    method: "GET",
  }).done(function (response) {
    console.log(response);
  });
}

// MapBox Config
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWN0aXZlY29ybmVyIiwiYSI6ImNrNWE4bXJkbzB0Z2kzbHBvbm50ZXRycmkifQ.CLzXsbfMvur87jTtuBreKg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
});
