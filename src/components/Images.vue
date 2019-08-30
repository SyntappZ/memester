<template >
  <f7-page name="home" class="images text-color-white">
    <div class="wrap">
      <masonry :cols="col" :gutter="10">
        <div v-for="(img, index) in images" :key="index">
          <img
            v-lazy="img.link"
            @click="getImageData(img.id, img.image, img.desc, img.tags, img.favorite)"
            popup-open=".my-popup"
          />
        </div>
      </masonry>
    </div>

    <f7-fab
      v-if="homeScrolled"
      position="right-bottom"
      @click="scrollToTop"
      slot="fixed"
      color="green"
    >
      <f7-icon material="keyboard_arrow_up"></f7-icon>
    </f7-fab>

    <f7-button
      v-if="images.length > 0"
      flat
      class="btn text-color-white"
      @click="loadMoreImages"
    >Load More</f7-button>

    <f7-popup
      class="my-popup"
      :opened="open"
      swipe-to-close="to-bottom"
      @popup:closed="open = false"
    >
      <f7-view>
        <f7-page class="pop">
          
         <f7-icon class="arrowDown" material="arrow_drop_down"></f7-icon>
          <f7-block>
            <div class="title-wrap" id="top">
              <div @click="addToFavorites" class="icon-wrap">
                <f7-icon v-if="favorite == true" material="favorite"></f7-icon>
                <f7-icon v-else material="favorite_border"></f7-icon>
              </div>
              <h1 class="meme-title">memester</h1>
            </div>
          </f7-block>

          <f7-block>
            <f7-block-header class="text-color-white">{{ description }}</f7-block-header>
            <div class="image-wrap">
              <img class="chosenImage" :src="image" />
            </div>
          </f7-block>

          <f7-block>
            <f7-row>
              <f7-col>
                <f7-button @click="shareImage" color="green" outline>share</f7-button>
              </f7-col>
            </f7-row>
          </f7-block>

          <f7-block>
            <div v-if="tags.length > 0" class="tag-wrap">
              <div class="btn-wrap" v-for="(tag , i) in tags" :key="i">
                <button class="tag" @click="pageOne(tag)" fill>{{ tag }}</button>
              </div>
            </div>
          </f7-block>

          <f7-fab
            v-if="popupScrolled"
            position="right-bottom"
            slot="fixed"
            @click="scrollToTop"
            color="green"
          >
            <f7-icon material="keyboard_arrow_up"></f7-icon>
          </f7-fab>

          <f7-block>
            <div class="images text-color-white">
              <div class="tag-image-wrap">
                <masonry :cols="col" :gutter="10">
                  <div v-for="(img, index) in tagImages" :key="index">
                    <img
                      v-lazy="img.link"
                      @click="getImageData(img.id, img.image, img.desc, img.tags, img.favorite)"
                    />
                  </div>
                </masonry>
              </div>

              <f7-button
                v-if="tagImages.length > 0"
                flat
                class="btn text-color-white"
                @click="loadMoreTags()"
              >Load More</f7-button>
            </div>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>
  </f7-page>
</template>

<script>
import cordovaApp from "../js/cordova-app.js";
import { setTimeout } from "timers";
import { mapGetters } from "vuex";
import $$ from "Dom7";
export default {
  components: {},
  props: ["searchInput"],
  data() {
    return {
      images: [],
      col: 2,
      i: 2,
      t: 2,
      open: false,
      description: "",
      image: "",
      tags: [],
      favorite: "",
      tag: "",
      arrayType: "memes",
      tagImages: [],
      tagType: "",
      homeScrolled: false,
      popupScrolled: false,
      searchImages: [],
      search: "",
      pageOn: 'home'
    };
  },
  created() {},
  mounted() {
    this.loadImages(1);
    let page = $$(".page-content");
    let home = $$(page[2]);
    let popup = $$(page[3]);

    home.on('mouseover', () => {
      this.pageOn = 'home'
    })
    popup.on('mouseover', () => {
      this.pageOn = 'popup'
    })

    page.on("scroll", () => {
      if (home.scrollTop() > 1000) {
        this.homeScrolled = true;
      } else {
        this.homeScrolled = false;
      }
      if (popup.scrollTop() > 1000) {
        this.popupScrolled = true;
      } else {
        this.popupScrolled = false;
      }
    });

    if (window.innerWidth > 600) {
      this.col = 4;
    }
  },
  created() {},
  methods: {
    getImageData(id, image, desc, tags, favorite) {
      this.$store.state.page = 1;
      this.open = true;
      this.description = desc;
      this.image = image;
      this.tags = tags;
      this.favorite = favorite;
      this.getTagImages(this.tags);
      if(this.pageOn == 'popup') {
        this.scrollToTop()
      }
      
    },
    scrollToTop() {
      let page = $$(".page-content");
      page.scrollTop(0);
    },
    addToFavorites() {},

    loadMoreTags() {
      this.$store.dispatch("incrementPage");
      if (this.tagType == "tags") {
        this.getTagImages(this.tags);
      } else {
        this.getSingleTag(this.tag);
      }
    },
    loadMoreImages() {
      if (this.arrayType == "memes" || this.arrayType == "tags") {
        this.loadImages(this.i);
        this.i++;
      } else {
        this.$store.dispatch("incrementPage");
        this.searchImageMethod(this.search);
      }
    },
    closePopUp() {
      this.open = false;
    },
    shareImage() {
      var options = {
        files: [this.image]
      };

      var onSuccess = function(result) {
        console.log("Share completed? " + result.completed);
        console.log("Shared to app: " + result.app);
      };

      var onError = function(msg) {
        console.log("Sharing failed with message: " + msg);
      };

      window.plugins.socialsharing.shareWithOptions(
        options,
        onSuccess,
        onError
      );
    },

    loadImages(page) {
      this.$store.dispatch("loadInfo", page).then(
        response => {
          this.arrayType = response[0].array;
          response = response.sort(() => Math.random() - 0.5);
          response.forEach(x => this.images.push(x));
        },
        error => {
          console.error("Got nothing from server");
        }
      );
    },
    pageOne(tag) {
      this.tagType = "tag";
      this.$store.state.page = 1;
      let page = this.$store.state.page;
      this.tag = tag;
      this.$store.dispatch("singleTag", tag).then(
        response => {
          response = response.sort(() => Math.random() - 0.5);
          if (page > 1) {
            response.forEach(x => this.tagImages.push(x));
          } else {
            this.tagImages = response;
          }
        },
        error => {
          console.error("Got nothing from server");
        }
      );
    },

    getTagImages(tags) {
      this.tagImages = [];
      this.tagType = "tags";
      let page = this.$store.state.page;
      this.$store.dispatch("tagImages", tags).then(
        response => {
          if (response.length > 0) {
            
            this.arrayType = response[0].array;
            response = response.sort(() => Math.random() - 0.5);
            if (page > 1) {
              response.forEach(x => this.tagImages.push(x));
            } else {
              this.tagImages = response;
            }
          } else { // carry on from here ===============================================================
            console.log('no tags')
            console.log(this.searchImages);
            this.tagImages = this.searchImages.sort(() => Math.random() - 0.5);
          }
          //=========================================================================
        },
        error => {
          console.error("Got nothing from server");
        }
      );
    },
    getSingleTag(tag) {
      this.tagType = "tag";
      let page = this.$store.state.page;
      this.$store.dispatch("singleTag", tag).then(
        response => {
          this.arrayType = response[0].array;
          response = response.sort(() => Math.random() - 0.5);
          if (page > 1) {
            response.forEach(x => this.tagImages.push(x));
          } else {
            this.tagImages = response;
          }
        },
        error => {
          console.error("Got nothing from server");
        }
      );
    },
    searchImageMethod(query) {
      
      let page = this.$store.state.page;
      this.search = query;
      this.$store.dispatch("imageSearch", query).then(
        response => {
          this.arrayType = response[0].array;
          if (page > 1) {
            response.forEach(x => this.images.push(x));
          } else {
            this.images = response;
          }
          this.scrollToTop()
        },
        error => {
          console.error("Got nothing from server");
        }
      );
    }
  },
  watch: {
    imageType(newVal, oldVal) {
      if (newVal) {
        this.$store.state.page = 1;
        this.images = [];
        this.loadImages(1);
      }
    },
    searchInput(newVal, oldVal) {
      if (newVal) {
        this.$store.state.page = 1;
        this.searchImageMethod(newVal);
      }
    }
  },
  computed: {
    ...mapGetters(["imageType"])
  }
};
</script>

<style scoped>
.image-wrap {
  margin: auto;
}
.images {
  background-color: #222;
}
img {
  width: 100%;
  margin: 3px 0;
  border-radius: 5px;
  transition: 1s ease;
}
/* .fab {
  color: #08da08;
} */
.pop {
  color: #08da08;
  background: rgb(32, 32, 32);
  letter-spacing: 1px;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
}
.arrowDown {
  margin:0 auto;
  display:block;
  width:40px;
  font-size:40px;
}
.pull {
  text-align: center;
  margin: 2px 0 0 0;
  padding: 0;
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
.tag-image-wrap {
  width: 100%;
  margin: 20px auto 0 auto;
}
.title-wrap {
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-direction: row-reverse;
}
.link {
  color: white;
  cursor: pointer;
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
  outline: none;
}
</style>