import { createStore } from 'vuex'

const MUTATIONS = {
  INC_FLASK_COUNT: 'INC_FLASK_COUNT',
  DEC_FLASK_COUNT: 'DEC_FLASK_COUNT',
  INC_LAYERS_PER_FLASK: 'INC_LAYERS_PER_FLASK',
  DEC_LAYERS_PER_FLASK: 'DEC_LAYERS_PER_FLASK',
  NULL_WIN_COUNT: 'NULL_WIN_COUNT',
  INC_WIN_COUNT: 'INC_WIN_COUNT',
  SET_RECORD: 'SET_RECORD',
  CHANGE_MODE: 'CHANGE_MODE',

  SET_FLASKS: 'SET_FLASKS',
  SET_SELECTED_FLASK: 'SET_SELECTED_FLASK',
  CHANGE_SHOWWIN_MESSAGE: 'CHANGE_SHOWWIN_MESSAGE',
  SET_BLOCKED_FLASK: 'SET_BLOCKED_FLASK',
  SET_WIN_RESULT: 'SET_WIN_RESULT'
}

export default createStore({
  state () {
    return {
      flaskCount: 5,
      layersPerFlask: 4,
      winCount: 0,
      countRecords: 10,
      records: [],
      hardMode: false,

      flasks: [],
      selectedFlaskIndex: null,
      showWinMessage: false,
      blockedFlaskIndex: null,
      colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
      winResult: false
    }
  },
  getters: {
    getFlaskCount: (state) => state.flaskCount,
    getLayersPerFlask: (state) => state.layersPerFlask,
    getWinCount: (state) => state.winCount,
    getRecords: (state) => state.records,
    getHardMode: (state) => state.hardMode,

    getFlasks: (state) => state.flasks,
    getSelectedFlask: (state) => state.selectedFlaskIndex,
    getShowWinMessage: (state) => state.showWinMessage,
    getBlockedFlask: (state) => state.blockedFlaskIndex,
    getColors: (state) => state.colors,
    getCurPercent: (state) => Math.floor(100 / state.layersPerFlask),
    getFullVolume: (state) => Math.floor(100 / state.layersPerFlask) * state.layersPerFlask,
    getWinResult: (state) => state.winResult,

    getAvailableSpace: (state, getters) => (flask) => {
      const curPercent = getters.getCurPercent
      return flask.layers.length === 0 ?
        curPercent * state.layersPerFlask :
        curPercent * state.layersPerFlask -
        flask.layers.reduce((sum, layer) => sum + layer.percent, 0)
    },
    checkWin: (state, getters) => {
      const curPercent = getters.getCurPercent
      return state.flasks.every(flask =>
        flask.layers.length === 0 ||
        flask.layers.length === 1 &&
        flask.layers[0].percent === curPercent * state.layersPerFlask
      )
    }
  },
  mutations: {
    [MUTATIONS.INC_FLASK_COUNT]: (state) => {
      state.flaskCount += 1
    },
    [MUTATIONS.DEC_FLASK_COUNT]: (state) => {
      state.flaskCount -= 1
    },
    [MUTATIONS.INC_LAYERS_PER_FLASK]: (state) => {
      state.layersPerFlask += 1
    },
    [MUTATIONS.DEC_LAYERS_PER_FLASK]: (state) => {
      state.layersPerFlask -= 1
    },
    [MUTATIONS.NULL_WIN_COUNT]: (state) => {
      state.winCount = 0
    },
    [MUTATIONS.INC_WIN_COUNT]: (state) => {
      state.winCount += 1
    },
    [MUTATIONS.SET_RECORD]: (state, value) => {
      state.records.push(value)
      state.records.sort((a, b) => a - b)
      if (state.records.length > state.countRecords)
        state.records.pop()
    },
    [MUTATIONS.CHANGE_MODE]: (state) => {
      state.hardMode = !state.hardMode
    },

    [MUTATIONS.SET_FLASKS]: (state, flasks) => {
      state.flasks = flasks
    },
    [MUTATIONS.SET_SELECTED_FLASK]: (state, index) => {
      state.selectedFlaskIndex = index
    },
    [MUTATIONS.CHANGE_SHOWWIN_MESSAGE]: (state) => {
      state.showWinMessage = !state.showWinMessage
    },
    [MUTATIONS.SET_BLOCKED_FLASK]: (state, index) => {
      state.blockedFlaskIndex = index
    },
    [MUTATIONS.SET_WIN_RESULT]: (state, value) => {
      state.winResult = value
    }
  },
  actions: {
    setRecord: (store, value) => {
      store.commit(MUTATIONS.SET_RECORD, value)
    },
    newGame: (store) => {
      store.commit(MUTATIONS.SET_SELECTED_FLASK, null)
      const flasks = generateRandomFlasks(store.state, store.getters.getCurPercent)
      store.commit(MUTATIONS.SET_FLASKS, flasks)
      if (store.state.hardMode) {
        store.dispatch('blockRandomFlask')
      }
    },
    blockRandomFlask: (store) => {
      const getAvailableSpace = store.getters.getAvailableSpace
      const flasks = store.state.flasks
      const flaskCount = store.state.flaskCount
      const fullVolume = store.getters.getFullVolume
      
      let blockedIndex
      do {
        blockedIndex = Math.floor(Math.random() * flaskCount)
      } while (getAvailableSpace(flasks[blockedIndex]) === fullVolume)
      
      store.commit(MUTATIONS.SET_BLOCKED_FLASK, blockedIndex)
    },
    pour: (store, {fromIndex, toIndex}) => {
      const fromFlask = store.state.flasks[fromIndex]
      const toFlask = store.state.flasks[toIndex]

      if (fromFlask.layers.length === 0) return

      const topLayer = fromFlask.layers[fromFlask.layers.length - 1]

      const availableSpace = store.getters.getAvailableSpace(toFlask)
      if (availableSpace === 0) {
        return
      }
      
      if (availableSpace < store.getters.getCurPercent * store.state.layersPerFlask) {
        const toTopLayer = toFlask.layers[toFlask.layers.length - 1]
        if (toTopLayer.color !== topLayer.color) {
          return
        }
      }

      const pourAmount = Math.min(topLayer.percent, availableSpace)

      if (topLayer.percent === pourAmount) {
        fromFlask.layers.pop()
      } else {
        topLayer.percent -= pourAmount
      }

      if (toFlask.layers.length === 0) {
        toFlask.layers.push({
          color: topLayer.color,
          percent: pourAmount
        })
      } else {
        const toTopLayer = toFlask.layers[toFlask.layers.length - 1]
        toTopLayer.percent += pourAmount
      }

      if (store.state.hardMode) {
        store.dispatch('blockRandomFlask')
      }

      store.commit('SET_WIN_RESULT', store.getters.checkWin)
    }
  }
})

function fillRandomFlask(flask, mapColors, mapCounts, state, curPercent) {
  const layers = []
  let fullness = 0
  while (fullness < state.layersPerFlask) {
    let colorIndex = Math.floor(Math.random() * mapColors.length)
    let rndParts = mapCounts[colorIndex] != 1 ?
      Math.min(
      Math.floor(Math.random() * (mapCounts[colorIndex] - 1) + 1),
      state.layersPerFlask - fullness
    ) : 1

    if (layers.length > 0 &&
      layers[layers.length - 1].color === mapColors[colorIndex]) {
        layers[layers.length - 1].percent += curPercent * rndParts
      } else {
        layers.push({
          color: mapColors[colorIndex],
          percent: curPercent * rndParts
        })
      }
      fullness += rndParts
      mapCounts[colorIndex] -= rndParts
      if (mapCounts[colorIndex] === 0) {
        mapColors.splice(colorIndex, 1)
        mapCounts.splice(colorIndex, 1)
      }
  }
  flask.layers = layers
}

function lastFluskLayers(mapColors, mapCounts, curPercent) {
  const layers = []
  for (let i = 0; i < mapColors.length; i++) {
    layers.push({
      color: mapColors[i],
      percent: curPercent * mapCounts[i]
    })
  }

  let i = 1
  while (i < layers.length) {
    if (layers[i].color === layers[i - 1].color) {
      layers[i - 1].percent += layers[i].percent
      layers.splice(i, 1)
    } else {
      i += 1
    }
  }
  return layers
}

function generateRandomFlasks(state, curPercent) {
  let fullFlasks = state.flaskCount <= 5 ? state.flaskCount - 1 :
    (state.flaskCount <= 11 ? state.flaskCount - 2 : state.flaskCount - 3)

  const mapColors = Array(fullFlasks).fill().map(() =>
    state.colors[Math.floor(Math.random() * state.colors.length)]
  )
  const mapCounts = Array(fullFlasks).fill().map(() => state.layersPerFlask)

  const newFlasks = Array(fullFlasks - 1).fill().map(() => {
    const flask = { layers: [] }
    fillRandomFlask(flask, mapColors, mapCounts, state, curPercent)
    return flask
  })
  
  newFlasks.push( {layers: lastFluskLayers(mapColors, mapCounts, curPercent)} )

  newFlasks.push(
    ...Array(state.flaskCount - fullFlasks).fill().map(() => ({layers: []}))
  )

  return newFlasks
}