<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list>
        <v-list-tile avatar v-if="is_logged_in">
          <v-list-item-avatar color="accent">
            <v-icon dark>mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="title">{{ user.name }}</v-list-tile-title>
            <v-list-tile-sub-title>TransArch Solutions</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile avatar v-else>
          <v-list-item-avatar color="accent">
            <v-icon dark>mdi-apps</v-icon>
          </v-list-item-avatar>
          <v-list-tile-content>
            <v-list-tile-sub-title>Not Logged In</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list dense>
      <v-spacer></v-spacer>
      <v-divider></v-divider>
      <v-spacer></v-spacer>
        <template v-for="item in items">
          <v-list-item :key="item.text" :to="item.path" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
        <sup><span class="caption">{{ appVersion }}</span></sup>
      </v-toolbar-title>

      <v-spacer />
    </v-app-bar>
    <v-content>
      <router-view></router-view>
      <!-- <v-container class="fill-height" fluid></v-container> -->
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    dialog: false,
    drawer: null,
    items: [
      { icon: "mdi-account", text: "Sign In", path: "/SignIn" },
      { icon: "mdi-home", text: "Home", path: "/" },
      { icon: "mdi-poll", text: "Landing", path: "/landing" }
    ]
  }),

  computed: {
    appTitle() {
      if (this.is_logged_in) {
        if (this.is_admin) return this.$store.state.appTitle + ": Admin";
        else return this.$store.state.appTitle;
      } else {
        return this.$store.state.appTitle;
      }
    },

    appVersion() {
      return this.$store.state.appVersion
    },

    is_logged_in() {
      return this.$store.getters.is_logged_in;
    },

    user() {
      if (this.is_logged_in) return this.$store.state.user;
      else return null;
    },

  }

};
</script>