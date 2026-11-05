import { world } from '@minecraft/server'

export function getScore(target, score) {
    const scoreboard = world.scoreboard;
    const objective = scoreboard.getObjective(score);

    return objective.getScore(target)
}

export function addScore(target, score, value) {
    const scoreboard = world.scoreboard;
    const objective = scoreboard.getObjective(score);

    return objective.addScore(target, value)
}

export function setScore(target, score, value) {
    const scoreboard = world.scoreboard;
    const objective = scoreboard.getObjective(score);

    return objective.setScore(target, value)
}