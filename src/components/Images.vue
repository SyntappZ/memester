<template>
  <div class="images text-color-white">
    <div class="wrap">
      <masonry :cols="col" :gutter="10">
        <div v-for="(img, index) in images" :key="index">
          <img :src="img.link" alt />
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
}
.wrap {
  width: 95%;
  margin: 20px auto 0 auto;
}
</style>