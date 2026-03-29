<template>
  <div class="controls">
    <h1>Настройки</h1>
    <div class="control-row">
      Количество колб
      <button @click="() => delFlask()" class="setting-btn">-</button>
      {{ FLASK_COUNT }}
      <button @click="() => addFlask()" class="setting-btn">+</button>
    </div>
    <div class="control-row">
      Количество слоев
      <button @click="() => delLayer()" class="setting-btn">-</button>
      {{ LAYERS_PER_FLASK }}
      <button @click="() => addLayer()" class="setting-btn">+</button>
    </div>
    <div class="control-row">
      Сложный режим
      <button
        @click="() => changeHardMode()"
        :class="['setting-btn', 'hard-mode-btn', { active: isHardMode }]"
      >
        {{ isHardMode ? 'Включен' : 'Выключен' }}
      </button>
    </div>
  </div>
  <RouterLink :to="{ name: $routes.INDEX }">Сохранить</RouterLink>
</template>

<script>
export default {
  name: 'SettingPage',
  computed: {
    FLASK_COUNT() {
      return this.$store.getters.getFlaskCount
    },
    LAYERS_PER_FLASK() {
      return this.$store.getters.getLayersPerFlask
    },
    isHardMode() {
      return this.$store.getters.getHardMode
    }
  },
  methods: {
    addFlask() {
      if (this.FLASK_COUNT < 16) {
        this.$store.commit('INC_FLASK_COUNT')
      }
    },
    delFlask() {
      if (this.FLASK_COUNT > 3) {
        this.$store.commit('DEC_FLASK_COUNT')
      }
    },
    addLayer() {
      if (this.LAYERS_PER_FLASK < 10) {
        this.$store.commit('INC_LAYERS_PER_FLASK')
      }
    },
    delLayer() {
      if (this.LAYERS_PER_FLASK > 3) {
        this.$store.commit('DEC_LAYERS_PER_FLASK')
      }
    },
    changeHardMode() {
      this.$store.commit('CHANGE_MODE')
    }
  }
}
</script>

<style lang="scss" scoped>
$btn-color: #36c9ff;
$btn-color-disactive: #1c7190;
$btn-color-active: #36ff62;
$text-btn-color: #333;
$border-color: #ccc;

.controls {
  text-align: center;
  padding: 20px;
  gap: 15px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 12px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
  }
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 12px 16px;
  border-bottom: 1px solid $border-color;

  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 15px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    gap: 10px;
  }
}

.setting-btn {
  padding: 10px 20px;
  font-size: 20px;
  background: $btn-color;
  color: $text-btn-color;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darken($btn-color, 10%);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 16px;
  }
}

.hard-mode-btn {
  background: $btn-color-disactive;
  transition: all 0.3s ease;

  &.active {
    background: $btn-color-active;

    &:hover {
      background: darken($btn-color-active, 10%);
    }
  }

  &:hover {
    background: lighten($btn-color-disactive, 10%);
  }
}
</style>
