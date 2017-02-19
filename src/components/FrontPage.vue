<template>

  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="0">
        Quasar Framework v{{$q.version}}
      </q-toolbar-title>
    </div>

    <div class="layout-view">
      <div class="layout-padding">
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
        <button class="btn btn-primary" @click="createTask">Add</button>
      </div>
    </div>
  </q-layout>

</template>

<script>
export default {
  data () {
    return {
      text: '',
      db: null,
      tasks: []
    }
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
