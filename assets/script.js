let airtableResponse;
const airtableRead =
  "https://api.airtable.com/v0/appnjLNnNOAa7as5U/holidayData?api_key=keyJY1gNiblDln7CL";

// MapBox Config
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWN0aXZlY29ybmVyIiwiYSI6ImNrNWE4bXJkbzB0Z2kzbHBvbm50ZXRycmkifQ.CLzXsbfMvur87jTtuBreKg";
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [146.153856, -32.621438],
  zoom: 13,
});

function callAirtable() {
  loading("on");
  $.ajax({
    url: airtableRead,
    method: "GET",
  }).done(function (response) {
    loading("off");
    airtableResponse = response.records;
    console.log(airtableResponse);
    renderCards();
  });
}

function getMap(cardNumber) {
  let coords = airtableResponse[cardNumber].fields[
    "Location Coordinates"
  ].split("°");
  let lat = parseFloat(coords[0]);
  let long = parseFloat(coords[1].split(" ")[2]);
  map.flyTo({
    center: [long, lat],
  });
}

function renderCards() {
  // loop through our card array
  for (let i = 0; i < airtableResponse.length; i++) {
    // create <div> and subsequent elements + classes
    const cardDiv = $("<div>");
    cardDiv.addClass("card");
    const cardImg = $("<img>");
    cardImg.addClass("cardImg");
    const location = $("<location>");
    const rating = $("<div>");
    rating.addClass("stars");
    rating.attr("data-index", i);
    const description = $("<p>");
    description.addClass("description");
    const learnMore = $("<button>");
    learnMore.addClass("button");
    learnMore.attr("data-index", i);
    const liked = $("<img>");
    liked.addClass("liked");
    liked.attr("data-index", i);

    // connect the HTML to the API data
    $(cardImg).attr("src", airtableResponse[i].fields.Image[0].url);
    $(location).text(airtableResponse[i].fields.Destination);
    $(rating).html(
      renderStars(parseInt(airtableResponse[i].fields["Star Rating"][0]))
    );
    $(description).text(
      airtableResponse[i].fields.Notes.substring(0, 110).trim() + "..."
    );

    $(learnMore).text("Learn More");

    // Check if the card has been liked already
    airtableResponse[i].fields.Liked
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
    $(starImg).attr("data-rating", i);
    $(starImg).addClass("star");
    $(result).append(starImg);
  }
  // return the html of the star rating
  return result;
}

function showFullCard(cardNumber) {
  $("#cardWrapper").hide();

  // connect the HTML to the API data
  $("#fullCard .cardImg").attr(
    "src",
    airtableResponse[cardNumber].fields.Image[0].url
  );
  $("#fullCard location").text(airtableResponse[cardNumber].fields.Destination);
  $("#fullCard .stars").html(
    renderStars(parseInt(airtableResponse[cardNumber].fields["Star Rating"][0]))
  );
  $("#fullCard .description").text(airtableResponse[cardNumber].fields.Notes);

  // Call Mapbox API
  getMap(cardNumber);

  $("#fullCard").show();
  window.scrollTo(0, 0);
}

// Update liked status to AirTable and render new icon
function likeToggle(target, index) {
  let patchData;
  if (airtableResponse[index].fields.Liked) {
    patchData = {
      fields: {
        Liked: false,
      },
    };
  } else {
    patchData = {
      fields: {
        Liked: true,
      },
    };
  }

  $.ajax({
    headers: {
      Authorization: "Bearer keyJY1gNiblDln7CL",
      "Content-Type": "application/json",
    },
    url: `https://api.airtable.com/v0/appnjLNnNOAa7as5U/holidayData/${airtableResponse[index].id}`,
    type: "PATCH",
    data: JSON.stringify(patchData),
  }).done(function () {
    console.log($(target).attr("src"));
    airtableResponse[index].fields.Liked
      ? $(target).attr("src", "assets/images/heart-icon-filled.svg")
      : $(target).attr("src", "assets/images/heart-icon.svg");
  });
}

// Change star review for a given card. Update data to Airtable
function updateReview(target, rating, index) {
  let patchData = {
    fields: {
      "Star Rating": [rating],
    },
  };

  $.ajax({
    headers: {
      Authorization: "Bearer keyJY1gNiblDln7CL",
      "Content-Type": "application/json",
    },
    url: `https://api.airtable.com/v0/appnjLNnNOAa7as5U/holidayData/${airtableResponse[index].id}`,
    type: "PATCH",
    data: JSON.stringify(patchData),
  }).done(function () {
    $(target).parent().parent().html(renderStars(rating));
  });
}

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

/*#### EVENT LISTENERS ####*/

// event listener to handle filter button
$("#filterBtn").click(function () {
  $("#filterForm").toggle();
});

// event listener to display the full card
$("#cardContainer").click(function (e) {
  if (e.target.nodeName === "BUTTON") {
    showFullCard($(e.target).attr("data-index"));
  } else if ($(e.target).attr("class") === "liked") {
    likeToggle(e.target, $(e.target).attr("data-index"));
  } else if ($(e.target).attr("class") === "star") {
    updateReview(
      e.target,
      $(e.target).attr("data-rating"),
      $(e.target).parent().parent().attr("data-index")
    );
  }
});

// event listener to go back from full card
$("#fullCard .backButton").click(function () {
  $("#fullCard").hide();
  $("#cardWrapper").show();
});

// Initial Airtable call
$(document).ready(callAirtable());
