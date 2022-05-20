class WrappedEvents {
  #isCallEvents = false; // `true` means the events of the extrinsic, while `false` means the events of the call
  #offset = 0;
  #events = [];

  constructor(events = [], offset, isCallEvents) {
    this.#events = events;
    this.#offset = offset;
    this.#isCallEvents = isCallEvents;
  }

  get events() {
    return this.#events;
  }

  get offset() {
    return this.#offset;
  }

  eventSort(index = 0) {
    return this.#offset + index;
  }

  get wrapped() {
    return this.#isCallEvents;
  }
}

module.exports = {
  WrappedEvents,
}
