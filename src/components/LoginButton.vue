<template>
  <div class="fb-login">
    <span v-if="name">{{ name }}</span>
    <button v-if="!userid" @click="login()"><i class="on-left">account_box</i>Login with Facebook</button>
    <button v-if="userid" @click="logout()"><i class="on-left">security</i>Logout</button>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import Vue from 'vue'

export default Vue.extend({
  data: function () {
    return {
      userid: null,
      name: null,
      email: null
    }
  },

  props: ['fbAppId'],

  methods: {
    login () {
      const self = this
      FB.login(self.getLoginStatus, {scope: 'email'})
    },
    logout () {
      this.userid = null
      this.email = null
      this.name = null
      LocalStorage.remove('fb-user-id')
      LocalStorage.remove('fb-name')
      LocalStorage.remove('fb-email')
      FB.logout()
    },
    getLoginStatus (resp) {
      const self = this
      console.log('got login status', resp)
      if (resp.status === 'connected') {
        this.userid = resp.authResponse.userID
        FB.api(
          '/me',
          self.setUserInfo,
          {
            fields: 'email,name',
            access_token: resp.authResponse.accessToken
          }
        )   //
      }
    },
    getUserInfo () {
      // offline storage, needed to have info in case we are offline
      const p = LocalStorage.get.item
      return {
        email: p('fb-email'),
        name: p('fb-name'),
        userid: p('fb-user-id')
      }
    },
    setUserInfo (info) {
      this.userid = info.id
      this.name = info.name
      this.email = info.email

      LocalStorage.set('fb-user-id', info.id)
      LocalStorage.set('fb-name', info.name)
      LocalStorage.set('fb-email', info.email)
      this.$emit('logged-in', info)
    },
    fbload (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }
  },

  mounted: function () {
    const self = this

    const info = self.getUserInfo()
    console.log('info', info)
    this.email = info.email
    this.name = info.name
    this.userid = info.userid

    window.fbAsyncInit = function () {
      FB.init({
        appId: self.fbAppId,
        cookie: false,
        xfbml: true,
        version: 'v2.8'
      })
      if (!info.email) FB.getLoginStatus(self.getLoginStatus, 'true')
    }

    this.fbload(document, 'script', 'facebook-jssdk')
  }
})
</script>

<style>
</style>
