const { PythonShell } = require('python-shell')
const path = require('path')
const { readFileSync, writeFileSync } = require('fs')

module.exports = {
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
                        <input id="dataSource-${idConnection}" type="text" class="form-control" value="${element['Data Source']}" placeholder="Instância" onchange="updateValue('dataSource-${idConnection}', this.value)">
                        <input id="initialCatalog-${idConnection}" type="text" class="form-control" value="${element['Initial Catalog']}" placeholder="Base de dados" onchange="updateValue('initialCatalog-${idConnection}', this.value)">

                        <div class="input-group-append">
                            <button class="btn btn-outline-danger" type="button" onclick="deleteConnection('connection-${idConnection}')">Excluir</button>
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

    getSavedConnections(connStrFile) {
        return new Promise((resolve, reject) => {
            try {
                let options = {
                    scriptPath: path.join(__dirname, '..\\python\\'),
                    args: [connStrFile]
                }

                let pyshell = new PythonShell('getConnections.py', options)

                pyshell.on('message', (message) => {
                    console.log(message)
                })

                pyshell.end((err) => {
                    if (err) throw err
                })

                setInterval(() => {
                    if (pyshell.terminated) {
                        clearInterval()
                        resolve(true)
                    }
                }, 150)
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
                    scriptPath: path.join(__dirname, '..\\python\\')
                }

                let pyshell = new PythonShell('setConnections.py', options)

                pyshell.on('message', (message) => {
                    console.log(message)
                })

                pyshell.end((err) => {
                    if (err) throw err
                })

                setInterval(() => {
                    if (pyshell.terminated) {
                        clearInterval()
                        resolve(true)
                    }
                }, 150)

            } catch (error) {
                reject(error)
            }
        })
    }
}