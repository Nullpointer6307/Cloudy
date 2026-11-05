import { system } from '@minecraft/server'
import { mainMenu } from 'UIs/mainMenu'


system.beforeEvents.startup.subscribe((data) => {
    data.itemComponentRegistry.registerCustomComponent('osuea:mainMenu', {
        onUse: (data) => {
            const player = data.source
            mainMenu(player)
        }
    });
});