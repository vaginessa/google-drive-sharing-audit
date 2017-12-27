// Webserver
// Functions to handle serving resources to client

// doGet  NONE -> Google@HtmlOutput
// Returns "index.html" page for all requests
function doGet () {
  return HtmlService.createTemplateFromFile('index.html').evaluate()
}

// include  String -> String
// Function used for including other HTML files in templates
function include (filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}
