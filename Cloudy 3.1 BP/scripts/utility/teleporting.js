import { world, system, Player } from '@minecraft/server'

const tickingareas = {
  'tp1': false,
  'tp2': false,
  'tp3': false,
  'tp4': false,
  'tp5': false,
  'tp6': false,
  'tp7': false,
  'tp8': false,
  'tp9': false,
  'tp10': false
}

/**
 * Teleports a player to a specific location.
 * @param {Player} player - The player to teleport.
 * @param {Vector3} location - The location to teleport the player to.
 */
export function teleportPlayer (player, location) {

  // check for unset home
  if (location.x == 0 && location.y == 0 && location.z == 0) {
    player.sendMessage('§cHome location not set')
    return
  }

  let ticking = ''
  const pos = {x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z)}

  // create ticking area if one is avaliable
  for (const area in tickingareas) {
    if (!tickingareas[area]) {
      tickingareas[area] = true
      player.runCommand(`tickingarea add circle ${Math.floor(player.location.x)} ${Math.floor(player.location.y)} ${Math.floor(player.location.z)} 2 ${area} true`)
      ticking = area
      break
    }
  }

  // teleport player after 5 seconds
  player.sendMessage('§eTeleporting in §c5 Seconds. Please do not move')

  system.runTimeout(() => {
    if (Math.floor(player.location.x) == pos.x && Math.floor(player.location.y) == pos.y && Math.floor(player.location.z) == pos.z) {
      player.sendMessage('§eTeleporting in §c4')
      system.runTimeout(() => {
        if (Math.floor(player.location.x) == pos.x && Math.floor(player.location.y) == pos.y && Math.floor(player.location.z) == pos.z) {
          player.sendMessage('§eTeleporting in §c3')
          system.runTimeout(() => {
            if (Math.floor(player.location.x) == pos.x && Math.floor(player.location.y) == pos.y && Math.floor(player.location.z) == pos.z) {
              player.sendMessage('§eTeleporting in §c2')
              system.runTimeout(() => {
                if (Math.floor(player.location.x) == pos.x && Math.floor(player.location.y) == pos.y && Math.floor(player.location.z) == pos.z) {
                  player.sendMessage('§eTeleporting in §c1')
                  system.runTimeout(() => {
                    if (Math.floor(player.location.x) == pos.x && Math.floor(player.location.y) == pos.y && Math.floor(player.location.z) == pos.z) {
                      player.sendMessage('§eTeleporting...')
                      player.teleport(location)
                    }else {
                      player.sendMessage('§cTeleportation cancelled.')
                    }
                  }, 20)
                }else {
                  player.sendMessage('§cTeleportation cancelled.')
                }
              }, 20)
            }else {
              player.sendMessage('§cTeleportation cancelled.')
            }
          }, 20)
        }else {
          player.sendMessage('§cTeleportation cancelled.')
        }
      }, 20)
    }else {
      player.sendMessage('§cTeleportation cancelled.')
    }
  }, 20)

  // remove ticking area
  if (ticking != '') {
    system.runTimeout(() => {
      player.runCommand(`tickingarea remove ${ticking}`)
      tickingareas[ticking] = false
    }, 200)
  }
}
