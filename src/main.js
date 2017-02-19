// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import Vuex from 'vuex'
import Quasar from 'quasar'
import router from './router'
import Kinto from 'kinto'

Vue.use(Quasar) // Install Quasar Framework
Vue.use(Vuex)

const db = new Kinto()
const tasksCollection = db.collection('tasks')

const store = new Vuex.Store({
  state: {
    tasks: []
  },
  mutations: {
    setTasks (state, payload) {
      state.tasks = payload
    },
    createTask (state, payload) {
      state.tasks.push(payload)
    },
    deleteTask (state, payload) {
      const id = payload.task.id
      const index = state.tasks.findIndex((t) => t.id === id)
      state.tasks.splice(index, 1)
    }
  },
  actions: {
    getTasks (context) {
      console.log('getting tasks...')
      return new Promise((resolve, reject) => {
        tasksCollection.list().then(
          (res) => {
            context.commit('setTasks', res.data)
            resolve()
          }
        ).catch(reject)
      })
    },
    createTask (context, payload) {
      return new Promise((resolve, reject) => {
        tasksCollection.create(
          {
            title: payload.text,
            done: false
          }
        ).then(function (res) {
          context.commit('createTask', res.data)
          resolve(res)
        }).catch(function (err) {
          console.log('Error: ', err)
          reject(err)
        })
      })
    },
    updateTask (context, payload) {
      return new Promise((resolve, reject) => {
        tasksCollection.update(payload.task).then((res) => {
          resolve(res)
        }).catch(
          reject
        )
      })
    },
    deleteTask (context, payload) {
      return new Promise((resolve, reject) => {
        tasksCollection.delete(payload.task.id).then((res) => {
          context.commit('deleteTask', { task: payload.task })
          resolve(res)
        }).catch(
          reject
        )
      })
    }
  }
})

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./App'))
  })
})
