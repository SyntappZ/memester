<template>
  <div class="images text-color-white">
    <div class="wrap">
       
      <masonry :cols="col" :gutter="10">
        <div v-for="(img, index) in images" :key="index">
         
        
          <img v-lazy="img.link" />
         
        </div>
      </masonry>
    </div>
  </div>
</template>

<script>
import cordovaApp from "../js/cordova-app.js";
import { setTimeout } from "timers";

export default {
  components: {},
  data() {
    return {
      images: [],
      col: 2,
     
    };
  },
  mounted() {
    if (window.innerWidth > 600) {
      this.col = 4;
    }
    this.$store.dispatch("loadInfo").then(
      response => {
        this.images = response;
        console.log(response);
      },
      error => {
        console.error(
          "Got nothing from server. Prompt user to check internet connection and try again"
        );
      }
    );
  },
  created() {},
  watch: {}
  
  
};
</script>

<style scoped>
img {
  width: 100%;
  margin: 3px 0;
  border-radius: 5px;
  transition: 1s ease;
}


img[lazy="loading"] {
 opacity: 0.1;

}

img[lazy="loaded"] {
  opacity: 1;
}
.wrap {
  width: 95%;
  margin: 20px auto 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>