// Webserver
// Functions to handle serving resources to client

// doGet  NONE -> Google@HTML
// Returns "index.html" page for all requests
function doGet () {
  return HtmlService.createTemplateFromFile('index.html').evaluate()
}

// include  String -> Google@HTML
// Function used for including other HTML files in templates
function include (filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}
