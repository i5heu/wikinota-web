Vue.component("wn-search", {
  data: function() {
    return {
      searchOpen: false,
      SearchQery: ""
    }
  },
  methods: {
    SearchEvaluator: function() {
        console.log("Searched:",this.SearchQery);
        router.push({ name: 'search', params: { searchterm: this.SearchQery }})
        this.SearchQery = ""
        this.searchOpen = false

    },
    CheckKeycode: function(e){
      //EVRY HOTKEY IN HERE HAS TO BE DISABLED IN THE created SECTION OF THIS COMPONENT
      if(e.code == "Space" && e.ctrlKey == true){
        this.searchOpen = true
      }

      if(e.key == "h" && e.ctrlKey == true){
        router.push({ name: 'home'})
      }
    }
  },
  created: function () {
    document.onkeydown = function (e) {
      if(e.key == "h" && e.ctrlKey == true) //DISABLE BROWSER HOTKEY
        return false;
      }

    window.addEventListener('keyup', this.CheckKeycode)
  },
  beforeMount() {

  }
})



var Search = Vue.component("Search", {
  props:{
    section: {
      type: String,
      default: ""
    },
    searchterm: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      SerachResult: null,
      loading: false,
      json: null
    }
  },
  template: `
  <div class="content">
    <div v-if="searchterm">
      <h1>Search:"{{searchterm}}"</h1>
    </div>
    <div v-if="section">
      <h1>Section:"{{section}}"</h1>
    </div>
    <div v-if="loading == true">
      SPINNER
    </div>
    <div v-else>
    <table class="fancytable">
      <tr>
      <th>Path</th>
      <th>Title1</th>
      <th>Title2</th>
      <th>Tags</th>
      <th>Public</th>
      </tr>
      <tr v-for="item in SearchResult.List"  >
          <td><router-link :to="{ name: 'page', params: { path: item.Path}}">{{item.Path}}</router-link></td>
          <td><span >{{item.Title1}}</span></td>
          <td><span >{{item.Title2}}</span></td>
          <td>{{item.Tags1}}</td>
          <td v-if="item.Public == true">
            PUBLIC
          </td>
      </tr>
    </table>
  </div>
  `,
  watch:{
    searchterm: function(val) {
    this.GetSearch()
    }
  },
  methods: {
   GetSearch: function(val) {
     this.loading = true
      console.log("GET SearchQery:", this.searchterm);

      ApiData = {}

      console.log("this.section",this.section);

      if (this.section == undefined) {
        console.log("SECTION undefined");
        ApiData = {
          PWD: PwdHash,
          Method: "list",
          DATA:{
           ListModule: "ListFullSearch",
           Searchterm : this.searchterm,
          },
        }
      }else{
        console.log("section NOT undefined");
        ApiData = {
          PWD: PwdHash,
          Method: "list",
          DATA:{
           ListModule: "PathHierarchy",
           Path : this.section,
          },
        }
      }

      // POST /someUrl
      this.$http.post(ApiUrl, ApiData ).then(response => {

        // get status
        //response.status;

        console.log("API-", response.status, "->", PwdHash);

        // get status text
        //response.statusText;

        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        this.json = JSON.parse(response.body);

        this.PC = this.json.DATA

        console.log("ApiReq:",this.PC);
        this.loading = false
        this.SearchResult = this.PC
        return this.SearchResult




      }, response => {
        // error callback
        console.log("API-ERROR");
      })
    }
  },
  beforeMount() {
    this.GetSearch()
  }
});
