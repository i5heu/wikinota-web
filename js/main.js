var SHA512 = new Hashes.SHA512
var ApiUrl = "/api"
var MultiApiUrl = "/multiapi"
var UserName = localStorage.UserName
var PwdHash = localStorage.PwdHash
Vue.config.devtools = true
Vue.use(VueRouter)

Vue.prototype.$eventHub = new Vue(); // Global event bus

var db = new PouchDB('wikinota_db');

Vue.filter('truncate', filter);

function CurentTimestamp() {
  var d = new Date();
  var n = d.toISOString();
  return n
}



Vue.directive('focus', {
  inserted: function(el) {
    el.focus()
  }
})


var filter = function(text, length, clamp) {
  clamp = clamp || '...';
  var node = document.createElement('div');
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};




Vue.component("wn-login", {
  data: function() {
    return {
      modalvar: "",
      username_log: "",
      pwd_log: '',
      UserHash: localStorage.UserHash,
      PwdHash: localStorage.PwdHash

    }
  },
  methods: {
    HashSave: function(username_log,pwd_log) {
      if (pwd_log != "") {
        this.pwd_log = SHA512.hex(pwd_log)
        localStorage.PwdHash = this.pwd_log
        PwdHash = this.pwd_log

        localStorage.UserName = this.username_log
        UserName = this.username_log

        location.reload();
      }
    },
    LoginChek: function() {
      if (localStorage.PwdHash && localStorage.PwdHash.length) {
        if (localStorage.PwdHash.length == "") {
          this.modalvar = "HashSave"
          console.log("LoginData is NOT there");
        }
      } else {
        console.log("LoginData is NOT there");
        this.modalvar = "HashSave"
      }

      if (localStorage.UserName && localStorage.UserName.length) {
        if (localStorage.UserName.length == "") {
          this.modalvar = "HashSave"
          console.log("LoginData is NOT there");
        }
      } else {
        console.log("LoginData is NOT there");
        this.modalvar = "HashSave"
      }

    },
    CheckModalvar: function() {
      if (this.modalvar.length != 0) {
        return true
      } else {
        return false
      }

    }
  },
  beforeMount() {
    this.LoginChek()
  }
})


Vue.component("wn-menue", {
  data: function() {
    return {}
  },
  methods: {
    test: function() {}
  },
  beforeMount() {}
})



const router = new VueRouter({
  routes: [
    // dynamische Segmente beginnen mit Doppelpunkt
    {
      path: '/',
      name: "home",
      component: GetDesktop,
    },
    {
      path: '/h/:section',
      name: "namespace",
      component: Search,
      props: true
    },
    {
      path: '/p/:path',
      name: "page",
      component: GetPageByURL,
      props: true
    },
    {
      path: '/p/:path/edit',
      name: "pedit",
      component: pEdit,
      props: true
    },
    {
      path: '/newp',
      name: "NewPage",
      component: pEdit,
      props: {
        new: true
      }
    },
    // {
    //   path: '/geldlog',
    //   name: "geldlog",
    //   component: Geldlog
    // },
    {
      path: '/delete',
      name: "delete",
      component: DeleteManager
    },
    {
      path: '/s/:searchterm',
      name: "search",
      component: Search,
      props: true
    }
  ]
})


var app = new Vue({
  el: "#root",
  router: router,
  components: {
    login: 'wn-login'
  },
  data: {
    menue: false,
    PageContent: ""
  }
})
