// Hidden
// Functions not directly accessible from client

// dateString_  Date -> String
// Returns string representation for inputted date
function dateString_ (date) {
  var date = arguments.length >= 1 ? arguments[0] : new Date()
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

function isPaused_ (pause_id) {
  var props = PropertiesService.getUserProperties()
  var paused = props.getProperty(pause_id)
  if (typeof (paused) === 'string') {
    return paused.trim() === 'true'
  } else {
    return false
  }
}

function clearPaused_ (pause_id) {
  var props = PropertiesService.getUserProperties()
  props.deleteProperty(pause_id)
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
