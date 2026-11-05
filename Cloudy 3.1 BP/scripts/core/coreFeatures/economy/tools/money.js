import { addScore, setScore, getScore } from '../../../../utility/scoreboards'

/**
 * Adds money to a player
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function addMoney (player, amount) {
  addScore(player, 'money', amount)
}

/**
 * Removes money from a player
 * 
 * @param {Player} player 
 * @param {number} amount 
 * @return {boolean} whether the transaction was successful
 */
export function removeMoney (player, amount) {
  if (getMoney(player) < amount) {
    player.sendMessage(`§cYou do not have enough money!`)
    player.playSound('note.bassattack')
    return false
  }
  addScore(player, 'money', -amount)
  return true
}

/**
 * Gets the current money of a player
 * 
 * @param {Player} player 
 * @returns {number}
 */
export function getMoney (player) {
  return getScore(player, 'money')
}

export function setMoney (player, amount) {
  setScore(player, 'money', amount)
}

export function formatMoney (amount) {
  const abs = Math.abs(amount)
  if (abs < 1000) return '$' + amount.toString()
  const units = [
    { value: 1e15, symbol: 'Qu' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' }
  ]
  for (const unit of units) {
    if (abs >= unit.value) {
      return '$' + (amount / unit.value).toFixed(2) + unit.symbol
    }
  }
  return '$' + amount.toString()
}
