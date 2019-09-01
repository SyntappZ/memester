<template >
  <f7-page
    infinite
    :infinite-distance="1"
    @infinite="loadMoreImages"
    :infinite-preloader="!onFavoritesPage"
    name="home"
    class="images text-color-white"
  >
    <div class="wrap">
      <masonry :cols="col" :gutter="10">
        <div v-for="(img, index) in images" :key="index">
          <img
            v-lazy="img.link"
            @click="getImageData(img.id, img.image, img.desc, img.tags, img.favorite, img.link)"
            popup-open=".my-popup"
          />
        </div>
      </masonry>
    </div>

    <transition name="fade">
      <div class="fab" v-if="homeScrolled" @click="scrollToTop">
        <f7-icon class="i" material="keyboard_arrow_up"></f7-icon>
      </div>
    </transition>
    <!-- <f7-button
      v-show="!onFavoritesPage"
      v-if="images.length > 0"
      flat
      class="btn text-color-white"
      @click="loadMoreImages"
    >Load More</f7-button>-->

    <f7-popup
      class="my-popup"
      :opened="open"
      swipe-to-close="to-bottom"
      @popup:closed="open = false"
    >
      <f7-view>
        <f7-page class="pop" infinite :infinite-distance="1" @infinite="loadMoreTags">
          <f7-icon class="arrowDown" material="arrow_drop_down"></f7-icon>
          <f7-block>
            <div class="title-wrap" id="top">
              <div @click="addToFavorites" class="icon-wrap">
                <f7-icon v-if="isFavorite" material="favorite"></f7-icon>
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
                <button class="tag" @click="tagClicked(tag)" fill>{{ tag }}</button>
              </div>
            </div>
          </f7-block>
          <transition name="fade">
            <div class="fab" v-if="popupScrolled" @click="scrollToTop">
              <f7-icon class="i" material="keyboard_arrow_up"></f7-icon>
            </div>
          </transition>
          <f7-block>
            <div class="images text-color-white">
              <div class="tag-image-wrap">
                <masonry :cols="col" :gutter="10">
                  <div v-for="(img, index) in tagImages" :key="index">
                    <img
                      v-lazy="img.link"
                      @click="getImageData(img.id, img.image, img.desc, img.tags, img.favorite, img.link)"
                    />
                  </div>
                </masonry>
              </div>
              <!-- <f7-row tag="p">
                <f7-col tag="span">
                  <f7-button
                    v-if="tagImages.length > 0"
                    flat
                    class="btn text-color-white"
                    @click="loadMoreTags()"
                  >Load More</f7-button>
                </f7-col>
              </f7-row>-->
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
      link: {},
      arrayType: "memes",
      tagImages: [],
      tagType: "",
      homeScrolled: false,
      popupScrolled: false,
      searchImages: [],
      search: "",
      pageOn: "home",
      favoritesArray: [],
      imageData: {},
      onFavoritesPage: false,
      loaded: false,
      popupImagesLoaded: false
    };
  },

  mounted() {
    this.favoritesArray = localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites"))
      : [];

    this.loadImages();
    let page = $$(".page-content");
    let home = $$(page[2]);
    let popup = $$(page[3]);

    home.on("mouseover", () => {
      this.pageOn = "home";
    });
    popup.on("mouseover", () => {
      this.pageOn = "popup";
    });

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

  methods: {
    scrollToTop() {
      let page = $$(".page-content");
      page.scrollTop(0);
    },

    loadFavorites() {
      this.preloader = false;
      this.images = this.favoritesArray;
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

    addToFavorites() {
      if (this.favorite) {
        let favoriteIDs = this.favoritesArray.map(x => x.id);
        let index = favoriteIDs.indexOf(this.id);
        this.favoritesArray.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(this.favoritesArray));

        this.favorite = false;
      } else {
        this.favorite = true;
        this.imageData = {
          array: "favorites",
          id: this.id,
          desc: this.description,
          image: this.image,
          link: this.link,
          tags: this.tags,
          favorite: true
        };
        this.favoritesArray.push(this.imageData);
        localStorage.setItem("favorites", JSON.stringify(this.favoritesArray));
      }
    },
    loadImages() {
      this.$store.dispatch("loadInfo").then(
        response => {
          if (response) {
            this.loaded = true;
          }
          this.arrayType = response[0].array;
          response = response.sort(() => Math.random() - 0.5);
          response.forEach(x => this.images.push(x));
        },
        error => {
          console.error("Got nothing from server");
        }
      );
      this.loaded = false;
    },
    loadMoreImages() {
      if (this.loaded) {
       this.$store.dispatch("incrementPage", "home");
        if (this.arrayType == "memes" || this.arrayType == "tags") {
          this.loadImages();
        } else {
          this.searchImageMethod(this.search);
        }
      }
      
    },
    getImageData(id, image, desc, tags, favorite, link) {
      let favoriteIDs = this.favoritesArray.map(x => x.id);

      favoriteIDs.forEach(x => {
        if (x == id) {
          favorite = true;
        }
      });

      this.$store.state.page = 1;
      this.open = true;
      this.id = id;
      this.description = desc;
      this.image = image;
      this.tags = tags;
      this.favorite = favorite;
      this.link = link;
      this.getTagImages(this.tags);
      if (this.pageOn == "popup") {
        this.scrollToTop();
      }
    },

    getTagImages(tags) {
      this.tagType = "tags";

      let page = this.$store.state.page;
      console.log(page);
      if (tags.length == 0) {
        tags = [this.searchInput];
      }
      this.$store.dispatch("tagImages", tags).then(
        response => {
          if (response) {
            this.popupImagesLoaded = true;
          }
          if (tags.length > 0) {
            this.arrayType = response[0].array;
            response = response.sort(() => Math.random() - 0.5);
            if (page > 1) {
              
              response.forEach(x => this.tagImages.push(x));
            } else {
              this.tagImages = response;
            }
          }
        },
        error => {
          console.error("Got nothing from server");
        }
      );
      this.popupImagesLoaded = false;
    },
    getSingleTag(tag) {
      this.tagType = "tag";
      let page = this.$store.state.page;

      this.$store.dispatch("singleTag", tag).then(
        response => {
          if (response) {
            this.popupImagesLoaded = true;
          }

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
      this.popupImagesLoaded = false;
    },
    tagClicked(tag) {
      this.$store.state.page = 1;
      this.getSingleTag(tag);
    },
    loadMoreTags() {
      if (this.popupImagesLoaded) {
        this.$store.dispatch("incrementPage", "popup");
        if (this.tagType == "tags") {
          this.getTagImages(this.tags);
        } else {
          this.getSingleTag(this.tag);
        }
      }
    },

    searchImageMethod(query) {
      
      let page = this.$store.state.homePage;
      this.search = query;
      this.$store.dispatch("imageSearch", query).then(
        response => {
          if (response) {
            this.loaded = true;
          }
          this.arrayType = response[0].array;
          if (page > 1) {
            response.forEach(x => this.images.push(x));
          } else {
            this.images = response;
          }
          console.log(this.arrayType)
        },
        error => {
          console.error("Got nothing from server");
        }
      );
      this.loaded = false;
    }
  },

  watch: {
    imageType(newVal, oldVal) {
      if (newVal) {
        this.$store.state.homePage = 1;
        this.images = [];
        this.loadImages();
      }
    },
    searchInput(newVal, oldVal) {
      if (newVal) {
        this.$store.state.homePage = 1;
        this.searchImageMethod(newVal);
        this.scrollToTop();
      }
    },
    changeHomePage(newVal, oldVal) {
      if (newVal == "favorites") {
        this.loadFavorites();
        this.onFavoritesPage = true;
      } else {
        this.images = [];
        this.$store.state.homePage = 1;
        this.loadImages();
        this.onFavoritesPage = false;
      }
    }
  },
  computed: {
    ...mapGetters(["imageType", "changeHomePage"]),

    isFavorite() {
      return this.favorite;
    }
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
.fab {
  background-color: #0aaf0a;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  position: fixed;
  bottom: 25px;
  right: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fab .i {
  font-size: 35px;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pop {
  color: #08da08;
  background: rgb(32, 32, 32);
  letter-spacing: 1px;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
}
.arrowDown {
  margin: 0 auto;
  display: block;
  width: 40px;
  font-size: 40px;
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