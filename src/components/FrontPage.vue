<template>

  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="0">
        DoDoList
      </q-toolbar-title>
      <login-button v-bind:fb-app-id="fbappid" v-on:logged-in='handleLogin'></login-button>
    </div>

    <div class="layout-view">
      <div class="layout-padding" v-if="connected">
        <ul>
          <li v-for="task in tasks">
            <label>
              <input type="checkbox" :checked="task.done" @change="setTaskStatus(task, $event.target.checked)" />
              {{ task.title || 'missing title' }}
            </label>
            <button class="btn btn-secondary" @click="deleteTask(task)"><i>delete_forever</i></button>
          </li>
        </ul>
        <input class="form-control" v-model="text" type="text" name="title" placeholder="Thing">
        <button class="btn btn-primary" @click="createTask"><i class="on-left">add</i>Add</button>
        <button class="btn" @click="sync"><i class="on-left">cached</i>Sync<button>
      </div>
    </div>
  </q-layout>

</template>

<script>
import LoginButton from './LoginButton.vue'
import config from '../config'

export default {
  data () {
    return {
      connected: false,
      text: '',
      db: null,
      tasks: [],
      fbappid: config.facebookAppId
    }
  },
  components: {
    LoginButton
  },
  methods: {
    createTask () {
      this.$store.dispatch('createTask', {
        text: this.text
      }).then((res) => {
        this.text = ''
      }).catch(() => {
        console.log('Error in component')
      })
      return false
    },
    deleteTask (task) {
      this.$store.dispatch('deleteTask', { task }).then((res) => {})
    },
    setTaskStatus (task, status) {
      task.done = status
      this.$store.dispatch('updateTask', { task }).then((res) => {})
    },
    sync () {
      this.$store.dispatch('sync').then(() => {
        console.log('synced')
      }).catch((err) => {
        console.log('Error syncing', err)
      })
    },
    handleLogin (info) {
      console.log('handling login', info)
    }
  },
  mounted () {
    this.$store.dispatch('getTasks').then(() => {
      this.tasks = this.$store.state.tasks
    })
  }
}
</script>
<style>
</style>
