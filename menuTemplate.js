module.exports = {
    generatesMenuTemplate() {
        const MENU_TEMPLATE = [{
                label: 'Visualizar',
                submenu: [{
                        label: 'Recarregar',
                        role: 'reload'
                    },
                    {
                        label: 'Forçar Recarregar',
                        role: 'forceReload'
                    },
                    {
                        label: 'Ferramentas de Desenvolvedor',
                        role: 'toggleDevTools'
                    },
                    {
                        label: '',
                        type: 'separator'
                    },
                    {
                        label: 'Restaurar Zoom',
                        role: 'resetZoom'
                    },
                    {
                        label: 'Aumentar Zoom',
                        role: 'zoomIn'
                    },
                    {
                        label: 'Diminuir Zoom',
                        role: 'zoomOut'
                    },
                    {
                        label: '',
                        type: 'separator'
                    }
                ],
            }
        ]

        return MENU_TEMPLATE
    }
}