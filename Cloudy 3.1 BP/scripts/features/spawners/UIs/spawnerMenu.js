import { ChestFormData } from 'extensions/forms'
import { getItemCount, removeItems } from 'utility/inventory'
import { breakSpawner } from '../break'

export function spawnerMenu (player, block) {
  const mobName = block.typeId.replace('cloudy:', '').replace('spawner', '')
  const spawnerName = mobName.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  const spawnerLevel = block.permutation.getState('cloudy:level')

  new ChestFormData('small')
    .title('§gSpawner Menu')
    .button(4, `§g${spawnerName} Spawner`, [`§7Level: §a${spawnerLevel == 16 ? "Max!" : spawnerLevel}`], `${spawnerLevel == 16 ? `textures/blocks/spawners/${mobName}spawnermax` : `textures/blocks/spawners/${mobName}spawner`}`)
    .button(11, `§aAdd Spawners`, ['§7Choose how much to add'], `textures/blocks/glass_lime`)
    .button(15, `§cRemove Spawners`, ['§7Picks up whole stack'], `textures/blocks/glass_red`)

    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'xxxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 11:
        if (spawnerLevel < 16) {
          addSpawnerMenu(player, block)
        }else {
          player.sendMessage(`§cSpawner already at max level!`)
        }
        break
      case 15:
        breakSpawner(player, block.typeId, block.dimension, block.location, spawnerLevel)
        break
    }
  })
}

function addSpawnerMenu (player, block) {
  const mobName = block.typeId.replace('cloudy:', '').replace('spawner', '')
  const spawnerName = mobName.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  const spawnerLevel = block.permutation.getState('cloudy:level')

  const playerSpawners = getItemCount(player, block.typeId)

  new ChestFormData('small')
    .title('§aAdd Spawners')
    .button(4, `§g${spawnerName} Spawner`, [`§7Level: §a${spawnerLevel == 16 ? "Max!" : spawnerLevel}`], `textures/blocks/spawners/${mobName}spawner`)
    .button(10, `§7Add §a1`, [], `textures/blocks/glass_lime`)
    .button(11, `${spawnerLevel < 15 ? '§7Add §a2' : '§8Add 2'}`, [], `${spawnerLevel < 15 ? "textures/blocks/glass_lime" : "textures/blocks/glass_red"}`)
    .button(12, `${spawnerLevel < 14 ? '§7Add §a3' : '§8Add 3'}`, [], `${spawnerLevel < 14 ? "textures/blocks/glass_lime" : "textures/blocks/glass_red"}`)
    .button(13, `${spawnerLevel < 13 ? '§7Add §a4' : '§8Add 4'}`, [], `${spawnerLevel < 13 ? "textures/blocks/glass_lime" : "textures/blocks/glass_red"}`)
    .button(14, `${spawnerLevel < 12 ? '§7Add §a5' : '§8Add 5'}`, [], `${spawnerLevel < 12 ? "textures/blocks/glass_lime" : "textures/blocks/glass_red"}`)
    .button(15, `${spawnerLevel < 7 ? '§7Add §a10' : '§8Add 10'}`, [], `${spawnerLevel < 7 ? "textures/blocks/glass_lime" : "textures/blocks/glass_red"}`)
    .button(16, `§7Add §aMax`, [], `textures/blocks/glass_lime`)

    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'xxxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 10:
        // add 1 spawner
        if (playerSpawners >= 1 && spawnerLevel < 16) {
          block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + 1))
          removeItems(player, block.typeId, 1)
        }else if (playerSpawners < 1) {
          player.sendMessage(`§cYou don't have enough ${spawnerName} Spawners.`)
        } else {
          player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
        }
        break
      case 11:
        // add 2 spawners
        if (playerSpawners >= 2 && spawnerLevel < 15) {
          block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + 2))
          removeItems(player, block.typeId, 2)
        } else if (playerSpawners < 2) {
          player.sendMessage(`§cYou don't have enough ${spawnerName} Spawners.`)
        } else {
          player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
        }
        break
      case 12:
        // add 3 spawners
        if (playerSpawners >= 3 && spawnerLevel < 14) {
          block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + 3))
          removeItems(player, block.typeId, 3)
        } else if (playerSpawners < 3) {
          player.sendMessage(`§cYou don't have enough ${spawnerName} Spawners.`)
        } else {
          player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
        }
        break
      case 13:
        // add 4 spawners
        if (playerSpawners >= 4 && spawnerLevel < 13) {
          block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + 4))
          removeItems(player, block.typeId, 4)
        } else if (playerSpawners < 4) {
          player.sendMessage(`§cYou don't have enough ${spawnerName} Spawners.`)
        } else {
          player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
        }
        break
      case 14:
        // add 5 spawners
        if (playerSpawners >= 5 && spawnerLevel < 12) {
          block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + 5))
          removeItems(player, block.typeId, 5)
        } else if (playerSpawners < 5) {
          player.sendMessage(`§cYou don't have enough ${spawnerName} Spawners.`)
        } else {
          player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
        }
        break
      case 15:
        // add 10 spawners
        if (playerSpawners >= 10 && spawnerLevel < 7) {
          block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + 10))
          removeItems(player, block.typeId, 10)
        } else if (playerSpawners < 10) {
          player.sendMessage(`§cYou don't have enough ${spawnerName} Spawners.`)
        } else {
          player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
        }
        break
      case 16:
        if (spawnerLevel < 16) {
          if (playerSpawners >= 16 - spawnerLevel) {
            block.setPermutation(block.permutation.withState('cloudy:level', 16))
            removeItems(player, block.typeId, (16 - spawnerLevel))
          } else {
            block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + playerSpawners))
            removeItems(player, block.typeId, playerSpawners)
          }
        } else {
          player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
        }

    // add max spawners
    // if (playerSpawners >= 16 - spawnerLevel && spawnerLevel < 16) {
    //   block.setPermutation(block.permutation.withState('cloudy:level', spawnerLevel + (16 - spawnerLevel)))
    //   removeItems(player, block.typeId, (16 - spawnerLevel))
    // } else if (playerSpawners < 16 - spawnerLevel) {
    //   player.sendMessage(`§cYou don't have enough ${spawnerName} Spawners.`)
    // } else {
    //   player.sendMessage(`§cYou can't exceed the maximum level of 16.`)
    // }
    // break
    }
  })
}
