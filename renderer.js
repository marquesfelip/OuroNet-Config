// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const data = require('./app/js/data')
const path = require('path')

let connections = document.getElementById('connections')
let addConnection = document.getElementById('addConnection')
let getSavedConnections = document.getElementById('getSavedConnections')
let setNewConnections = document.getElementById('setNewConnections')

// The idConnection will receive the number of children of 'connections' div and it will used for the next ID Connection.
let idConnectionCount = 0
const CONN_STRINGS_CONFIG = 'C:\\inetpub\\wwwroot\\OuroNetCadastro\\connectionStrings.config'
const ALL_CONNECTIONS_JSON = path.join(__dirname, '\\app\\json\\allConnections.json')
const NEW_CONNECTIONS_JSON = path.join(__dirname, '\\app\\json\\newConnections.json')

// When opening the window, the connection strings will be loaded in the default installation location of the file.
window.onload = async function () {
    await data.getSavedConnections(CONN_STRINGS_CONFIG)

    connections.innerHTML = data.showSavedConnections(ALL_CONNECTIONS_JSON)

    idConnectionCount = document.getElementById('connections').childElementCount - 1

    addConnection.removeAttribute('disabled')
    setNewConnections.removeAttribute('disabled')
}

// Button: 'Atualizar conexões'
getSavedConnections.addEventListener('click', async () => {
    connections.innerHTML = 'Buscando conexões...'

    await data.getSavedConnections(CONN_STRINGS_CONFIG)

    connections.innerHTML = data.showSavedConnections(ALL_CONNECTIONS_JSON)

    idConnectionCount = document.getElementById('connections').childElementCount - 1
})

// Button: 'Adicionar conexão'
addConnection.addEventListener('click', () => {
    idConnectionCount += 1

    connections.innerHTML +=
        `<div id="connection-${idConnectionCount}" class="input-group mt-3">
            <input id="dataSource-${idConnectionCount}" type="text" class="form-control" placeholder="Instância" onchange="updateValue('dataSource-${idConnectionCount}', this.value)">
            <input id="initialCatalog-${idConnectionCount}" type="text" class="form-control" placeholder="Base de dados" onchange="updateValue('initialCatalog-${idConnectionCount}', this.value)">

            <div class="input-group-append">
            <button class="btn btn-outline-danger" type="button" onclick="deleteConnection('connection-${idConnectionCount}')">Excluir</button>
            </div>
        </div>
        `
})

// Button: 'Salvar configurações'
setNewConnections.addEventListener('click', async () => {
    let jsonObj = {}

    for (let index = 0; index < document.getElementById('connections').childElementCount; index++) {

        let dataSource = document.getElementById('connections').children[index].children[0].value
        let initialCatalog = document.getElementById('connections').children[index].children[1].value

        if ((dataSource !== '') && (initialCatalog !== '')) {
            jsonObj[index] = {
                'Data Source': dataSource,
                'Initial Catalog': initialCatalog
            }
        }
    }

    await data.setNewConnections(NEW_CONNECTIONS_JSON, JSON.stringify(jsonObj))

    connections.innerHTML = 'Buscando conexões...'

    await data.getSavedConnections(CONN_STRINGS_CONFIG)

    connections.innerHTML = data.showSavedConnections(ALL_CONNECTIONS_JSON)

    idConnectionCount = document.getElementById('connections').childElementCount - 1
})

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