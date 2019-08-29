<template>
  <f7-app :params="f7params" class="bg-color-primary">
    <!-- Status bar overlay for fullscreen mode-->
    <f7-statusbar></f7-statusbar>

    <!-- Right panel with reveal effect-->
    <f7-panel right reveal theme-dark 
     
      
    >
      <f7-view>
        <f7-page>
          <f7-navbar title="Menu"></f7-navbar>
          
            <f7-block-title class="text-color-green">Options</f7-block-title>
            <f7-list>
             
              <f7-list-item class="panel-close" title="Images" @click="showImages"></f7-list-item>
              <f7-list-item class="panel-close" title="Gifs" @click="showGifs"></f7-list-item>
            </f7-list>
        
            
            <f7-block-title class="text-color-green">Other</f7-block-title>
            <f7-list>
               <f7-list-item title="Favorites" link="#"></f7-list-item>
              <f7-list-item title="Information" link="#"></f7-list-item>
              <f7-list-item title="Contact" link="#"></f7-list-item>
            
            </f7-list>
          
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script>
import cordovaApp from "../js/cordova-app.js";
import routes from "../js/routes.js";

export default {
  data() {
    return {
      // Framework7 Parameters
      f7params: {
        id: "share.framework7.master", // App bundle ID
        name: "share-master", // App name
        theme: "auto", // Automatic theme detection
        // App root data
        data() {
          return {
            
           
          };
        },

        // App routes
        routes: routes,

        // Input settings
        input: {
          scrollIntoViewOnFocus: this.$device.cordova && !this.$device.electron,
          scrollIntoViewCentered: this.$device.cordova && !this.$device.electron
        },
        // Cordova Statusbar settings
        statusbar: {
          overlay: (this.$device.cordova && this.$device.ios) || "auto",
          iosOverlaysWebView: true,
          androidOverlaysWebView: false
        }
      },

      // Login screen data
     
    };
  },
  methods: {
    alertLoginData() {
      this.$f7.dialog.alert(
        "Username: " + this.username + "<br>Password: " + this.password
      );
    },
    showGifs() {
      
      this.$store.dispatch("imageType", 'gifs')
    },
    showImages() {
      this.$store.dispatch("imageType", 'images')
    
    }
    
    
  },
  mounted() {
    this.$f7ready(f7 => {
      // Init cordova APIs (see cordova-app.js)
      if (f7.device.cordova) {
        cordovaApp.init(f7);
      }

      // Call F7 APIs here
    });
  }
};
</script>

<style>
.bg-color-primary {
  --f7-theme-color-bg-color: var(--f7-theme-color);
}
.bg-color-green {
  --f7-theme-color-bg-color: rgb(8, 218, 8);
}

.text-color-white {
  --f7-theme-color-text-color: #fff;
}
.text-color-green {
  --f7-theme-color-text-color: rgb(8, 218, 8);
}
.text-color-black {
  --f7-theme-color-text-color: #333;
}

:root {
  --f7-theme-color: rgb(34, 34, 34);
}
</style>