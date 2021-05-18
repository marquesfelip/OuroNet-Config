// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const DATA = require('../../main-process/ouronet/ouronet-file-config/data')
const PATH = require('path')
const { ipcRenderer } = require('electron')

// The idConnection will receive the number of children of 'connections' div and it will used for the next ID Connection.
let idConnectionCount = 0

const CONNECTIONS = document.getElementById('connections')
const ADD_CONNECTION = document.getElementById('addConnection')
const GET_SAVED_CONNECTIONS = document.getElementById('getSavedConnections')
const SET_NEW_CONNECTIONS = document.getElementById('setNewConnections')
const BACKUP_SETTINGS = document.getElementById('backupSettings')
const USE_BACKUP = document.getElementById('useBackup')
const SELECT_DIRECTORY = document.getElementById('select-directory')

const OURONET_FILES_PATH = '..\\..\\main-process\\ouronet\\ouronet-file-config\\helpers\\'

const SETTINGS = PATH.join(__dirname, OURONET_FILES_PATH + 'settings.json')
const ALL_CONNECTIONS_JSON = PATH.join(__dirname, OURONET_FILES_PATH + 'allConnections.json')
const NEW_CONNECTIONS_JSON = PATH.join(__dirname, OURONET_FILES_PATH + 'newConnections.json')
const BACKUP_CONNECTIONS_JSON = PATH.join(__dirname, OURONET_FILES_PATH + 'backupConnections.json')

//#region OuroNet Installer
// Button: 'Fazer backup das configurações'
BACKUP_SETTINGS.addEventListener('click', async () => {
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
    await DATA.updateNewConnJson(BACKUP_CONNECTIONS_JSON, JSON.stringify(jsonObj))
})
//#endregion

//#region OuroNet File Config
// When opening the window, the connection strings will be loaded in the default installation location of the file.
window.onload = async function () {
    await DATA.getSavedConnections()

    CONNECTIONS.innerHTML = DATA.showSavedConnections(ALL_CONNECTIONS_JSON)

    idConnectionCount = document.getElementById('connections').childElementCount - 1

    ADD_CONNECTION.removeAttribute('disabled')
    SET_NEW_CONNECTIONS.removeAttribute('disabled')
}

// Button: 'Restaurar configurações'
GET_SAVED_CONNECTIONS.addEventListener('click', async () => {
    CONNECTIONS.innerHTML = `<h2>Buscando conexões</h2> <div class="d-inline-block spinner"></div>`

    await DATA.getSavedConnections()

    CONNECTIONS.innerHTML = DATA.showSavedConnections(ALL_CONNECTIONS_JSON)

    idConnectionCount = document.getElementById('connections').childElementCount - 1
})

// Button: 'Utilizar conexões de Backup'
USE_BACKUP.addEventListener('click', async () => {
    CONNECTIONS.innerHTML = `<h2>Buscando conexões</h2> <div class="d-inline-block spinner"></div>`

    CONNECTIONS.innerHTML = DATA.showSavedConnections(BACKUP_CONNECTIONS_JSON)

    idConnectionCount = document.getElementById('connections').childElementCount - 1
})

// Button: 'Selecionar diretório de arquivos
SELECT_DIRECTORY.addEventListener('click', (event) => {
    ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', async (event, path) => {
    const OPTIONS = {
        setting: 'selectedDirectory',
        value: path[0]
    }

    console.log(path[0]);

    await DATA.updateSetting(SETTINGS, OPTIONS)
})

// Button: 'Adicionar conexão'
ADD_CONNECTION.addEventListener('click', () => {
    idConnectionCount += 1

    CONNECTIONS.innerHTML +=
        `<div id="connection-${idConnectionCount}" class="input-group mt-3">
            <input id="dataSource-${idConnectionCount}" type="text" class="form-control" placeholder="Instância" onchange="updateValue('dataSource-${idConnectionCount}', this.value)">
            <input id="initialCatalog-${idConnectionCount}" type="text" class="form-control" placeholder="Base de dados" onChange="updateValue('initialCatalog-${idConnectionCount}', this.value)">

            <div class="input-group-append">
            <button class="btn btn-outline-danger" type="button" onClick="deleteConnection('connection-${idConnectionCount}')">Excluir</button>
            </div>
        </div>
        `
    document.getElementById(`dataSource-${idConnectionCount}`).focus()
})

// Button: 'Salvar configurações'
SET_NEW_CONNECTIONS.addEventListener('click', async () => {
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

    CONNECTIONS.innerHTML = `<h2>Buscando conexões</h2> <div class="d-inline-block spinner"></div>`

    await DATA.setNewConnections(NEW_CONNECTIONS_JSON, JSON.stringify(jsonObj))

    await DATA.getSavedConnections()

    CONNECTIONS.innerHTML = DATA.showSavedConnections(ALL_CONNECTIONS_JSON)

    idConnectionCount = document.getElementById('connections').childElementCount - 1
})
//#endregion
