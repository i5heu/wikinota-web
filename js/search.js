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
    searchterm: {
      type: String,
      default: "main"
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
    <h1>Search:"{{searchterm}}"</h1>
    <div v-if="loading == true">
      SPINNER
    </div>
    <div v-else>
    aa
    <table class="fancytable">
      <tr>
      <th>Namespace</th>
      <th>Title</th>
      <th>Tags</th>
      <th>Public</th>
      </tr>
      <tr v-for="item in SearchResult"  >
          <td><span class="namespace">{{item.Title1}}</span></td>
          <td class="namespnamespaceace"><router-link :to="{ name: 'page', params: { title1: item.Title1, title2: item.Title2}}">{{item.Title2}}</router-link></td>
          <td class="namespnamespaceace">{{item.Tags1}}</td>
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
      // POST /someUrl
      this.$http.post(ApiUrl, {
        PWD: AdminHash,
        Method: "ItemSearch",
        SearchAPP: "page",
        SearchString: this.searchterm
      }).then(response => {

        // get status
        //response.status;

        console.log("API-", response.status, "->", AdminHash);

        // get status text
        //response.statusText;

        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        this.json = JSON.parse(JSON.stringify(response.body));

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
