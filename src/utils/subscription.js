export class SubscriptionQueue {
  constructor() {
    this.subscribers = [];
  }

  subscribe(f) {
    this.subscribers.push(f);
  }

  consume(...params) {
    this.subscribers.forEach((f) => f(...params));
    this.subscribers = [];
  }
}
