import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex, axios);

export default new Vuex.Store({
  state: {
    images: []
  },
  mutations: {},
  actions: {
    loadInfo(context, page) {
      return new Promise((resolve, reject) => {
        
        axios({
          method: "get",
          url: `https://api.imgur.com/3/gallery/hot/top/day/${page}`,
          headers: {
            Authorization: "Client-ID 7711bc539737c6e"
          }
        })
          .then(response => {
            let images = response.data.data;
         
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
              let loader = require('../loading.svg')
              all.push({
                id: x.id,
                desc: x.title,
                link: {
                  src: url,
                  loading: loader,
                },
                tags: tags,
                image: url,
                height: x.cover_height
              });
            });
            
           let noMP4 = all.filter(x => !x.link.src.match(/mp4$/)).filter(x => x.height < 1000)
          
            
            resolve(noMP4);
          })
          .catch(function(error) {
            reject(error);
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
