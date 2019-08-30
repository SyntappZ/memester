<template>
  <f7-page class="bg-color-primary" name="home">
    <!-- Top Navbar -->
    <f7-navbar class="nav bg-color-primary text-color-green" :sliding="false" large>
      <f7-nav-title class="title bg-color-primary text-color-green nav-title" sliding>{{ title }}</f7-nav-title>
      <f7-nav-right class="bg-color-primary text-color-green">
        <f7-link
          class="text-color-green"
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="right"
        ></f7-link>
      </f7-nav-right>
      <f7-nav-title-large class="bg-color-primary text-color-green nav-title" sliding>{{ title }}</f7-nav-title-large>
    </f7-navbar>
    <!-- Toolbar-->

    <!-- Page content-->
    <f7-searchbar
      id="searchBar"
      :custom-search="true"
      @change="input = $event.target.value"
      @submit="getInfo"
      disable-link-text="Cancel"
      placeholder="Search Images"
      :clear-button="true"
    ></f7-searchbar>
    <images :searchInput="searchQuery" />
  </f7-page>
</template>

<script>
// popup-open="#my-popup"
import images from "../components/Images";
import cordovaApp from "../js/cordova-app.js";
import routes from "../js/routes.js";
import $$ from 'Dom7'
export default {
  components: {
    images
  },
  data() {
    return {
      title: "memester",
      input: "",
      searchQuery: ""
    };
  },
  methods: {
    getInfo() {
    this.searchQuery = this.input;
     let searchBar = $$('#searchBar')[0].f7Searchbar
     searchBar.clear()
     searchBar.disable()
    }
  }
};
</script>

<style scoped>
.nav-title {
  text-transform: uppercase;
  font-family: "Barriecito", cursive;
}
</style>