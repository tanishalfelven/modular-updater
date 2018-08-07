"strict mode";

module.exports = class Emitter {
    constructor() {
        this.Observers = [];
    }

    on(event, func) {
        this.Observers.push({event, func});
    }

    emit(event, ...args) {
        this.Observers.forEach((observer) => {
            if (observer.event === event) {
                observer.func(...args);
            }
        });
    }
}