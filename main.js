// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const glob = require('glob')
const templateGenerator = require('./menuTemplate')

const debug = /--debug/.test(process.argv[2])

let mainWindow = null

function initialize() {
    makeSingleInstance()
    loadDemos()

    function createWindow() {
        // Create the browser window.
        const windowOptions = {
            width: 1080,
            minWidth: 900,
            minHeight: 659,
            title: app.getName(),
            webPreferences: {
                nodeIntegration: true,
                worldSafeExecuteJavaScript: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        }

        // Menu Template
        let menu = templateGenerator.generatesMenuTemplate()
        let mainMenu = Menu.buildFromTemplate(menu)
        Menu.setApplicationMenu(mainMenu)

        // and load the index.html of the app.
        mainWindow = new BrowserWindow(windowOptions)
        mainWindow.loadFile('index.html')

        // Launch fullscreen with DevTools open, usage: npm run debug
        if (debug) {
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
        }

        mainWindow.on('closed', () => {
            mainWindow = null
        })
    }

    app.on('ready', () => {
        createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', () => {
        if (mainWindow === null) createWindow()
    })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return

    app.requestSingleInstanceLock()

    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}

// Require each JS file in the main-process dir
function loadDemos() {
    const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    files.forEach((file) => {
        require(file)
    })
}

initialize()
