<template>
  <div class="records">
    <h1>Рекорды</h1>
    <div
        v-for="(time, index) in recs"
        :key="index"
        class="records__row"
    >
      {{ index + 1 }}
      <span class="records__time">{{ formatTime(time) }}</span>
    </div>
  </div>
  <RouterLink :to="{ name: $routes.INDEX }">Назад</RouterLink>
</template>

<script>
export default {
  name: 'RecordPage',
  computed: {
    recs() {
      return this.$store.getters.getRecords
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
$main-color: gold;
$border-color: #ccc;

.records {
  text-align: center;
  padding: 20px;
  gap: 15px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  align-items: center;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 400px;
    padding: 8px 16px;
    border-bottom: 1px solid $border-color;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba($main-color, 0.1);
      transform: translateX(5px);
    }

    @media (max-width: 768px) {
      width: 300px;
      gap: 15px;
      padding: 6px 12px;
    }

    @media (max-width: 480px) {
      width: 250px;
      gap: 10px;
      padding: 4px 8px;
    }
  }

  &__time {
    font-size: 18px;
    font-weight: bold;
    color: $main-color;
    font-family: monospace;

    @media (max-width: 768px) {
      font-size: 16px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
}
</style>