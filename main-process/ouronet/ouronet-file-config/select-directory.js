const { ipcMain, dialog } = require('electron')

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }).then(result => {
        event.sender.send('selected-directory', result.filePaths)
    }).catch(err => {
        console.log(err)
    })
})
