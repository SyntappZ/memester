<template>
  <div class="images text-color-white">
   

    <div class="img-container" v-masonry transition-duration="0.3s" item-selector=".item">
      <div v-masonry-tile class="item" v-for="img in images" :key="img.id">
        <img :src="img.link" class="lazyload" />
      </div>
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
     
    };
  },
  created() {
    this.$store.dispatch("loadInfo");
    setTimeout(() => {
      this.images = this.$store.state.images;
    }, 200);
  }
};
</script>

<style scoped>
.img-container {
  width: 100%;

  
}
.item {
  width: 50%;
  box-sizing: border-box;
  padding: 0 5px;
}
.item img {
  max-width: 100%;
  border-radius: 5px;
}
</style>