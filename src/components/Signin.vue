<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="mx-auto"        
        fluid
      >
       
            <v-card class="mx-auto" max-width="500">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="mdi-account"
                    name="email"
                    label="Email"
                    id="email"
                    type="email"
                    required
                    :rules="emailRules"
                    v-model="email"
                  />

                  <v-text-field
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    id="password"
                    type="password"
                    required
                    :rules="passwordRules"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" :disabled="submission_disabled" 
              @click="log_in">Login</v-btn>
              </v-card-actions>
            </v-card>
         
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const apis = require("@/resources/apis")
const moment = require('moment')

  export default {
    props: {
      source: String,
    },

  data() {
    return {
      email: "",
      password: "",
      valid: true,
      emailRules: [
        email => !!email || "Email is required",
        email =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) ||
          "Email must be valid"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          password.length >= 8 || "Password should be at least 8 characters"
      ],
      loading: false,
      error: null,
      timeout: 4000,
      snackbar: false
    };
  },

  methods: {
    log_in() {
      let user_creds = {
        username: this.email,
        password: this.password
      }

      this.loading = true
      apis.auth.login(user_creds)
        .then(response => {
          //console.log(response)
          this.$store.commit('set_user', response.user)
          this.$store.commit('set_token', response.access_token)
          let auth_token = this.$store.getters.auth_token
          apis.update_jwt(auth_token)
          let promise = Promise.resolve()                        
        })
        .catch(error => {
          console.log(error)
          this.error = error
          this.snackbar = true
        })
        .finally(this.loading = false)
    }
  },

  computed: {
    submission_disabled() {
      return this.loading || !this.valid
    }
  },

  }
</script>