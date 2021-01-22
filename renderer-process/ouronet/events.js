// Delete the element connection
function deleteConnection(connId) {
    let element = document.getElementById(connId)
    element.parentNode.removeChild(element)
}

// This function will update the value attribute of the input group
// When adding a new connection, the values of the input group won't return to the initial value
function updateValue(elementId, value) {
    document.getElementById(elementId).setAttribute('value', value)
}
