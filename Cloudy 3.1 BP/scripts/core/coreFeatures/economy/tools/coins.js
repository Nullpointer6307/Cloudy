import { addScore, setScore, getScore } from '../../../../utility/scoreboards'

/**
 * Adds money to a player
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function addCoins (player, amount) {
  addScore(player, 'coins', amount)
}

/**
 * Removes money from a player
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function removeCoins (player, amount) {
  addScore(player, 'coins', -amount)
}

/**
 * Gets the current money of a player
 * 
 * @param {Player} player 
 * @returns {number}
 */
export function getCoins (player) {
  return getScore(player, 'coins')
}

export function setCoins (player, amount) {
  setScore(player, 'coins', amount)
}

export function formatCoins (amount) {
  const abs = Math.abs(amount)
  if (abs < 1000) return '✳' + amount.toString()
  const units = [
    { value: 1e15, symbol: 'Qu' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' }
  ]
  for (const unit of units) {
    if (abs >= unit.value) {
      return '✳' + (amount / unit.value).toFixed(2) + unit.symbol
    }
  }
  return '✳' + amount.toString()
}
