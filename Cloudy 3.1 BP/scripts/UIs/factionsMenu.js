import { world } from '@minecraft/server'
import { ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { ChestFormData } from 'extensions/forms.js';

export function factionsMenu(player) {
    new ChestFormData('large')
        .title("§cFaction")
        .button(13, "§fFactions Menu", ["§7This is where you can manage your faction"], "textures/items/paper")
        .button(20, "Create Faction", [], "textures/blocks/glass_green")
        .button(22, "Join Faction", [], "textures/blocks/glass_blue")
        .button(24, "Delete Faction", [], "textures/blocks/glass_red")
        .button(37, "Back", [], "textures/items/arrow")
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
                case 37:
                    mainMenu(player)
                    break;
                case 20:
                    promptCreateFac(player)
                    break;
                case 24:
                    promptDeleteFac(player)
                    break;
            }
        })
}

function promptCreateFac(player) {
    new ModalFormData()
        .title("§dCreate Faction")
        .textField("§7Enter Factions name", "Faction name")
        .show(player).then(res => {
            if (res.canceled) return;

            const facName = res.formValues[0].trim().toUpperCase();
            const playerId = player.name.toLowerCase();

            // player already in faction
            if (player.getDynamicProperty("fac_name")) {
                player.sendMessage("§cAlready in faction")
                return;
            }

            if (!facName) return player.sendMessage("§cInvalid faction name.");
            if (world.getDynamicProperty(`fac_data_${facName}`)) return player.sendMessage("§cFaction name already taken.");

            const facObject = {
                name: facName,
                leader: player.name,
                members: [player.name],
                bank: 0,
                value: 0
            };

            // update data
            world.setDynamicProperty(`fac_data_${facName}`, JSON.stringify(facObject));
            world.setDynamicProperty(`fac_${playerId}`, facName);
            player.setDynamicProperty("fac_name", `${facName}`);

            // message
            player.sendMessage(`§aFaction §b${facName} §acreated successfully!`);
        });
}

function promptDeleteFac(player) {
    new MessageFormData()
        .title("§c§lDelete Faction")
        .body("§fAre you sure you want to §l§o§cdelete§r §fyour faction?")
        .button1("§aYes")
        .button2("§cCancel")
        .show(player).then(res => {
            if (res.selection === 0) {
                // clicked delete

                const facName = player.getDynamicProperty("fac_name")
                const playerId = player.name.toLowerCase();
                const facInfo = JSON.parse(world.getDynamicProperty(`fac_data_${facName}`))

                // player not in a faction
                if (!facName) {
                    player.sendMessage("§cYou are not in a faction")
                    return;
                }
                // player not faction leader
                else if (facInfo.leader != player.name) {
                    player.sendMessage("§cOnly the faction leader can delete the faction")
                    return;
                }


                // update data
                world.setDynamicProperty(`fac_data_${facName}`, undefined);
                world.setDynamicProperty(`fac_${playerId}`, undefined);
                player.setDynamicProperty("fac_name", undefined);

                // message
                player.sendMessage(`§aFaction §b${facName} §adeleted successfully!`);
            }
            // clicked cancel
            return;
        });
}