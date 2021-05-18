// In data.js the DOM doesn't have to be manipulated
const { PythonShell } = require('python-shell')
const { readFileSync, writeFileSync, } = require('fs')

module.exports = {
    updateSetting(jsonFile, options) {
        return new Promise((resolve, reject) => {
            try {
                let settings = JSON.parse(readFileSync(jsonFile, 'utf-8'))

                settings[options.setting] = options.value

                writeFileSync(jsonFile, JSON.stringify(settings, null, 4))
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    },

    showSavedConnections(jsonFile) {
        try {
            let savedConnections = null
            let idConnection = 0
            let connections = ''

            savedConnections = JSON.parse(readFileSync(jsonFile, 'utf-8'))

            for (const key in savedConnections) {
                if (savedConnections.hasOwnProperty(key)) {
                    const element = savedConnections[key]

                    connections +=
                        `<div id="connection-${idConnection}" class="input-group mt-3">
                            <input id="dataSource-${idConnection}" type="text" class="form-control" value="${element['Data Source']}" placeholder="Instância" onChange="updateValue('dataSource-${idConnection}', this.value)">
                            <input id="initialCatalog-${idConnection}" type="text" class="form-control" value="${element['Initial Catalog']}" placeholder="Base de dados" onChange="updateValue('initialCatalog-${idConnection}', this.value)">

                            <div class="input-group-append">
                                <button class="btn btn-outline-danger" type="button" onClick="deleteConnection('connection-${idConnection}')">Excluir</button>
                            </div>
                    </div>
                    `
                }
                idConnection += 1
            }
            return connections
        } catch (error) {
            return console.log(error)
        }
    },

    getSavedConnections() {
        return new Promise((resolve, reject) => {
            try {
                let options = {
                    scriptPath: __dirname
                }

                let pyshell = new PythonShell('getConnections.py', options)
                let intervalId = null

                pyshell.on('message', (message) => {
                    console.log(message)
                })

                pyshell.end((err) => {
                    if (err) reject(err)
                })

                intervalId = setInterval(() => {
                    if (pyshell.terminated) {
                        clearInterval(intervalId)
                        resolve(true)
                    }
                }, 50)

            } catch (error) {
                reject(error)
            }
        })
    },

    setNewConnections(newConnFile, jsonObj) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.updateNewConnJson(newConnFile, jsonObj)
                await this.updateOuroNetFiles()
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    },

    updateNewConnJson(newConnFile, jsonObj) {
        return new Promise((resolve, reject) => {
            try {
                writeFileSync(newConnFile, jsonObj)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    },

    updateOuroNetFiles() {
        return new Promise((resolve, reject) => {
            try {
                let options = {
                    scriptPath: __dirname
                }

                let pyshell = new PythonShell('setConnections.py', options)
                let intervalId = null

                pyshell.on('message', (message) => {
                    console.log(message)
                })

                pyshell.end((err) => {
                    if (err) reject(err)
                })

                intervalId = setInterval(() => {
                    if (pyshell.terminated) {
                        clearInterval(intervalId)
                        resolve(true)
                    }
                }, 50)

            } catch (error) {
                reject(error)
            }
        })
    }
}
