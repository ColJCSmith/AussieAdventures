const airtableRead =
  "https://api.airtable.com/v0/appnjLNnNOAa7as5U/Table%201?api_key=keyJY1gNiblDln7CL";
function callAirtable() {
  $.ajax({
    url: airtableRead,
    method: "GET",
  }).done(function (response) {
    console.log(response);
    renderCards(response.records);
  });
}

// MapBox Config
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWN0aXZlY29ybmVyIiwiYSI6ImNrNWE4bXJkbzB0Z2kzbHBvbm50ZXRycmkifQ.CLzXsbfMvur87jTtuBreKg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
});

function renderCards(response) {
  // loop through our card array
  for (let i = 0; i < response.length; i++) {
    // add all the HTML handles
    const cardDiv = $("<div>");
    cardDiv.addClass("card");
    const cardImg = $("<img>");
    const location = $("<location>");
    const rating = $("<div>");
    rating.addClass("stars");
    const description = $("<p>");
    description.addClass("description");
    const learnMore = $("<button>");

    // connect the HTML to the API data
    $(cardImg).attr("src", response[i].fields.Image[0].url);
    $(location).text(response[i].fields.Destination);
    //renderStars(parseInt(response[i].fields["Star Rating"][0]));
    $(description).text(response[i].fields.Notes);
    $(learnMore).text("Learn More");

    // Append data to the card
    $(cardDiv).append(cardImg, location, /*rating,*/ description, learnMore);

    // Append the card to the container
    $("#container").append(cardDiv);
  }

  // create <div> and subsequent elements
  // connect the API data to the html elements
  // append the new elements to the DOM container
}

// renderStars(numStars) {}

// event listener to handle filter button

// event listener for learn more to show() / hide() the extra content
