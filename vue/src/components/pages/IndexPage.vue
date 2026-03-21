<template>
  <div class="home">
    <h1>Water Sort Puzzle</h1>
    <div class="flasks-container">
      <Flask
        v-for="(flask, index) in flasks"
        :key="index"
        :layers="flask.layers"
        :is-selected="isFlaskSelected(index)"
        :flask-index="index"
        :is-freezed="isFreezed(index)"
        @flask-click="(index) => handleFlaskClick(index)"
      />
    </div>
    <div class="win-counter">
      Серия побед: {{ winCount }}
    </div>
    <div>
      <button @click="() => resetGame()" class="reset-btn">Сброс</button>
    </div>
    <div>
      Время: 
      <Timer ref="timer" />
    </div>
    <RouterLink :to="{ name: $routes.SETTING }">
      Настройки
    </RouterLink>
    <RouterLink :to="{ name: $routes.RECORD }">
      Рекорды
    </RouterLink>
    <div v-if="showWinMessage" class="win-message">
      Победа
    </div>
  </div>
</template>

<script>
import Flask from '@/components/Flask.vue'
import Timer from '@/components/Timer.vue'

export default {
  name: 'IndexPage',
  components: {
    Flask,
    Timer
  },
  computed: {
    winCount() {
      return this.$store.getters.getWinCount
    },
    isHardMode() {
      return this.$store.getters.getHardMode
    },
    selectedFlaskIndex() {
      return this.$store.getters.getSelectedFlask
    },
    flasks() {
      return this.$store.getters.getFlasks
    },
    showWinMessage() {
      return this.$store.getters.getShowWinMessage
    },
    blockedFlaskIndex() {
      return this.$store.getters.getBlockedFlask
    },
    winResult() {
      return this.$store.getters.getWinResult
    }
  },
  mounted() {
    this.$refs.timer.reset()
    this.$refs.timer.start()
    this.$store.dispatch('newGame')
  },
  methods: {
    handleFlaskClick(index) {
      if (this.isHardMode && this.blockedFlaskIndex === index) {
        return
      }
      if (this.selectedFlaskIndex === null) {
        this.$store.commit('SET_SELECTED_FLASK', index)
        return
      }
      if (this.selectedFlaskIndex === index) {
        this.$store.commit('SET_SELECTED_FLASK', null)
        return
      }
      this.$store.dispatch('pour', {
        fromIndex: this.selectedFlaskIndex,
        toIndex: index
      })
      this.$store.commit('SET_SELECTED_FLASK', null)
      if (this.winResult) {
        this.$refs.timer.stop()
        const time = this.$refs.timer.getTime()
        this.$store.dispatch('setRecord', time)
        this.$store.commit('CHANGE_SHOWWIN_MESSAGE')
        setTimeout(() => {
          this.$store.commit('CHANGE_SHOWWIN_MESSAGE')
          this.$store.dispatch('newGame')
          this.$refs.timer.reset()
          this.$refs.timer.start()
        }, 2000)
        this.$store.commit('INC_WIN_COUNT')
      }
    },
    resetGame() {
      this.$refs.timer.reset()
      this.$refs.timer.start()
      this.$store.dispatch('newGame')
      this.$store.commit('NULL_WIN_COUNT')
    },
    isFlaskSelected(index) {
      return (this.$store.getters.getSelectedFlask === index)
    },
    isFreezed(index) {
      return (this.$store.getters.getBlockedFlask === index)
    },
    
  }
}
</script>

<style lang="scss" scoped>
$btn-color: #36c9ff;
$text-btn-color: #333;
$main-color: gold;

.home {
  text-align: center;
  padding: 20px;
  gap: 15px;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
.flasks-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }
}
.win-message {
  color: $main-color;
  padding: 20px 40px;
  font-size: 32px;
  font-weight: bold;
  z-index: 1000;

  @media (max-width: 768px) {
    font-size: 24px;
    padding: 15px 30px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    padding: 10px 20px;
  }
}
.reset-btn {
  padding: 10px 20px;
  font-size: 16px;
  background: $btn-color;
  color: $text-btn-color;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darken($btn-color, 10%);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
}
.win-counter {
  color: $main-color;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px 12px;
  }
}
</style>