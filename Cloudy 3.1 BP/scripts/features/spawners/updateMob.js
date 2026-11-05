import { Entity } from '@minecraft/server'

/**
 * Handles entity hit entity events for spawner mobs.
 *
 * @param {Entity} mob
 */
export function updateMob (mob) {
  const score = mob.getDynamicProperty('stack')
  const name = mob.typeId
    .replace('minecraft:', '')
    .replace('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  // if (score >= 1000) {
    //   mob.nameTag = `§l§d[MAX] §g=${name}=`
    //   setScore(mob, 'stack', 1000)
    // } else if (score >= 900) {
    //   mob.nameTag = `§l§d[${score}x] §g=${name}=`
    // } else if (score >= 800) {
    //   mob.nameTag = `§l§5[${score}x] §g=${name}=`
    // } else if (score >= 700) {
    //   mob.nameTag = `§l§1[${score}x] §g=${name}=`
    // } else if (score >= 600) {
    //   mob.nameTag = `§l§b[${score}x] §g=${name}=`
    // } else if (score >= 500) {
    //   mob.nameTag = `§l§s[${score}x] §g=${name}=`
    // } else if (score >= 400) {
    //   mob.nameTag = `§l§a[${score}x] §g=${name}=`
    // } else if (score >= 300) {
    //   mob.nameTag = `§l§e[${score}x] §g=${name}=`
    // } else if (score >= 200) {
    //   mob.nameTag = `§l§6[${score}x] §g=${name}=`
    // } else if (score >= 100) {
    //   mob.nameTag = `§l§c[${score}x] §g=${name}=`
    // } else {
    //   mob.nameTag = `§l§4[${score}x] §g=${name}=`
    // }

  if (score >= 1000) {
    mob.nameTag = `§l§d[MAX] §g=${name}=`
    mob.setDynamicProperty('stack', 1000)
  }else {
    mob.nameTag = `§l§b[${score}x] §g=${name}=`
  }
}
