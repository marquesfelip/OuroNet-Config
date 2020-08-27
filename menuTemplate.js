module.exports = {
    generatesMenuTemplate() {
        let menuTemplate = [{
                label: 'View',
                submenu: [{
                        role: 'reload'
                    },
                    {
                        role: 'forceReload'
                    },
                    {
                        role: 'toggleDevTools'
                    },
                    {
                        label: '',
                        type: 'separator'
                    },
                    {
                        role: 'resetZoom'
                    },
                    {
                        role: 'zoomIn'
                    },
                    {
                        role: 'zoomOut'
                    },
                    {
                        label: '',
                        type: 'separator'
                    },
                    {
                        role: 'togglefullscreen'
                    }
                ],
            }
        ]

        return menuTemplate
    }
}