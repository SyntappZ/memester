import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex, axios);

export default new Vuex.Store({
  state: {
    images: [],
    tags: [],
    page: 1,
    homePage: 1,
    imageType: "images",
    getFavorites: false,
    backToHome: false,
    aboutPageOpen: false,
    searching: ""
  },
  mutations: {
    incrementPage(state, page) {
      page == "home" ? state.homePage++ : state.page++;
    },

    imageType(state, type) {
      state.imageType = type;
    },
    changeHomePage(state, page) {
      state.changeHomePage = page;
    },
    getFavorites(state) {
      state.getFavorites = true;
    },
    backToHome(state) {
      state.backToHome = true;
    },
    aboutPage(state) {
      state.aboutPageOpen = true;
    }
  },
  getters: {
    imageType: state => state.imageType,
    changeHomePage: state => state.changeHomePage,
    getFavorites: state => state.getFavorites,
    backToHome: state => state.backToHome,
    aboutPage: state => state.aboutPageOpen,
   

  },
  actions: {
    incrementPage(context, page) {
      context.commit("incrementPage", page);
    },
    imageType({ commit }, type) {
      commit("imageType", type);
    },

    getFavorites({ commit }) {
      commit("getFavorites");
    },
    backToHome({ commit }) {
      commit("backToHome");
    },
    aboutPage({ commit }) {
      commit("aboutPage");
    },

    loadInfo(context) {
      return new Promise((resolve, reject) => {
        let memeArray = [];
        let done = 1;
        let memes;
        let page = context.state.homePage;

        if (this.state.imageType == "images") {
          memes = [
            "memes",
            "funny",
            "like_a_boss",
            "dank_memes",
            "nailed_it",
            "florida_man"
          ];
        } else {
          memes = [
            "memes",
            "funny",
            "like_a_boss",
            "dank_memes",
            "nailed_it",
            "florida_man",
            "gifs"
          ];
        }

        let len = memes.length;

        for (let i = 0; i < len; i++) {
          axios({
            method: "get",
            url: `https://api.imgur.com/3/gallery/t/${memes[i]}/top/all/${page}`,
            headers: {
              Authorization: "Client-ID 7711bc539737c6e"
            }
          })
            .then(response => {
              let all = [];
              let images = response.data.data.items;

              images.forEach(x => {
                let url, size;
                let reg = new RegExp(/.png$|.jpg$|.gif$|.mp4$/);

                let linkCheck = reg.test(x.link);
                if (linkCheck) {
                  url = x.link;
                  size = x.size;
                } else {
                  if (x.images.length == 0) {
                    url = "none";
                  } else {
                    url = x.images[0].link;
                    size = x.images[0].size;
                  }
                }

                let tags = x.tags.map(x => x.name);

                let loader = require("../loading.svg");
                if (url !== "none") {
                  all.push({
                    array: "tags",
                    id: x.id,
                    desc: x.title,
                    image: url,
                    link: {
                      src: url,
                      loading: loader
                    },
                    tags: tags,
                    height: x.cover_height,
                    favorite: false,
                    size: size
                  });
                }
              });

              let noMP4;

              if (this.state.imageType == "images") {
                noMP4 = all
                  .filter(x => !x.link.src.match(/mp4$|gif$/))
                  .filter(x => x.height < 1000);
              } else {
                noMP4 = all
                  .filter(x => x.link.src.match(/gif$/))
                  .filter(x => x.height < 1000)
                  .filter(x => x.size < 3000000);
              }

              noMP4.forEach(x => {
                memeArray.push(x);
              });

              if (done == len) {
                resolve(memeArray);
              }
              done++;
            })
            .catch(function(error) {
              reject(error);
            });
        }
      });
    },

    tagImages(context, tagArr) {
      return new Promise((resolve, reject) => {
        let tagArray = [];
        let len = tagArr.length;
        let page = context.state.page;

        let done = 1;
        for (let i = 0; i < tagArr.length; i++) {
          axios({
            method: "get",
            url: `https://api.imgur.com/3/gallery/t/${tagArr[i]}//time/all/${page}`,
            headers: {
              Authorization: "Client-ID 7711bc539737c6e"
            }
          })
            .then(response => {
              let images = response.data.data.items;
              let all = [];

              images.forEach(x => {
                let url = "";
                let size = "";
                let reg = new RegExp(/.png$|.jpg$|.gif$|.mp4$/);

                let linkCheck = reg.test(x.link);
                if (linkCheck) {
                  url = x.link;
                  size = x.size;
                } else {
                  url = x.images[0].link;
                  size = x.images[0].size;
                }

                let tags = x.tags.map(x => x.name);

                let loader = require("../loading.svg");

                all.push({
                  array: "tags",
                  id: x.id,
                  desc: x.title,
                  image: url,
                  link: {
                    src: url,
                    loading: loader
                  },
                  tags: tags,
                  height: x.cover_height,
                  favorite: false,
                  size: size
                });
              });

              let noMP4;

              if (this.state.imageType == "images") {
                noMP4 = all
                  .filter(x => !x.link.src.match(/mp4$|gif$/))
                  .filter(x => x.height < 1000);
              } else {
                noMP4 = all
                  .filter(x => x.link.src.match(/gif$/))
                  .filter(x => x.height < 1000)
                  .filter(x => x.size < 3000000);
              }

              noMP4.forEach(x => {
                tagArray.push(x);
              });

              if (done == len) {
                if (tagArray.length > 0) {
                  resolve(tagArray);
                } else {
                  resolve(null);
                }
              }
              done++;
            })
            .catch(function(error) {
              reject(error);
            });
        }
      });
    },

    singleTag(context, tag) {
      return new Promise((resolve, reject) => {
        let page = context.state.page;

        axios({
          method: "get",
          url: `https://api.imgur.com/3/gallery/t/${tag}//time/all/${page}`,
          headers: {
            Authorization: "Client-ID 7711bc539737c6e"
          }
        })
          .then(response => {
            let images = response.data.data.items;
            let all = [];

            images.forEach(x => {
              let url = "";
              let size = "";
              let reg = new RegExp(/.png$|.jpg$|.gif$|.mp4$/);

              let linkCheck = reg.test(x.link);
              if (linkCheck) {
                url = x.link;
                size = x.size;
              } else {
                url = x.images[0].link;
                size = x.images[0].size;
              }

              let tags = x.tags.map(x => x.name);

              let loader = require("../loading.svg");

              all.push({
                array: "tags",
                id: x.id,
                desc: x.title,
                image: url,
                link: {
                  src: url,
                  loading: loader
                },
                tags: tags,
                height: x.cover_height,
                favorite: false,
                size: size
              });
            });

            let noMP4;

            if (this.state.imageType == "images") {
              noMP4 = all
                .filter(x => !x.link.src.match(/mp4$|gif$/))
                .filter(x => x.height < 1000);
            } else {
              noMP4 = all
                .filter(x => x.link.src.match(/gif$/))
                .filter(x => x.height < 1000)
                .filter(x => x.size < 4000000);
            }

            resolve(noMP4);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },

    imageSearch(context, name) {
      return new Promise((resolve, reject) => {
        let page = context.state.homePage;
        context.state.searching = name;
        let all = [];

        axios({
          method: "get",
          url: `https://api.imgur.com/3/gallery/search/top/${page}?q=` + name,
          headers: {
            Authorization: "Client-ID 7711bc539737c6e"
          }
        })
          .then(response => {
            let images = response.data.data;

            images.forEach(x => {
              let reg = new RegExp(/.png$|.jpg$|.gif$|.mp4$/);
              let arr = "";
              let size;
              let linkCheck = reg.test(x.link);
              if (linkCheck) {
                arr = x.link;
                size = x.size;
              } else {
                arr = x.images[0].link;
                size = x.images[0].size;
              }
              let height = x.cover_height;
              if (x.cover_height == undefined) {
                height = x.height;
              }
              let tags = x.tags.map(x => x.name);

              let loader = require("../loading.svg");

              all.push({
                array: "search",
                id: x.id,
                desc: x.title,
                image: arr,
                link: {
                  src: arr,
                  loading: loader
                },
                tags: tags,
                height: height,
                favorite: false,
                page: page,
                size: size
              });
            });

            let noMP4;
            if (this.state.imageType == "images") {
              noMP4 = all
                .filter(x => !x.link.src.match(/mp4$|gif$/))
                .filter(x => x.height < 1000);
            } else {
              noMP4 = all
                .filter(x => x.link.src.match(/gif$/))
                .filter(x => x.height < 1000)
                .filter(x => x.size < 4000000);
            }
            resolve(noMP4);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    }
  }
});
