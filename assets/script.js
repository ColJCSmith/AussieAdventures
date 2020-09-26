const airtableRead =
  "https://api.airtable.com/v0/appnjLNnNOAa7as5U/Table%201?api_key=keyJY1gNiblDln7CL";
function callAirtable() {
  loading("on");
  $.ajax({
    url: airtableRead,
    method: "GET",
  }).done(function (response) {
    console.log(response);
    loading("off");
    renderCards(response.records);
  });
}

// MapBox Config
// mapboxgl.accessToken =
//   "pk.eyJ1IjoiYWN0aXZlY29ybmVyIiwiYSI6ImNrNWE4bXJkbzB0Z2kzbHBvbm50ZXRycmkifQ.CLzXsbfMvur87jTtuBreKg";
// var map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v11",
// });

function renderCards(response) {
  // loop through our card array
  for (let i = 0; i < response.length; i++) {
    // create <div> and subsequent elements + classes
    const cardDiv = $("<div>");
    cardDiv.addClass("card");
    const cardImg = $("<img>");
    cardImg.addClass("cardImg");
    const location = $("<location>");
    const rating = $("<div>");
    rating.addClass("stars");
    const description = $("<p>");
    description.addClass("description");
    const learnMore = $("<button>");
    learnMore.addClass("button");
    const liked = $("<img>");
    liked.addClass("liked");

    // connect the HTML to the API data
    $(cardImg).attr("src", response[i].fields.Image[0].url);
    $(location).text(response[i].fields.Destination);
    $(rating).html(renderStars(parseInt(response[i].fields["Star Rating"][0])));
    $(description).text(
      response[i].fields.Notes.substring(0, 110).trim() + "..."
    );
    $(learnMore).text("Learn More");

    // Check if the card has been liked already
    response[i].fields.Liked
      ? $(liked).attr("src", "assets/images/heart-icon-filled.svg")
      : $(liked).attr("src", "assets/images/heart-icon.svg");

    // Append data to the card
    $(cardDiv).append(cardImg, location, rating, description, liked, learnMore);

    // Append the card to the container
    $("#cardContainer").append(cardDiv);
  }
}

function renderStars(numStars) {
  const result = $("<div>");
  for (let i = 1; i <= 5; i++) {
    const starImg = $("<img>");
    if (i > numStars) {
      // empty star
      $(starImg).attr("src", "assets/images/star-empty.svg");
    } else {
      // full star
      $(starImg).attr("src", "assets/images/star-full.svg");
    }
    $(result).append(starImg);
  }
  // return the html of the star rating
  return result;
}

// event listener to handle filter button
$("#filterBtn").click(function () {
  $("#filterForm").toggle();
});

// event listener for learn more to show() / hide() the extra content

// loading spinner function
function loading(status) {
  if (status === "on") {
    $("#cardWrapper").hide();
    $("#loading").show();
  } else {
    $("#cardWrapper").show();
    $("#loading").hide();
  }
}
// Initial Airtable call
$(document).ready(callAirtable());
