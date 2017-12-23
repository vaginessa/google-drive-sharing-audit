function dateString (date) {
  return date.toLocaleString('en-US', {
    timeZone: 'UTC',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

function createSpreadsheet () {
  var sheetName = 'Google Drive Permissions Audit: ' + dateString(new Date())
  var sheet = SpreadsheetApp.create(sheetName)
  var header = [
    'ID',
    'Type',
    'URL',
    'Name',
    'Description',
    'Starred',
    'Trashed',
    'Sharable by Editors',
    'Created',
    'Modified',
    'Size',
    'Sharing Access',
    'Sharing Permission',
    'Owner',
    'Viewers',
    'Editors'
  ]
  sheet.appendRow(header)
  sheet.setFrozenRows(1)
  return {
    id: sheet.getId(),
    url: sheet.getUrl()
  }
}

function userToString_ (user) {
  return [
    user.getDomain(),
    user.getEmail(),
    user.getName(),
    user.getPhotoUrl()
  ].join(';')
}

function usersToString_ (users) {
  return users.map(userToString_).join('\n')
}

function storeProperties_ (sheet, type, item) {
  var properties = [
    item.getId(),
    type,
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
    usersToString_(item.getEditors())
  ]
  sheet.appendRow(properties)
}

function listFolders (id, offset) {
  var startTime = (new Date()).getTime()
  var endTime = startTime + (5 * 60 * 1000)
  var count = arguments.length >= 3 ? arguments[2] > 0 ? arguments[2] : Infinity : Infinity
  var sheet = SpreadsheetApp.openById(id)
  // Folders
  var folders = DriveApp.getFolders()
  var index = 0
  while (folders.hasNext() && (new Date()).getTime() < endTime && index < offset + count) {
    var folder = folders.next()
    if (index >= offset) {
      storeProperties_(sheet, 'folder', folder)
    }
    index++
  }
  // Return
  return {
    done: !folders.hasNext(),
    index: Math.max(offset, index - 1)
  }
}

function listFiles (id, offset) {
  var startTime = (new Date()).getTime()
  var endTime = startTime + (5 * 60 * 1000)
  var count = arguments.length >= 3 ? arguments[2] > 0 ? arguments[2] : Infinity : Infinity
  var sheet = SpreadsheetApp.openById(id)
  // Files
  var files = DriveApp.getFiles()
  var index = 0
  while (files.hasNext() && (new Date()).getTime() < endTime && index < offset + count) {
    var file = files.next()
    if (index >= offset) {
      storeProperties_(sheet, file.getMimeType(), file)
    }
    index++
  }
  // Return
  return {
    done: !files.hasNext(),
    index: Math.max(offset, index - 1)
  }
}

function doGet () {
  return HtmlService.createHtmlOutputFromFile('index.html')
}
