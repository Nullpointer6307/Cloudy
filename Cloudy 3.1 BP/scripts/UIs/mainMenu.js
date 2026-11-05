import { world } from '@minecraft/server'
import { ChestFormData } from 'extensions/forms.js';

import { factionsMenu } from './factionsMenu'

export function mainMenu(player) {
    new ChestFormData('large')
        .title("§aMain Menu")
        .button(13, "welcom to factions", ["line1\nline2"], "textures/items/paper")
        .button(20, "Warps", ["line1\nline2"], "textures/blocks/wool_colored_green")
        .button(22, "Factions", ["line1\nline2"], "textures/blocks/wool_colored_red")
        .pattern([
            'xxxxxxxxx',
            'x___t___x',
            'x_______x',
            'x_______x',
            'x_______x',
            'xxxxxxxxx'
        ], {
            x: { itemName: "", itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' },
        })
        .show(player).then(response => {
            if (response.canceled) return;
            switch (response.selection) {
                case 20:
                    world.sendMessage("clicked Warps")
                    break;
                case 22:
                    factionsMenu(player)
                    break;
            }
        })
}