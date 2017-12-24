// Webserver
// Functions to handle serving resources to client

// doGet  NONE -> NONE
// Returns "index.html" page for all requests
function doGet () {
  return HtmlService.createHtmlOutputFromFile('index.html')
}
