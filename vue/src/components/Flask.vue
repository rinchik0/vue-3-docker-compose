<template>
  <div
    class="flask-container"
    @click="() => onFlaskClick()"
  >
    <div
      class="flask"
      :class="{ selected: isSelected, freezed: isFreezed }"
    >
      <div
        v-for="layer in layers"
        class="liquid"
        :style="{ height: layer.percent + '%', backgroundColor: layer.color }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Flask',
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isFreezed: {
      type: Boolean,
      default: false
    },
    flaskIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    onFlaskClick() {
      this.$emit('flask-click', this.flaskIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
$border-color: #f0f0f0;
$selected-color: gold;
$backcolor: #333;
$freezed-backcolor: #000000;

.flask-container {
  display: inline-block;
  margin: 10px;
  cursor: pointer;

  @media (max-width: 768px) {
    margin: 5px;
  }
}

.flask {
  width: 80px;
  height: 200px;
  border: 3px solid $border-color;
  border-radius: 0 0 30px 30px;
  border-top: none;
  position: relative;
  background-color: $backcolor;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    width: 60px;
    height: 150px;
    border-width: 2px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 125px;
  }

  &.selected {
    border-color: $selected-color;
    box-shadow: 0 0 10px $selected-color;
    transform: scale(1.02);
  }

  &.freezed {
    filter: brightness(0.4);
  }
}

.liquid {
  width: 100%;
  transition: height 0.2s ease;

  @media (max-width: 768px) {
    transition: height 0.15s ease;
  }
}
</style>