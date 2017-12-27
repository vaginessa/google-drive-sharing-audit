// Hidden
// Functions not directly accessible from client

// dateString_  Date? -> String
// Returns string representation for inputted date
function dateString_ () {
  var dt = arguments.length >= 1 ? arguments[0] : new Date()
  var date = [
    dt.getUTCFullYear(),
    padString_(dt.getUTCMonth(), 0, 2),
    padString_(dt.getUTCDate(), 0, 2)
  ].join('-')
  var time = [
    padString_(dt.getUTCHours(), 0, 2),
    padString_(dt.getUTCMinutes(), 0, 2),
    padString_(dt.getUTCSeconds(), 0, 2)
  ].join(':')
  return date + ' ' + time + ' GMT'
}

// padString_  String, String, Integer, Bool? -> String
// Pads a string to a specified length
function padString_ (input, character, length) {
  var padding_length = Math.max(0, length - input.toString().length)
  var padding = Array(padding_length + 1).join(character.toString())
  if (arguments.length >= 4 && arguments[3] === false) {  // Right padded
    return input.toString() + padding
  } else {  // Left padded
    return padding + input.toString()
  }
}

// isPaused_  String -> Bool
// Determines whether a certain spreadsheet id and item type are paused
function isPaused_ (pause_id) {
  var props = PropertiesService.getUserProperties()
  var paused = props.getProperty(pause_id)
  if (typeof (paused) === 'string') {
    return paused.trim() === 'true'
  } else {
    return false
  }
}

// clearPaused_  String -> NONE
// Cleanup by deleting a property for a certain spreadsheet id and item type
function clearPaused_ (pause_id) {
  var props = PropertiesService.getUserProperties()
  props.deleteProperty(pause_id)
}

// userToString_  Google@User -> String
// Returns string representation for inputted user
function userToString_ (user) {
  return [
    user.getDomain(),
    user.getEmail(),
    user.getName(),
    user.getPhotoUrl()
  ].join(';')
}

// usersToString_  Array[Google@User] -> String
// Returns string representation for inputted array of users
function usersToString_ (users) {
  return users.map(userToString_).join('\n')
}
