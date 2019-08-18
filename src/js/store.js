import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { async } from "q";

Vue.use(Vuex, axios);

export default new Vuex.Store({
  state: {
    images: [],
    tags: [],
    page: 1,
    
  },
  mutations: {
    incrementPage(state) {
      state.page++
      
    }
  },
  actions: {
    incrementPage(context) {
      context.commit('incrementPage')
      
    },
    loadInfo(context, page) {
      
      
      return new Promise((resolve, reject) => {
        let memeArray = [];
        let done = 0;
        let memes = ['memes', 'funny', 'gifs', 'dank_memes', 'funny_gifs']
        let len = memes.length;
        for (let i = 0; i < memes.length; i++) {
          axios({
            method: "get",
            url: `https://api.imgur.com/3/gallery/t/${memes[i]}/top/all/${page}`,
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
                  array: "memes",
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
              let noMP4 = all
                .filter(x => !x.link.src.match(/mp4$/))
                .filter(x => x.height < 1000);

              noMP4.forEach(x => {
                memeArray.push(x);

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
                resolve(memeArray);
              }
            });
        }
      });
    },

    tagImages(context, tagArr) {
      return new Promise((resolve, reject) => {
        let tagArray = [];
        let len = tagArr.length;
        let page = context.state.page
        
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
              let noMP4 = all
                .filter(x => !x.link.src.match(/mp4$/))
                .filter(x => x.height < 1000);

              
                
              noMP4.forEach((x, i) => {
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
        let page = context.state.page
        let tagArray = [];
        let len = 1;
        let done = 0;
        console.log(page)
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
                  page: page,
                });
              });

              let tagsAdded = 0;
              let noMP4 = all
                .filter(x => !x.link.src.match(/mp4$/))
                .filter(x => x.height < 1000);

              
                
              noMP4.forEach((x, i) => {
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
    }

    // imageSearch({ commit }, name) {
    //   for (let i = 1; i <= 3; i++) {
    //     axios({
    //       method: "get",
    //       url:
    //         `https://api.imgur.com/3/gallery/search/top/${i}?q=` +
    //         this.input,
    //       headers: {
    //         Authorization: "Client-ID 7711bc539737c6e"
    //       }
    //     })
    //       .then(response => {
    //         let images = response.data.data;

    //         images.forEach(x => {
    //           let url = "";

    //           let reg = new RegExp(/.png$|.jpg$|.gif$/);

    //           let linkCheck = reg.test(x.link);
    //           if (linkCheck) {
    //             url = x.link;
    //           } else {
    //             url = x.images[0].link;
    //           }

    //           let tags = x.tags.map(x => x.name);

    //           this.all.push({
    //             id: x.id,
    //             desc: x.title,
    //             title: this.tempTitle[0],
    //             link: url,
    //             tags: tags,
    //             loaded: false
    //           });
    //         });
    //       })
    //       .then(() => {
    //         this.splitArrays(this.n++);
    //       })
    //       .catch(function(error) {
    //         console.log(error);
    //       });
    //     }

    // }
  }
});
