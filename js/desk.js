var GetDesktopPageTimeCreate = Vue.component("GetDesktopPageTimeCreate", {
  props: ["ajson"],
  data: function() {
    return {
      jsontmp: ""
    }
  },
  template: `
  <div class="tile">
    PAGES
    <table>
        <tr v-for="item in ajson">

          <td><router-link :to="{ name: 'page', params: { path: item.Path }}">{{ item.Path }}</router-link></td>
          <td>{{item.Public}}</td>
        </tr>
    </table>
  </div>
  `
})


var DesktopPageCategory = Vue.component("DesktopPageCategory", {
  props: ["ajson"],
  data: function() {
    return {
      jsontmp: ""
    }
  },
  template: `
  <div class="tile">
    Namespaces
    <table>
        <tr v-for="item in ajson">

          <td><router-link :to="{ name: 'namespace', params: { title1: item.Title1}}">{{ item.Title1 }}</router-link></td>
        </tr>
    </table>
  </div>
  `
})


var DeskEventlog = Vue.component("DeskEventlog", {
  props: ["ajson"],
  data: function() {
    return {
      jsontmp: ""
    }
  },
  template: `
  <div class="tile">
    Eventlog
    <table>
        <tr>
          <th>ID</th>
          <th>APP</th>
          <th>Name</th>
        </tr>
        <tr v-for="item in ajson">
          <td>{{item.ID}}</td>
          <td>{{item.APP}}</td>
          <td>{{ item.Name }}</td>
        </tr>
    </table>
  </div>
  `
})

var DeskGeldlog = Vue.component("DeskGeldlog", {
  props: ["ajson"],
  data: function() {
    return {
      jsontmp: ""
    }
  },
  template: `
  <div class="tile">
  Geldlog
  <table>
   <tr><td>Last7Days:</td><td>{{ajson.GeldlogLast7Days.Float64}}</tr></td>
   <tr><td>CurrentMonth:</td><td>{{ajson.GeldlogCurentMonth.Float64}}</tr></td>
   <tr><td>CurrentMonthFood:</td><td>{{ajson.GeldlogCurentMonthFood.Float64}}</tr></td>
   <tr><td>ALL:</td><td>{{ajson.GeldlogAll.Float64}}</tr></td>
  </table>
  <hr>
    <table>
        <tr>
          <th>Title</th>
          <th>Namespace</th>
          <th>Amount</th>
          <th>Time</th>
        </tr>
        <tr v-for="item in ajson.Geldlog">
          <td>{{ item.Title1 }}</td>
          <td><span class="namespace">{{ item.Title2 }}</span></td>
          <td>{{ item.Num1.Float64}}</td>
          <td>{{ item.Timecreate}}</td>
        </tr>
    </table>
  </div>
  `
})





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
      <GetDesktopPageTimeCreate :ajson="DATA.DATA.List"></GetDesktopPageTimeCreate>
      <DeskGeldlog :ajson="DATA"></DeskGeldlog>
      <DesktopPageCategory :ajson="DATA.Pagecategory"></DesktopPageCategory>
      <DeskEventlog :ajson="DATA.Eventlog"></DeskEventlog>
    </div>
    <div v-else>
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  `,
  methods: {
    GetPage: function() {
      if(localStorage.AdminHash == "" || localStorage.AdminHash == null || localStorage.AdminHash == 0){
        console.log("DESK- REUTRN NO AdminHash");
        return
      }
      // POST /someUrl
      this.$http.post(ApiUrl, {
        PWD: AdminHash,
        Method: "list",
        DATA:{"ListModule":"ListArticleDesktop"},
      }).then(response => {
        // get status
        response.status;

        console.log("API-", response.status, "->", AdminHash, "-->",response.statusText);


        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        this.tmpjson = JSON.parse(response.body);

        this.DATA = this.tmpjson

        if(this.tmpjson.Error=="authentication failed"){
          localStorage.AdminHash = ""
          location.reload();
        }

        // for(DATAkey in this.DATA.List){
        //   this.DATA.List[DATAkey].Timecreate = moment(this.DATA.List[DATAkey].Timecreate).format("hh:mm DD.MM.YY");
        // }





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
    console.log("GetDesktop beforeMount triggerd");
    this.GetPage()
  }
};

const GetPageByURL = {
  name: "GetPageByURL",
  data: function() {
    return {
      PC: "PageContend NO DATA",
      PH :"PageHierarchy NO DATA",
      loading: true
    }
  },
  props: {
    path: {
      type: String,
      default: "main"
    }
  },
  template: `
  <div id="Page">
  <div id="PageHierarchy">
    PageHierarchy:
    <table>

    <tr>
      <th>Path</th>
      <th>Title1</th>
      <th>Title2</th>
    </tr>
    <tr v-for="item in PH">
      <td><router-link :to="{ name: 'page', params: { path : item.Path }}">{{ item.Path }}</router-link></td>
      <td><span >{{ item.Title1 }}</span></td>
      <td><span >{{ item.Title2 }}</span></td>
    </tr>


    </table>
  </div>
  <div id="content">
    <div v-if="loading == true">
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else>
    Path: <span class="namespace"  name="Path">{{PC.Path}}</span><br>
    <router-link class="EditButton" :to="{ name: 'pedit', params: { path : PC.Path }}"><i class="fa fa-pencil" aria-hidden="true"></i></router-link>
    Title1: <span  name="Title2">{{ PC.Title2 }}</span><br>
    Title2: <span  name="Title1">{{PC.Title1}}</span>
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
</div>
  `,
  methods: {

    //GET ItemDATA
    GetPage: function() {
      // POST /someUrl
      this.$http.post(ApiUrl, {
        PWD: AdminHash,
        Method: "list",
        DATA:{
          ListModule: "Path",
          Path: this.path,
        },
      }).then(response => {

        // get status
        response.status;

        console.log("API-", response.status, "->", AdminHash);

        // get status text
        response.statusText;

        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        this.json = JSON.parse(response.body);

        this.PC = this.json.DATA.List[0]
        this.PC.Text1 = marked(this.PC.Text1, {
          sanitize: true
        })

        console.log(this.PC.Path);
        this.loading = false
        return this.PC




      }, response => {
        // error callback
        console.log("API-ERROR");
      });


      //GET PageHierarchy
      this.$http.post(ApiUrl, {
        PWD: AdminHash,
        Method: "list",
        DATA:{
          ListModule: "PathHierarchy",
          Path: this.path,
        },
      }).then(response => {

        // get status
      //  response.status;

        console.log("API-", response.status, "->", AdminHash);

        // get status text
      //  response.statusText;

        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        tmpPH = JSON.parse(response.body);
        this.PH = tmpPH.DATA.List
        console.log("PH ----------",this.PH);
        //this.loading = false
        //return this.PC




      }, response => {
        // error callback
        console.log("API-ERROR");
      });


    }
  },
  beforeMount() {
    console.log("GetPageByURL beforeMount triggerd");
    this.GetPage()
  },
  beforeRouteUpdate(to, from, next) {
    console.log("GetPageByURL beforeMount triggerd");
    next()
    this.path = to.params.path
    this.GetPage()
}
};
