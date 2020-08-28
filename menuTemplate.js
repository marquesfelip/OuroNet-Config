module.exports = {
    generatesMenuTemplate() {
        const MENU_TEMPLATE = [{
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

        return MENU_TEMPLATE
    }
}