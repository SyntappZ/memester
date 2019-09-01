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
    changeHomePage: 'home'

  },
  mutations: {
    incrementPage(state, page) {
      page == 'home' ? state.homePage++ : state.page++
    },
   
    imageType(state, type) {
      state.imageType = type;
      
    },
    changeHomePage(state, page) {
      state.changeHomePage = page
      
    }
    
  },
  getters: {
    imageType: state => state.imageType,
    changeHomePage: state => state.changeHomePage
  },
  actions: {
    incrementPage(context, page) {
      context.commit("incrementPage", page);
    },
    imageType({ commit }, type) {
      commit("imageType", type);
    },
    changeHomePage({ commit }, page) {
      commit('changeHomePage', page)
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
        console.log(page)
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
                  let url
                  let reg = new RegExp(/.png$|.jpg$|.gif$|.mp4$/);

                  let linkCheck = reg.test(x.link);
                  if (linkCheck) {
                    url = x.link;
                    //console.log(url)
                  } else {
                    
                    if(x.images.length == 0) {
                      url = 'none'
                    }else{
                      url = x.images[0].link
                    }
                  
                  }
                      
                    let tags = x.tags.map(x => x.name);

                    let loader = require("../loading.svg");
                    if(url !== 'none') {
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
                        favorite: false
                      });
                    }
             
            
              })
              
              
              
              let noMP4;

              if (this.state.imageType == "images") {
                noMP4 = all
                  .filter(x => !x.link.src.match(/mp4$|gif$/))
                  .filter(x => x.height < 1000);
              } else {
                noMP4 = all
                  .filter(x => x.link.src.match(/gif$/))
                  .filter(x => x.height < 1000);
              }
             
               noMP4.forEach((x, i, a) => {
                memeArray.push(x);
              
              });
              
              
             
          
             if(done == len) {
              
               
             resolve(memeArray)
               
             }
             done++
            })
            .catch(function(error) {
              reject(error);
            })
            
            
        }
      
      });
    },

    tagImages(context, tagArr) {
      return new Promise((resolve, reject) => {
        let tagArray = [];
        let len = tagArr.length;
        let page = context.state.page;
          console.log(page)
        let done = 0;
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

                let reg = new RegExp(/.png$|.jpg$|.gif$|.mp4$/);

                let linkCheck = reg.test(x.link);
                if (linkCheck) {
                  url = x.link;
                } else {
                  url = x.images[0].link;
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
                  favorite: false
                });
              });
             
              let tagsAdded = 0;
              let noMP4;

              if (this.state.imageType == "images") {
                noMP4 = all
                  .filter(x => !x.link.src.match(/mp4$|gif$/))
                  .filter(x => x.height < 1000);
              } else {
                noMP4 = all
                  .filter(x => x.link.src.match(/gif$/))
                  .filter(x => x.height < 1000);
              }

              noMP4.forEach(x => {
                tagArray.push(x);

                tagsAdded++;
              });

              if (tagsAdded == noMP4.length) {
                done++;
              }
            })
            .catch(function(error) {
              reject(error);
            })
            .finally(() => {
              if (done == len) {
                resolve(tagArray);
                
              }
            });
        }
      });
    },

    singleTag(context, tag) {
      return new Promise((resolve, reject) => {
        let page = context.state.page;
        let tagArray = [];
        let len = 1;
        let done = 0;

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

              let reg = new RegExp(/.png$|.jpg$|.gif$|.mp4$/);

              let linkCheck = reg.test(x.link);
              if (linkCheck) {
                url = x.link;
              } else {
                url = x.images[0].link;
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
                page: page
              });
            });

            let tagsAdded = 0;
            let noMP4 = all
              .filter(x => !x.link.src.match(/mp4$|gif$/))
              .filter(x => x.height < 1000);

            noMP4.forEach(x => {
              tagArray.push(x);

              tagsAdded++;
            });

            if (tagsAdded == noMP4.length) {
              done++;
            }
          })
          .catch(function(error) {
            reject(error);
          })
          .finally(() => {
            if (done == len) {
              resolve(tagArray);
            }
          });
      });
    },

    imageSearch(context, name) {
      return new Promise((resolve, reject) => {
        let page = context.state.page;
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
              let linkCheck = reg.test(x.link);
              if (linkCheck) {
                arr = x.link;
              } else {
                arr = x.images[0].link;
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
                page: page
              });
            });

            let noMP4
            if (this.state.imageType == "images") {
              noMP4 = all
                .filter(x => !x.link.src.match(/mp4$|gif$/))
                .filter(x => x.height < 1000);
            } else {
              noMP4 = all
                .filter(x => x.link.src.match(/gif$/))
                .filter(x => x.height < 1000);
            }
            resolve(noMP4)

          })
          .catch(function(error) {
            reject(error);
          });
      });
    }
  }
});
