// Hidden
// Functions not directly accessible from client

// dateString_  Date -> String
// Returns string representation for inputted date
function dateString_ (date) {
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

// userToString_  Google@User -> String
// Returns string representation for inputted user
function userToString_ (user) {
  return [user.getDomain(), user.getEmail(), user.getName(),
    user.getPhotoUrl()].join(';')
}

// usersToString_  Array[Google@User] -> String
// Returns string representation for inputted array of users
function usersToString_ (users) {
  return users.map(userToString_).join('\n')
}

// getSheetItems_  Google@Sheet -> Dict[Integer]
// Gets the row number for each ID in a Spreadsheet
function getSheetItems_ (sheet) {
  // Open Spreadsheet
  var range = sheet.getDataRange()
  var data = range.getValues()
  // Initialize output dictionary
  var items = {}
  // Add items from Spreadsheet to output dictionary
  for (var row_num = 1; row_num < data.length; row_num++) {
    var row = data[row_num]
    var id = row[0].trim()
    if (id.length > 0) {
      items[id] = row_num
    }
  }
  return items
}

// processItems_  Google@Sheet, Google@Iterator -> Dict[Boolean, Integer]
// Adds information for items into each row of the Spreadsheet
function processItems_ (sheet, item_iterator, item_type) {
  // Prepare termination conditions
  var startTime = (new Date()).getTime()
  var endTime = startTime + (5 * 60 * 1000)  // 5 mins
  // Get item IDs from Sheet
  var sheet_items = getSheetItems_(sheet)
  // Initialize count of processed items
  var delta = 0
  // Process items until complete or running too long
  while (item_iterator.hasNext() && (new Date()).getTime() < endTime) {
    // Get next item to process and ID to compare
    var item = item_iterator.next()
    var item_id = item.getId()
    // Processes items if item has not been processed before, assumes
    // Sheet isn't changed except by current function during run, and that
    // "item_iterator" doesn't return two items with the same ID
    if (!sheet_items.hasOwnProperty(item_id)) {
      // Process item and add retrieved data to row
      var new_data = [
        item_id,
        item_type(item),
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
      sheet.appendRow(new_data)
      // Increment count of processed items
      delta++
    }
  }
  // Return whether done processing items and number of changed items
  return {
    done: !item_iterator.hasNext(),
    delta: delta
  }
}
