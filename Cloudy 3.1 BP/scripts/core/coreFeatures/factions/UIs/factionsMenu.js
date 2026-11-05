import { world, Player } from '@minecraft/server'
import { ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { ChestFormData } from 'extensions/forms.js'
import { createFaction, getFacInfo, leaveFaction, updateFactionHome, depositBank, withdrawBank, depositTnt, withdrawTnt } from '../factionManagement'
import { MainMenuManager } from '../../mainMenu/menuManager'
import { formatMoney, getMoney } from '../../economy/tools/money'
import { formatNumber } from '../../../../utility/formating'
import { teleportPlayer } from '../../../../utility/teleporting'
import { loadDispensers, unloadDispensers } from '../tntWarehouse'
import { claimMenu } from '../claims/UIs/claimMenu'

/**
 * Opens faction menu
 * 
 * @param {Player} player 
 */
export function factionsMenu (player) {
  if (player.getDynamicProperty('fac_name')) {
    factionsMenuMain(player)
  }else {
    factionsMenuNoFac(player)
  }
}

/**
 * opens faction menu for players without a faction
 * 
 * @param {Player} player 
 */
function factionsMenuNoFac (player) {
  new ChestFormData('large')
    .title('§cFaction')
    .button(4, '§fFactions Menu', ['§7This is where you can join or create a faction'], 'textures/items/paper')
    .button(20, 'Create Faction', ['§7Start a new faction'], 'textures/blocks/glass_green')
    .button(22, 'Leader Boards', ['§7View the top factions'], 'textures/blocks/glass_blue')
    .button(24, 'Join Faction', ['§7Join an existing faction'], 'textures/blocks/glass_red')
    .button(45, 'Back', [], 'textures/items/arrow')
    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'x_______x',
      'x_______x',
      'x_______x',
      '_xxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 20:
        promptCreateFac(player)
        break
      case 24:
        promptDeleteFac(player)
        break
      case 45:
        MainMenuManager.init(player)
        break
    }
  })
}

/**
 * opens faction menu for players with a faction
 * 
 * @param {Player} player 
 */
function factionsMenuMain (player) {
  const facInfo = getFacInfo(player)
  new ChestFormData('large')
    .title('§cFaction')
    .button(4, '§cFaction Menu', ['§7This is where you can manage your faction'], 'textures/items/paper')
    .button(13, `§g§l${facInfo.name}`, ['§7Your Faction'], 'textures/blocks/gold_block')
    .button(20, '§bFaction Homes', ["§7Warp to your faction's homes"], 'textures/blocks/glass_green')
    .button(21, '§mFaction Vault', ["§7Access your faction's vault"], 'textures/blocks/glass_gray')
    .button(22, '§aClaims', ['§7Claim land for your faction'], 'textures/blocks/glass_blue')
    .button(23, '§sManage Faction', ['§7Manage your faction'], 'textures/blocks/glass_orange')
    .button(24, '§cLeave Faction', ['§7Leave your faction'], 'textures/blocks/glass_red')
    .button(29, '§aFaction Leaderboards', ['§7View faction leaderboards'], 'textures/blocks/glass_lime')
    .button(45, 'Back', [], 'textures/items/arrow')
    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'x_______x',
      'x_______x',
      'x_______x',
      '_xxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 20:
        homesMenu(player)
        break
      case 21:
        vaultMenu(player)
        break
      case 22:
        claimMenu(player) // TODO: Implement claims menu (and claims functionality in general)
        break
      case 23:
        manageFactionMenu(player) // TODO: create inviting and kicking from faction
        break
      case 24:
        promptLeaveFaction(player)
        break
      case 29:
        factionLeaderboardsMenu(player) // TODO: Implement faction leaderboards
        break
      case 45:
        MainMenuManager.init(player)
        break
    }
  })
}

/**
 * Opens the faction homes menu
 * 
 * @param {Player} player 
 */
function homesMenu (player) {
  const facInfo = JSON.parse(world.getDynamicProperty(`fac_data_${player.getDynamicProperty('fac_name')}`))
  const homes = facInfo.homes

  new ChestFormData('large')
    .title('§bFaction Homes')
    .button(4, '§fFaction Homes', ['§7This is where you can warp to your shared faction homes'], 'textures/items/paper')
    .button(20, `§aWarp ${homes.home1.name}`, [`§7(${homes.home1.pos.x}, ${homes.home1.pos.y}, ${homes.home1.pos.z})`], 'textures/blocks/glass_green')
    .button(21, `§aWarp ${homes.home2.name}`, [`§7(${homes.home2.pos.x}, ${homes.home2.pos.y}, ${homes.home2.pos.z})`], 'textures/blocks/glass_green')
    .button(22, `§aWarp ${homes.home3.name}`, [`§7(${homes.home3.pos.x}, ${homes.home3.pos.y}, ${homes.home3.pos.z})`], 'textures/blocks/glass_green')
    .button(23, `§aWarp ${homes.home4.name}`, [`§7(${homes.home4.pos.x}, ${homes.home4.pos.y}, ${homes.home4.pos.z})`], 'textures/blocks/glass_green')
    .button(24, `§aWarp ${homes.home5.name}`, [`§7(${homes.home5.pos.x}, ${homes.home5.pos.y}, ${homes.home5.pos.z})`], 'textures/blocks/glass_green')
    .button(29, `§aManage: ${homes.home1.name}`, [`§7Rename or replace this home`], 'textures/blocks/glass_red')
    .button(30, `§aManage: ${homes.home2.name}`, [`§7Rename or replace this home`], 'textures/blocks/glass_red')
    .button(31, `§aManage: ${homes.home3.name}`, [`§7Rename or replace this home`], 'textures/blocks/glass_red')
    .button(32, `§aManage: ${homes.home4.name}`, [`§7Rename or replace this home`], 'textures/blocks/glass_red')
    .button(33, `§aManage: ${homes.home5.name}`, [`§7Rename or replace this home`], 'textures/blocks/glass_red')
    .button(45, 'Back', [], 'textures/items/arrow')
    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'x_______x',
      'x_______x',
      'x_______x',
      '_xxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 20:
        teleportPlayer(player, homes.home1.pos)
        break
      case 21:
        teleportPlayer(player, homes.home2.pos)
        break
      case 22:
        teleportPlayer(player, homes.home3.pos)
        break
      case 23:
        teleportPlayer(player, homes.home4.pos)
        break
      case 24:
        teleportPlayer(player, homes.home5.pos)
        break
      case 29:
        promptManageFactionHome(player, homes.home1)
        break
      case 30:
        promptManageFactionHome(player, homes.home2)
        break
      case 31:
        promptManageFactionHome(player, homes.home3)
        break
      case 32:
        promptManageFactionHome(player, homes.home4)
        break
      case 33:
        promptManageFactionHome(player, homes.home5)
        break
      case 45:
        factionsMenu(player)
    }
  })
}

/**
 * Opens the faction management menu
 * 
 * @param {Player} player 
 */
function manageFactionMenu (player) {
  new ChestFormData('large')
    .title('§sManage Faction')
    .button(4, '§sManage Faction', ['§7This is where you can manage your faction'], 'textures/items/paper')
    .button(20, '§aInvite players', ['§7Invite players to your faction'], 'textures/blocks/glass_green')
    .button(21, '§aKick players', ['§7Kick players from your faction'], 'textures/blocks/glass_orange')
    .button(22, '§aRename Faction', ['§7Rename your faction'], 'textures/blocks/glass_blue')
    .button(23, '§aDisband Faction', ['§7Disband your faction'], 'textures/blocks/glass_red')
    .button(45, 'Back', [], 'textures/items/arrow')
    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'x_______x',
      'x_______x',
      'x_______x',
      '_xxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 20:
        promptInvitePlayers(player)
        break
      case 21:
        promptKickPlayers(player)
        break
      case 22:
        promptRenameFaction(player)
        break
      case 23:
        promptDisbandFac(player)
        break
      case 45:
        factionsMenu(player)
        break
    }
  })
}

/**
 * Opens the faction vault menu ------------------------------------------------- NOT DONE -----------------------------------
 *
 * @param {Player} player
 */
function vaultMenu (player) {
  const facInfo = getFacInfo(player)
  const bank = facInfo.bank
  const tnt = facInfo.tnt

  new ChestFormData('large')
    .title('§gFaction Vault')
    .button(4, '§gFaction Vault', ["§7This is where you can access your faction's riches"], 'textures/items/paper')
    .button(11, `§gFaction Bank §a[${formatMoney(bank)}]`, ["§7This is where you can store your faction's money"], 'textures/blocks/glass_green')
    .button(15, `§cTNT Warehouse §a[${formatNumber(tnt)}]`, ["§7This is where you can store your faction's TNT"], 'textures/blocks/tnt_side')
    .button(20, `§aDeposit`, ['§7Deposit money into your faction bank'], 'textures/blocks/wool_colored_green')
    .button(21, `§cWithdraw`, ['§7Withdraw money from your faction bank'], 'textures/blocks/wool_colored_red')
    .button(23, `§aDeposit`, ["§7Deposit money into your faction's TNT warehouse"], 'textures/blocks/wool_colored_green')
    .button(32, `§2Load Dispensers`, ['§7Load dispensers with TNT from your faction warehouse'], 'textures/blocks/dispenser_front_horizontal')
    .button(24, `§cWithdraw`, ["§7Withdraw money from your faction's TNT warehouse"], 'textures/blocks/wool_colored_red')
    .button(33, `§cUnload Dispensers`, ['§7Unload dispensers into your faction warehouse'], 'textures/blocks/dispenser_front_horizontal')
    .button(45, 'Back', [], 'textures/items/arrow')
    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'x_______x',
      'x_______x',
      'x_______x',
      '_xxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 20:
        promptDepositBank(player)
        break
      case 21:
        promptWithdrawBank(player)
        break
      case 23:
        promptDepositTnt(player)
        break
      case 24:
        promptWithdrawTnt(player)
        break
      case 32:
        promptLoadDispensers(player) // TODO: Load dispensers option
        break
      case 33:
        promptUnloadDispensers(player)
        break
      case 45:
        factionsMenu(player)
        break
    }
  })
}

function promptLoadDispensers (player) {
  new ModalFormData()
    .title('§dLoad Dispensers')
    .textField('§7Enter max amount of tnt per dispenser', 'Amount (max 576)')
    .textField('§7Enter radius to load', 'Radius (max 20)')
    .show(player).then(res => {
    if (res.canceled) return

    const amount = parseInt(res.formValues[0])
    if (isNaN(amount) || amount <= 0) {
      player.sendMessage('§cInvalid amount.')
      return
    }
    if (amount > 576) {
      player.sendMessage('§cCannot load more than 576 tnt per dispenser.')
      return
    }

    const radius = parseInt(res.formValues[1])
    if (isNaN(radius) || radius <= 0) {
      player.sendMessage('§cInvalid radius.')
      return
    }
    if (radius > 20) {
      player.sendMessage('§cRadius too large. Max is 20.')
      return
    }

    const addedTnt = loadDispensers(player, amount, radius)
  })
}

function promptUnloadDispensers (player) {
  new ModalFormData()
    .title('§dLoad Dispensers')
    .textField('§7Enter radius to unload', 'Radius (max 20)')
    .show(player).then(res => {
    if (res.canceled) return

    const radius = parseInt(res.formValues[0])
    if (isNaN(radius) || radius <= 0) {
      player.sendMessage('§cInvalid radius.')
      return
    }
    if (radius > 20) {
      player.sendMessage('§cRadius too large. Max is 20.')
      return
    }

    unloadDispensers(player, radius)
  })
}

/**
 * Prompts the deposit bank screen
 *
 * @param {Player} player
 */
function promptDepositBank (player) {
  new ModalFormData()
    .title('§dDeposit Money')
    .textField('§7Enter amount to deposit', 'Amount (or all)')
    .show(player).then(res => {
    if (res.canceled) return

    if (res.formValues[0].toLowerCase() === 'all') {
      depositBank(player, 'all')
      return
    }

    const amount = parseInt(res.formValues[0])
    if (isNaN(amount) || amount <= 0) {
      player.sendMessage('§cInvalid amount.')
      return
    }

    depositBank(player, amount)
  })
}

/**
 * Prompts the withdraw bank screen
 *
 * @param {Player} player
 */
function promptWithdrawBank (player) {
  new ModalFormData()
    .title('§dWithdraw Money')
    .textField('§7Enter amount to withdraw', 'Amount')
    .show(player).then(res => {
    if (res.canceled) return

    if (res.formValues[0].toLowerCase() === 'all') {
      withdrawBank(player, 'all')
      return
    }

    const amount = parseInt(res.formValues[0])
    if (isNaN(amount) || amount <= 0) {
      player.sendMessage('§cInvalid amount.')
      return
    }

    withdrawBank(player, amount)
  })
}

/**
 * Prompts the deposit TNT screen
 *
 * @param {Player} player
 */
function promptDepositTnt (player) {
  new ModalFormData()
    .title('§dDeposit TNT')
    .textField('§7Enter amount to deposit', 'Amount (or all)')
    .show(player).then(res => {
    if (res.canceled) return

    if (res.formValues[0].toLowerCase() === 'all') {
      depositTnt(player, 'all')
      return
    }

    const amount = parseInt(res.formValues[0])
    if (isNaN(amount) || amount <= 0) {
      player.sendMessage('§cInvalid amount.')
      return
    }

    depositTnt(player, amount)
  })
}

/**
 * Prompts the withdraw TNT screen
 *
 * @param {Player} player
 */
function promptWithdrawTnt (player) {
  new ModalFormData()
    .title('§dWithdraw TNT')
    .textField('§7Enter amount to withdraw', 'Amount (or all)')
    .show(player).then(res => {
    if (res.canceled) return

    if (res.formValues[0].toLowerCase() === 'all') {
      withdrawTnt(player, 'all')
      return
    }

    const amount = parseInt(res.formValues[0])
    if (isNaN(amount) || amount <= 0) {
      player.sendMessage('§cInvalid amount.')
      return
    }

    withdrawTnt(player, amount)
  })
}

/**
 * Prompts the create faction screen
 * 
 * @param {Player} player 
 */
function promptCreateFac (player) {
  new ModalFormData()
    .title('§dCreate Faction')
    .textField('§7Enter Factions name', 'Faction name')
    .show(player).then(res => {
    if (res.canceled) return

    const facName = res.formValues[0].trim().toUpperCase()
    const playerId = player.name.toLowerCase()

    // player already in faction
    if (player.getDynamicProperty('fac_name')) {
      player.sendMessage('§cAlready in faction')
      return
    }

    // validate faction name
    if (!facName) return player.sendMessage('§cInvalid faction name.')
    if (world.getDynamicProperty(`fac_data_${facName}`)) return player.sendMessage('§cFaction name already taken.')

    // create faction
    createFaction(player, facName)
  })
}

/**
 * Prompts the disband faction screen
 * 
 * @param {Player} player 
 */
function promptDisbandFac (player) {
  new MessageFormData()
    .title('§c§lDisband Faction')
    .body('§fAre you sure you want to §l§o§cdisband§r §fyour faction?')
    .button1('§aYes')
    .button2('§cCancel')
    .show(player).then(res => {
    if (res.selection === 0) {
      // clicked disband

      const facName = player.getDynamicProperty('fac_name')
      const playerId = player.name.toLowerCase()
      const facInfo = JSON.parse(world.getDynamicProperty(`fac_data_${facName}`))

      // player not in a faction
      if (!facName) {
        player.sendMessage('§cYou are not in a faction')
        return
      }
      // player not faction leader
      else if (facInfo.leader != player.name) {
        player.sendMessage('§cOnly the faction leader can disband the faction')
        return
      }

      // update data
      world.setDynamicProperty(`fac_data_${facName}`, undefined)
      world.setDynamicProperty(`fac_${playerId}`, undefined)
      player.setDynamicProperty('fac_name', undefined)

      // message
      player.sendMessage(`§aFaction §b${facName} §adisbanded successfully!`)
    }
    // clicked cancel
    return
  })
}

/**
 * Prompts the leave faction screen
 * 
 * @param {Player} player 
 */
function promptLeaveFaction (player) {
  new MessageFormData()
    .title('§c§lLeave Faction')
    .body('§fAre you sure you want to §l§o§cleave§r §fyour faction?')
    .button1('§aYes')
    .button2('§cCancel')
    .show(player).then(res => {
    if (res.selection === 0) {
      // clicked leave
      leaveFaction(player)
    }
    // clicked cancel
    return
  })
}

/**
 * Prompts the manage faction home screen
 *
 * @param {Player} player
 * @param {Object} home
 */
function promptManageFactionHome (player, home) {
  new ModalFormData()
    .title(`§dManage Faction Home: ${home.name}`)
    .textField('§7Enter new home name', 'New home name', {
      defaultValue: home.name
    })
    .toggle('§7Set home position to your current location?')
    .show(player).then(res => {
    if (res.canceled) return

    const newHomeName = res.formValues[0].trim()
    const updatePos = res.formValues[1]
    if (!newHomeName) return player.sendMessage('§cInvalid home name.')

    updateFactionHome(player, home, newHomeName, updatePos)
  })
}
