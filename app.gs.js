// Application
// Main functions directly acessible by client

// getTotals  NONE -> Dict[Integer]
// Get total count of folders and files
function getTotals () {
  // Count number of folders in user's Drive
  var folders = DriveApp.getFolders()
  var folder_total = 0
  while (folders.hasNext()) {
    folders.next()
    folder_total++
  }
  // Count number of files in user's Drive
  var files = DriveApp.getFiles()
  var file_total = 0
  while (files.hasNext()) {
    files.next()
    file_total++
  }
  // Return total count of folders/files
  return {
    folder_total: folder_total,
    file_total: file_total
  }
}

// createSpreadsheet  NONE -> Dict[String]
// Creates a new Spreadsheet template and returns information to access it
function createSpreadsheet () {
  // Create Spreadsheet
  var spreadsheetName = 'Google Drive Sharing Audit: ' + dateString_(new Date())
  var spreadsheet = SpreadsheetApp.create(spreadsheetName)
  // Add header row
  var header = ['ID', 'Type', 'URL', 'Name', 'Description', 'Starred',
    'Trashed', 'Sharable by Editors', 'Created', 'Modified', 'Size',
    'Sharing Access', 'Sharing Permission', 'Owner', 'Viewers', 'Editors']
  spreadsheet.appendRow(header)
  spreadsheet.setFrozenRows(1)
  // Duplicate sheet
  var sheetFolders = spreadsheet.getSheets()[0]
  var sheetFiles = spreadsheet.insertSheet(1, {template: sheetFolders})
  // Name sheets
  sheetFolders.setName('Folders')
  sheetFiles.setName('Files')
  // Return spreadsheet information
  return {
    id: spreadsheet.getId(),
    url: spreadsheet.getUrl()
  }
}

// processFolders  String -> Dict[Boolean, Integer]
// Adds information for folders into each row of the Spreadsheet
function processFolders (spreadsheet_id) {
  // Open Spreadsheet
  var spreadsheet = SpreadsheetApp.openById(spreadsheet_id)
  var sheetFolders = spreadsheet.getSheetByName('Folders')
  // Call hidden function
  return processItems_(sheetFolders, DriveApp.getFolders(), function (folder) {
    return 'folder'
  })
}

// processFiles  String -> Dict[Boolean, Integer]
// Adds information for files into each row of the Spreadsheet
function processFiles (spreadsheet_id) {
  // Open Spreadsheet
  var spreadsheet = SpreadsheetApp.openById(spreadsheet_id)
  var sheetFiles = spreadsheet.getSheetByName('Files')
  // Call hidden function
  return processItems_(sheetFiles, DriveApp.getFiles(), function (file) {
    return file.getMimeType()
  })
}
