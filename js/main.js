var SHA512 = new Hashes.SHA512
var ApiUrl = "/api"
var AdminHash = localStorage.AdminHash
Vue.config.devtools = true
Vue.use(VueRouter)

Vue.prototype.$eventHub = new Vue(); // Global event bus

var db = new PouchDB('wikinota_db');


function CurentTimestamp(){
  var d = new Date();
  var n = d.toISOString();
  return n
}



var filter = function(text, length, clamp){
    clamp = clamp || '...';
    var node = document.createElement('div');
    node.innerHTML = text;
    var content = node.textContent;
    return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter('truncate', filter);

const GetDesktop = {
  name: "GetDesktop",
  data: function() {
    return {
      DATA: "ERROR",
      loading: true
    }
  },
  template: `
  <div>
    <div v-if="loading == false" class="desk">
      <GetDesktopPageTimeCreate :ajson="DATA.Pages"></GetDesktopPageTimeCreate>
      <DeskGeldlog :ajson="DATA"></DeskGeldlog>
    </div>
    <div v-else>
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  `,
  methods: {
    GetPage: function() {
      // POST /someUrl
      this.$http.post(ApiUrl, {
        PWD: AdminHash,
        Method: "Desk",
      }).then(response => {
        // get status
        response.status;

        console.log("API-", response.status, "->", AdminHash);

        // get status text
        response.statusText;

        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        this.tmpjson = JSON.parse(JSON.stringify(response.body));

        this.DATA = this.tmpjson

        for(DATAkey in this.DATA.Geldlog){
          this.DATA.Geldlog[DATAkey].Timecreate = moment(this.DATA.Geldlog[DATAkey].Timecreate).format("hh:mm DD.MM.YY");
        }

        console.log(this.DATA);
        this.loading = false
        return this.DATA




      }, response => {
        // error callback
        console.log("API-ERROR");
      });
    }
  },
  beforeMount() {
    console.log("HAHAHAHAHH");
    this.GetPage()
  }
};

const GetPageByURL = {
  name: "GetPageByURL",
  data: function() {
    return {
      PC: "HAAAXXX",
      loading: true
    }
  },
  props: {
    title1: {
      type: String,
      default: "main"
    },
    title2: {
      type: String,
      default: "main"
    }
  },
  template: `
  <div id="content">
    <div v-if="loading == true">
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else>
      <span class="namespace">{{ PC.Title1 }}</span><router-link class="EditButton" :to="{ name: 'pedit', params: { title1: PC.Title1, title2: PC.Title2 }}"><i class="fa fa-pencil" aria-hidden="true"></i></router-link>
      <h1>{{ PC.Title2 }}</h1>
      <table class="time">
        <tr>
          <td>createt </td>
          <td>{{ PC.Timecreate }}</td>
        </tr>
        <tr>
          <td>lastedit </td>
          <td>{{ PC.Timelastedit }}</td>
        </tr>
        Public: {{PC.Public}}<br>

      </table>
      <div class="GoodReadCSS" v-html="PC.Text1"></div>
      <hr>
      <div>
        Notizen:<br>
        <div class="GoodReadCSS">{{ PC.Text2 }}</div>
      </div>
      <hr>
      Tags:<br>
      {{PC.Tags1}}

    </div>

</div>
  `,
  methods: {
    GetPage: function() {
      // POST /someUrl
      this.$http.post(ApiUrl, {
        PWD: AdminHash,
        Method: "ItemIdRead",
        APP: "page",
        Title1: this.title1,
        Title2: this.title2
      }).then(response => {

        // get status
        response.status;

        console.log("API-", response.status, "->", AdminHash);

        // get status text
        response.statusText;

        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        this.json = JSON.parse(JSON.stringify(response.body));

        this.PC = this.json.DATA[0]
        this.PC.Text1 = marked(this.PC.Text1, {
          sanitize: true
        })

        console.log(this.PC.Title1);
        this.loading = false
        return this.PC




      }, response => {
        // error callback
        console.log("API-ERROR");
      });
    }
  },
  beforeMount() {
    console.log("HAHAHAHAHH");
    this.GetPage()
  }
};


Vue.component("wn-login", {
  data: function() {
    return {
      modalvar: "",
      message: '',
      AdminHash: localStorage.AdminHash
    }
  },
  methods: {
    HashSave: function(message) {
      if (message != "") {
        this.AdminHash = SHA512.hex(message)
        localStorage.AdminHash = this.AdminHash
        AdminHash = this.AdminHash
      }
    },
    LoginChek: function() {
      AdminHash = localStorage.AdminHash
      if (localStorage.AdminHash && localStorage.AdminHash.length) {
        if (localStorage.AdminHash.length == "") {
          this.modalvar = "HashSave"
        }
      } else {
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
      path: '/p/:title1/:title2',
      name: "page",
      component: GetPageByURL,
      props: true
    },
    {
      path: '/p/:title1/:title2/edit',
      name: "pedit",
      component: pEdit,
      props: true
    },
    {
      path: '/newp',
      name: "NewPage",
      component: pEdit,
      props: { new: true }
    },
    {
      path: '/geldlog',
      name: "geldlog",
      component: Geldlog
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
  },
  methods: {},
  beforeMount() {}

})
