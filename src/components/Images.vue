<template >
  <div class="images text-color-white">
    <div class="wrap">
      <masonry :cols="col" :gutter="10">
        <div v-for="(img, index) in images" :key="index">
          <img
            v-lazy="img.link"
            @click="getImageData(img.id, img.image, img.desc, img.tags)"
            popup-open=".my-popup"
          />
        </div>
      </masonry>
    </div>
    <f7-button flat class="btn text-color-white" @click="loadMoreImages">Load More</f7-button>

    <f7-popup
      class="my-popup"
      :opened="open"
      swipe-to-close="to-bottom"
      @popup:closed="open = false"
    >
      <f7-view>
        <f7-page class="pop">
          <f7-block>
            <div class="title-wrap">
              <div class="icon-wrap">
                <f7-icon v-if="favorite" right material="favoriter"></f7-icon>
                <f7-icon v-else @click="favorite = true" material="favorite_border"></f7-icon>
              </div>
              <h1>memester</h1>
            </div>

            
          </f7-block>

          <f7-block>
            <f7-block-header class="text-color-white">{{ description }}</f7-block-header>
            <div class="image-wrap">
              <img class="chosenImage" :src="image" alt />
            </div>
          </f7-block>
          
          <f7-block>
            <f7-row>
              <f7-col>
                <f7-button color="green" outline>share</f7-button>
              </f7-col>
            </f7-row>
          </f7-block>

          <f7-block>
            <div v-if="tags.length > 0" class="tag-wrap">
              <div class="btn-wrap" v-for="(tag , i) in tags" :key="i">
                <button class="tag" fill>{{ tag }}</button>
              </div>
            </div>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>
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
      i: 2,
      open: false,
      description: "",
      image: "",
      tags: [],
      favorite: false
    };
  },
  mounted() {
    this.loadImages(1);

    if (window.innerWidth > 600) {
      this.col = 4;
    }
  },
  created() {},
  methods: {
    getImageData(id, image, desc, tags) {
      this.open = true;
      this.description = desc;
      this.image = image;
      this.tags = tags;
    },
    loadMoreImages() {
      this.loadImages(this.i);
      this.i++;
    },
    closePopUp() {
      this.open = false;
    },

    loadImages(page) {
      this.$store.dispatch("loadInfo", page).then(
        response => {
          response.forEach(x => this.images.push(x));
        },
        error => {
          console.error("Got nothing from server");
        }
      );
    }
  },
  watch: {}
};
</script>

<style scoped>
.image-wrap {
  margin: auto;
}
img {
  width: 100%;
  margin: 3px 0;
  border-radius: 5px;
  transition: 1s ease;
}
.pop {
  color: rgb(8, 218, 8);
  background: rgb(32, 32, 32);
  letter-spacing: 1px;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
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
.title-wrap {
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-direction: row-reverse;
}
.title-wrap h1 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: "Barriecito", cursive;
}
.icon-wrap {
  width: 40px;
  height: 40px;
  border: rgb(8, 218, 8) 2px solid;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  margin: 10px 0;
}
.tag-wrap {
  display: flex;
  overflow-x: auto;
}
.btn-wrap {
  margin: 0 2px;
}
.chosenImage {
 border-radius: 7px;
}
.tag {
  color: #000;
  padding: 10px;
  background: rgb(8, 218, 8);
  border: none;
  border-radius: 10px;
  text-transform: capitalize;
  letter-spacing: 1px;
  font-weight: 700;
}
.tag:focus {
  outline:none;
}
</style>