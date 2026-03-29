<template>
  <div class="timer">
    {{formattedTime}}
  </div>
</template>

<script>
export default {
  name: 'Timer',
  data() {
    return {
      seconds: 0,
      interval: null
    }
  },
  computed: {
    formattedTime() {
      const mins = Math.floor(this.seconds / 60)
      const secs = this.seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  },
  mounted() {
    this.start()
  },
  methods: {
    start() {
      if (this.interval) clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.seconds++
      }, 1000)
    },
    stop() {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    },
    reset() {
      this.seconds = 0
    },
    getTime() {
      return this.seconds
    }
  }
}
</script>

<style scoped lang="scss">
$main-color: gold;

.timer {
  font-size: 18px;
  font-weight: bold;
  color: $main-color;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
  margin: 10px auto;
  font-family: monospace;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px 12px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 4px 10px;
  }

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba($main-color, 0.3);
  }
}
</style>