const keys = {
  40: 'down',
};

/** @param keyListeners - object mapping key string codes to method names */
export function registerKeyListeners(keyListeners) {
  return {
    mounted() {
      document.addEventListener('keydown', this.keyListener);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.keyListener);
    },
    methods: {
      keyListener(e) {
        const keyCode = e.which || e.keyCode;
        const keyMapping = keys[keyCode];
        if (keyMapping) {
          const listenerName = keyListeners[keyMapping];
          if (listenerName) {
            const listener = this[listenerName];
            if (listener) {
              listener.call(this);
            } else {
              console.error(`Key listener ${listenerName} not found in component methods`);
            }
          }
        }
      },
    },
  };
}
