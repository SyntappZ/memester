<template>
  <div class="images text-color-white">
    <div class="wrap">
      <masonry :cols="col" :gutter="10">
        <div v-for="(img, index) in images" :key="index">
            <transition name="fade" appear>
            <img
           
           v-lazy="img.link"
          
          
           >
            </transition>
          <!-- <f7-block class="row align-items-stretch text-align-center">
            <f7-col>
              <f7-preloader class="loader" color="red"></f7-preloader>
            </f7-col>
          </f7-block> -->
           
        </div>
      </masonry>
    </div>
  </div>
</template>
//  >
<script>
import cordovaApp from "../js/cordova-app.js";
import { setTimeout } from "timers";

export default {
  components: {},
  data() {
    return {
      images: [],
      col: 2
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
  watch: {},
  //  directives: {
  //   loadedifcomplete(el, binding) {
  //      if (el.complete) {
  //        binding.value.loaded = true;
  //        console.log(binding.value.loaded)
  //      }
  //   }
  // }
};
</script>

<style scoped>
img {
  width: 100%;
  margin: 3px 0;
  border-radius: 5px;
}
.wrap {
  width: 95%;
  margin: 20px auto 0 auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}

</style>