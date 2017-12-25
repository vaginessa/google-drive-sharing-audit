// Application
// Main functions directly acessible by client

// getTotals  NONE -> Dict[Integer]
// Get total count of folders and files
function getTotals () {
  // Count number of folders in user's Drive
  var folders = DriveApp.getFolders()
  var folder_total = 0
  while (folders.hasNext()) {
    folder_total++
    folders.next()
  }
  // Count number of files in user's Drive
  var files = DriveApp.getFiles()
  var file_total = 0
  while (files.hasNext()) {
    file_total++
    files.next()
  }
  // Return total count of folders/files
  return {
    folder_total: folder_total,
    file_total: file_total
  }
}

// setPause  String, String, Bool -> NONE
// Allows client to update pausing status for current operation
function setPause (pause_id, pauseStatus) {
  var props = PropertiesService.getUserProperties()
  props.setProperty(pause_id, pauseStatus.toString())
}

// clearPause  String, String -> NONE
// Clears pausing status for current operation
function clearPause (pause_id) {
  var props = PropertiesService.getUserProperties()
  props.deleteProperty(pause_id)
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
  // Determine type of item for Spreadsheet
  var mime_type = function (folder) {
    return 'folder'
  }
  // Create ID for pausing
  pause_id = spreadsheet_id + '__folder'
  // Call hidden function
  return processItems_(sheetFolders, DriveApp.getFolders(), mime_type, pause_id)
}

// processFiles  String -> Dict[Boolean, Integer]
// Adds information for files into each row of the Spreadsheet
function processFiles (spreadsheet_id) {
  // Open Spreadsheet
  var spreadsheet = SpreadsheetApp.openById(spreadsheet_id)
  var sheetFiles = spreadsheet.getSheetByName('Files')
  // Determine the type of item for Spreadsheet
  var mime_type = function (file) {
    return file.getMimeType()
  }
  // Create ID for pausing
  pause_id = spreadsheet_id + '__file'
  // Call hidden function
  return processItems_(sheetFiles, DriveApp.getFiles(), mime_type, pause_id)
}
