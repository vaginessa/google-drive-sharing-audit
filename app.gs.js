// Application
// Main functions directly acessible by client

// setPause  String -> NONE
// Allows client to update pausing status for spreadsheet id and item type
function pauseThread (pause_id) {
  var props = PropertiesService.getUserProperties()
  props.setProperty(pause_id, true.toString())
}

// setupSpreadsheet  NONE -> Dict[Bool, String]
// Creates a new Spreadsheet template
function setupSpreadsheet () {
  // Prepare header row
  var header = ['ID', 'Type', 'URL', 'Name', 'Description', 'Starred',
    'Trashed', 'Sharable by Editors', 'Created', 'Modified', 'Size',
    'Sharing Access', 'Sharing Permission', 'Owner', 'Viewers', 'Editors']
  // Create Spreadsheet
  var spreadsheetName = spreadsheetNameStart + dateString_()
  var spreadsheet = SpreadsheetApp.create(spreadsheetName, 2, header.length)
  // Add header row
  spreadsheet.appendRow(header)
  spreadsheet.setFrozenRows(1)
  // Duplicate sheet
  var sheetFolder = spreadsheet.getSheets()[0]
  var sheetFile = spreadsheet.insertSheet(1, {template: sheetFolder})
  // Name sheets
  sheetFolder.setName(sheetNameFolder)
  sheetFile.setName(sheetNameFile)
  // Return spreadsheet information
  return {
    done: true,
    id: spreadsheet.getId(),
    url: spreadsheet.getUrl()
  }
}

// setupTotals  Dict[String] -> Dict[Bool, String, Integer]
// Get total count of folders and files
function setupTotals (params) {
  // Initialize termination conditions
  var startTime = (new Date()).getTime()
  var endTime = startTime + maxExecutionTime
  var paused = false
  // Initialize counter
  var delta = 0
  // Get correct iterator
  switch (params.item_type) {
    case 'folder':
      if (typeof (params.token) === 'string') {
        var item_iterator = DriveApp.continueFolderIterator(params.token)
      } else {
        var item_iterator = DriveApp.getFolders()
      }
      break
    case 'file':
      if (typeof (params.token) === 'string') {
        var item_iterator = DriveApp.continueFileIterator(params.token)
      } else {
        var item_iterator = DriveApp.getFiles()
      }
      break
  }
  // Iterate through items
  while (item_iterator.hasNext() && (new Date()).getTime() < endTime && !paused) {
    delta++
    item_iterator.next()
    if (delta % pauseCheckIterations === 0) {
      paused = paused || isPaused_(params.pause_id)
    }
  }
  // Clean-up pausing property
  clearPaused_(params.pause_id)
  // Return number of items and continuation
  var token = false
  if (item_iterator.hasNext()) {
    token = item_iterator.getContinuationToken()
  }
  return {
    done: !item_iterator.hasNext(),
    token: token,
    item_type: params.item_type,
    delta: delta
  }
}

// processItems  Dict[String] -> Dict[Bool, String, Integer]
// Add folder/file data to a Spreadsheet
function processItems (params) {
  // Initialize termination conditions
  var startTime = (new Date()).getTime()
  var endTime = startTime + maxExecutionTime
  var paused = false
  // Initialize counter
  var delta = 0
  // Get correct iterator, mime_type
  var spreadsheet = SpreadsheetApp.openById(params.spreadsheet_id)
  switch (params.item_type) {
    case 'folder':
      var mime_type = function () {
        return 'folder'
      }
      var item_spreadsheet = spreadsheet.getSheetByName(sheetNameFolder)
      if (typeof (params.token) === 'string') {
        var item_iterator = DriveApp.continueFolderIterator(params.token)
      } else {
        var item_iterator = DriveApp.getFolders()
      }
      break
    case 'file':
      var mime_type = function (item) {
        return item.getMimeType()
      }
      var item_spreadsheet = spreadsheet.getSheetByName(sheetNameFile)
      if (typeof (params.token) === 'string') {
        var item_iterator = DriveApp.continueFileIterator(params.token)
      } else {
        var item_iterator = DriveApp.getFiles()
      }
      break
  }
  // Iterate through items
  while (item_iterator.hasNext() && (new Date()).getTime() < endTime && !paused) {
    delta++
    var item = item_iterator.next()
    var item_data = [
      item.getId(),
      mime_type(item),
      item.getUrl(),
      item.getName(),
      item.getDescription(),
      item.isStarred().toString(),
      item.isTrashed().toString(),
      item.isShareableByEditors().toString(),
      item.getDateCreated().toUTCString(),
      item.getLastUpdated().toUTCString(),
      item.getSize().toString(),
      item.getSharingAccess().toString(),
      item.getSharingPermission().toString(),
      userToString_(item.getOwner()),
      usersToString_(item.getViewers()),
      usersToString_(item.getEditors())]
    item_spreadsheet.appendRow(item_data)
    if (delta % pauseCheckIterations === 0) {
      paused = paused || isPaused_(params.pause_id)
    }
  }
  // Clean-up pausing property
  clearPaused_(params.pause_id)
  // Return number of items and continuation
  var token = item_iterator.hasNext() ? item_iterator.getContinuationToken() : false
  return {
    done: !item_iterator.hasNext(),
    token: token,
    item_type: params.item_type,
    delta: delta
  }
}
