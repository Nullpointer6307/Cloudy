import { world, system } from "@minecraft/server";

export const BeforeEventManager = {
    // contains function for each event
    handlers: {
        startup: []
    },

    // sets up the events
    init() {
        // template
        // world.beforeEvents.itemUse.subscribe(ev => {
        //     for (const fn of this.handlers.itemUse) fn(ev);
        // });

        //blockComponents
        system.beforeEvents.startup.subscribe((event) => {
            for (const func of this.handlers.startup) func(event)
        })
    },

    // adds functions to be called when events triggers
    register(eventType, func) {
        this.handlers[eventType]?.push(func);
    }
};