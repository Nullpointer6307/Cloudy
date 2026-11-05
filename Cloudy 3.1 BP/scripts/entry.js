import {
  system,
  world,
  CustomCommandParamType,
  CommandPermissionLevel,
  ItemStack,
  Player,
  GameMode,
  EquipmentSlot,
} from "@minecraft/server";

// Event Managers
import { AfterEventManager } from "eventManagers/afterEventManager";
import { BeforeEventManager } from "eventManagers/beforeEventManager";

// setup events
AfterEventManager.init();
BeforeEventManager.init();

// Load all features
import "./core/coreFeatures/coreFeatureLoader";
import "./features/featureLoader";

import "./chat/chat_main";

import { mainMenu } from "./UIs/mainMenu";
import { getScore, setScore, addScore } from "utility/scoreboards";

world.afterEvents.playerSpawn.subscribe((data) => {
  const player = data.player;

  let item = new ItemStack("osuea:main_menu", 1);
  item.lockMode = "slot";
  item.keepOnDeath = true;
  player.getComponent("inventory").container.setItem(8, item);
});

import { ChestFormData } from "extensions/forms.js";
import { sellAllItems } from "./core/coreFeatures/economy/sell/sellFunctions";
import { getFacInfo } from "./core/coreFeatures/factions/factionManagement";
import { formatNumber } from "./utility/formating";
import { formatMoney } from "./core/coreFeatures/economy/tools/money";

function bartender(player) {
  new ChestFormData("large")
    .title("§bBartender")
    .button(
      13,
      ` §bChris §8- §7Bartender`,
      [`\n§8Hey! Welcome to my drink shop!\n§8dont buy too much now!`],
      "textures/items/paper"
    )
    .button(
      19,
      `§b2x Gem Booster §8- §75 Minutes`,
      [
        `§7Gain 2x gems while mining!\n§8Time doesnt stack!\n\n§7Requires §f2,500 §dMinedust\n§aClick to purchase`,
      ],
      "textures/items/diamond"
    )
    .button(
      20,
      `§6Forgery Potion I §8- §75 Minutes`,
      [
        `§7-25%% waiting time on the forgery!\n§8Time doesnt stack!\n\n§7Requires §f2,500 §dMinedust\n§aClick to purchase`,
      ],
      "textures/items/emerald"
    )
    .pattern(
      [
        "xxxxxxxxx",
        "x_______x",
        "x_______x",
        "x_______x",
        "x_______x",
        "xxxxxxxxx",
      ],
      {
        x: {
          itemName: "",
          itemDesc: [""],
          enchanted: false,
          stackAmount: 1,
          texture: "textures/blocks/glass_black",
        },
      }
    )
    .show(player)
    .then((response) => {
      if (response.canceled) return;
      switch (response.selection) {
        case 19:
          player.runCommand(`give @s diamond 1`);
          break;
        case 20:
          if (getScore(player, "mine_dust") >= 2500) {
            purchaseSuccessful(player);
            world.scoreboard.getObjective("mine_dust").addScore(player, -2500);
            player.runCommand(`give @s osuea:forgery_potion_one 1`);
          } else return insufficient_funds(player);
          break;
      }
      bartender(player);
    });
}

system.beforeEvents.startup.subscribe((event) => {
  const commandRegistry = event.customCommandRegistry;

  commandRegistry.registerEnum("cloudy:my_enum", ["all", "hand", "allhand"]);
  commandRegistry.registerEnum("cloudy:fOptions", ["homes", "vault", "claims", "manage", "leave", "leaderboards"]);

  const helloCommand = {
    name: "cloudy:sell",
    description: "sell items",
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
      { 
        type: CustomCommandParamType.Enum, 
        name: "cloudy:my_enum" // The parameter name must match the registered enum name above
    }
  ],
  };
  commandRegistry.registerCommand(helloCommand, sell);

  const faction = {
    name: "cloudy:f",
    description: "factions menu",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
      { 
        type: CustomCommandParamType.Enum, 
        name: "cloudy:fOptions" // The parameter name must match the registered enum name above
    }
  ],
  };
  commandRegistry.registerCommand(faction, helloCustomCommand);
})

import * as GameTest from "@minecraft/server-gametest";

system.beforeEvents.startup.subscribe((init) => {
  const helloCommand = {
    name: "cloudy:hellocustomcommand",
    description: "Celebration size",
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
      { type: CustomCommandParamType.PlayerSelector, name: "targetPlayer" },
    ],
  };
  init.customCommandRegistry.registerCommand(helloCommand, helloCustomCommand);

  const bartender = {
    name: "cloudy:bartender",
    description: "Opens Bartender UI",
    permissionLevel: CommandPermissionLevel.Any,
  };
  init.customCommandRegistry.registerCommand(bartender, bartenderCommand);

  const simulatedPlayerSpawner = {
    name: "cloudy:spawnsimulatedplayer",
    description: "Spawns a simulated player at your location",
    permissionLevel: CommandPermissionLevel.Any,
  };
  init.customCommandRegistry.registerCommand(simulatedPlayerSpawner, (origin) => {
    const player = origin.sourceEntity;

    system.run(() => {
      GameTest.spawnSimulatedPlayer({
        dimension: world.getDimension("overworld"),
        x: player.location.x,
        y: player.location.y,
        z: player.location.z
      }, `Test-Player`, GameMode.survival);
    })
  })

  const setProperty = {
    name: "cloudy:setproperty",
    description: "Sets a dynamic property on the item in your hand",
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
      { type: CustomCommandParamType.String, name: "property" },
      { type: CustomCommandParamType.String, name: "value" },
    ]
  };
  init.customCommandRegistry.registerCommand(setProperty, (origin, prop, value) => {
    system.run(() => {
      const me = origin.sourceEntity;

      console.warn(me)

      const inventory = me.getComponent('minecraft:inventory')
      const container = inventory.container

      const item = container.getItem(me.selectedSlotIndex)
      item.setDynamicProperty(prop, value)
      let lore = item.getLore()
      lore.push(`§7${prop} ${value}`)
      item.setLore(lore)

      container.setItem(me.selectedSlotIndex, item)
    });
  })
});

function bartenderCommand() {
  system.run(() => {
    for (const player of world.getPlayers()) {
      bartender(player);
    }
  });
}

function helloCustomCommand(origin) {
  const player = origin.sourceEntity;
  system.run(() => {
    prison_pass_plus(player)
  });
}

function sell(origin, param) {
  const player = origin.sourceEntity;
  if (param == "all") {
    system.run(() => {
    sellAllItems(player)
    })
  }

}

// world.afterEvents.itemStartUseOn.subscribe((data) => {
// 	const player = data.source
// 	const block = data.block
// 	const item = data.itemStack
// 	const blockFace = data.blockFace

// 	if (item.typeId == "cloudy:testspawner" && block.typeId == "cloudy:testspawner") {
// 		world.sendMessage("placed spawner on spawner")

// 	}
// })

world.beforeEvents.playerPlaceBlock.subscribe((data) => {
  const block = data.block;
  const face = data.face;
  const dim = data.dimension;
  const perm = data.permutationToPlace;
  const item = perm.getItemStack();
  const player = data.player;

  const placePos = block.location;

  switch (face) {
    case "Up":
      placePos.y -= 1;
      break;
    case "Down":
      placePos.y += 1;
      break;
    case "North":
      placePos.z += 1;
      break;
    case "South":
      placePos.z -= 1;
      break;
    case "East":
      placePos.x -= 1;
      break;
    case "West":
      placePos.x += 1;
      break;
  }

  const clickedBlock = dim.getBlock(placePos);

  if (
    item.typeId === "cloudy:testspawner" &&
    clickedBlock.typeId === "cloudy:testspawner"
  ) {
    if (clickedBlock.permutation.getState("cloudy:level") < 16) {
      system.run(() => {
        try {
          player.runCommand("clear @s cloudy:testspawner 0 1 ");
          clickedBlock.setPermutation(
            clickedBlock.permutation.withState(
              "cloudy:level",
              clickedBlock.permutation.getState("cloudy:level") + 1
            )
          );
          world.sendMessage(
            `Set level to: ${clickedBlock.permutation.getState(
              "cloudy:level"
            )}/16`
          );
        } catch {
          player.runCommand('tell @s "please slow down placing spawners!"');
        }
      });
      data.cancel = true;
    }
  }
});

system.runInterval(()=> {
  const players = world.getPlayers()

  for (const player of players) {
    let sidebar = ""
    
    try {
      const facInfo = getFacInfo(player)
      sidebar+= `§f§l${player.name}\n§r`
      sidebar+= ` §7Rank: §d${"Member"}\n` // need rank system
      sidebar+= ` §7Balance: §a${formatMoney(getScore(player, "money"))}\n`
      sidebar+= ` §7Coins: §e${formatMoney(getScore(player, "coins"))}\n`
      sidebar+= `§fFaction: §b${facInfo.name}\n`
      sidebar+= ` §7value: §a${facInfo.value}\n`
      sidebar+= ` §7power: §c${facInfo.power}/${facInfo.powerMax}\n`

      player.onScreenDisplay.setTitle('sb:' + sidebar, {
        stayDuration: 1000,
        fadeInDuration: 0,
        fadeOutDuration: 0
      })
    }
    catch {
    }

    
  }
}, 20)

// happy message
console.log("Successfully Loaded All Scripts!");

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const equipment = player.getComponent("minecraft:equippable")
    
    const helmet = equipment.getEquipment(EquipmentSlot.Head)
    const chestplate = equipment.getEquipment(EquipmentSlot.Chest)
    const leggings = equipment.getEquipment(EquipmentSlot.Legs)
    const boots = equipment.getEquipment(EquipmentSlot.Feet)

    const armorPieces = [helmet, chestplate, leggings, boots]

    for (const armor of armorPieces) {
      if (!armor) continue

      if (armor.getDynamicProperty("quickness")) {
        player.addEffect("speed", 80, {amplifier: 2, showParticles: false})
      }
    }



  }
}, 20)

world.afterEvents.playerHotbarSelectedSlotChange.subscribe((data) => {
  const player = data.player
  const prop = player.getProperty("cloudy:chunk")

  if (prop == 1) {
    player.setProperty("cloudy:chunk", 0)
  } else {
    player.setProperty("cloudy:chunk", 1)
  }
})
