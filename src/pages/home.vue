<template>
  <f7-page  class="bg-color-primary"  name="home">
    <!-- Top Navbar -->
    <f7-navbar class="nav text-color-primary" :sliding="false" large>
    
      <f7-nav-title sliding>{{ title }}</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="right"></f7-link>
      </f7-nav-right>
      <f7-nav-title-large sliding>{{ title }}</f7-nav-title-large>
    </f7-navbar>
    <!-- Toolbar-->
   
    <!-- Page content-->
       <f7-searchbar
  disable-link-text="Cancel"
  placeholder="Search in items"
  :clear-button="true"
></f7-searchbar>
    <images />
  

  </f7-page>
</template>

<script>
// popup-open="#my-popup"
  import images from '../components/Images'
  import cordovaApp from '../js/cordova-app.js';
  import routes from '../js/routes.js';

  export default {
    components: {
      images
    },
    data() {
      return {
        title: 'Share Master'
      }
    },
   

 
    
  }
</script>

<style scoped>
  /* .home {
     background-color:#01213D;
  }
  .nav {
     background-color:#01213D;
  } */
</style>