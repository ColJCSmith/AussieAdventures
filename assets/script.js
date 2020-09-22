console.log("it works");
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
