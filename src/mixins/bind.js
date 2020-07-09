export default function bindValue(name, type) {
  const mixin = {
    props: {
      value: {
        type,
        required: true,
      },
    },
    computed: {},
  };

  mixin.computed[name] = {
    get() {
      return this.value;
    },
    set(value) {
      this.$emit('input', value);
    },
  };

  return mixin;
}
