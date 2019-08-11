<template>
<f7-app :params="f7params" class="bg-color-primary">
  <!-- Status bar overlay for fullscreen mode-->
  <f7-statusbar></f7-statusbar>



  <!-- Right panel with reveal effect-->
  <f7-panel right reveal theme-dark>
    <f7-view>
      <f7-page>
        <f7-navbar title="Right Panel"></f7-navbar>
        <f7-block>Right panel content goes here</f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>


  <!-- Your main view, should have "view-main" class -->
  <f7-view main class="safe-areas" url="/"></f7-view>


  <!-- Popup -->
  <f7-popup id="my-popup" swipe-to-close>
    <f7-view>
      <f7-page>
        <f7-navbar title="Popup">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block>
          <p>jeff is my name</p>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-popup>

 
</f7-app>
</template>
<script>
  import cordovaApp from '../js/cordova-app.js';
  import routes from '../js/routes.js';

  export default {
    data() {
      return {
        // Framework7 Parameters
        f7params: {
          id: 'share.framework7.master', // App bundle ID
          name: 'share-master', // App name
          theme: 'auto', // Automatic theme detection
          // App root data
          data: function () {
            return {
              user: {
                firstName: 'John',
                lastName: 'Doe',
              },

            };
          },

          // App routes
          routes: routes,



          // Input settings
          input: {
            scrollIntoViewOnFocus: this.$device.cordova && !this.$device.electron,
            scrollIntoViewCentered: this.$device.cordova && !this.$device.electron,
          },
          // Cordova Statusbar settings
          statusbar: {
            overlay: this.$device.cordova && this.$device.ios || 'auto',
            iosOverlaysWebView: true,
            androidOverlaysWebView: false,
          },
        },

        // Login screen data
        username: '',
        password: '',
      }
    },
    methods: {
      alertLoginData() {
        this.$f7.dialog.alert('Username: ' + this.username + '<br>Password: ' + this.password);
      }
    },
    mounted() {
      this.$f7ready((f7) => {
        // Init cordova APIs (see cordova-app.js)
        if (f7.device.cordova) {
          cordovaApp.init(f7);
        }
        // Call F7 APIs here
      });
    }
  }
</script>

<style>

.text-color-primary {
  --f7-theme-color-text-color: var(--f7-theme-color);
}
.bg-color-primary {
  --f7-theme-color-bg-color: var(--f7-theme-color);
}
.border-color-primary {
  --f7-theme-color-border-color: var(--f7-theme-color);
}
.ripple-color-primary {
  --f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.3);
}

.text-color-secondary {
  --f7-theme-color-text-color: var( --f7-theme-color-shade);
}
.bg-color-secondary {
  --f7-theme-color-bg-color: var( --f7-theme-color-shade);
}
.border-color-secondary {
  --f7-theme-color-border-color: var( --f7-theme-color-shade);
}
.ripple-color-secondary {
  --f7-theme-color-ripple-color: rgba(var( --f7-theme-color-shade), 0.3);
}

.text-color-yel {
  --f7-theme-color-text-color: #EBB11A
}
.bg-color-yel {
  --f7-theme-color-bg-color: #EBB11A
}
.border-color-yel {
  --f7-theme-color-border-color: #EBB11A
}
.ripple-color-yel {
  --f7-theme-color-ripple-color: #EBB11A
}
:root {
  --f7-theme-color: #01213D;
  --f7-theme-color-shade: #046CC9;
  --f7-theme-color-tint: #034A8A;
 
}

</style>