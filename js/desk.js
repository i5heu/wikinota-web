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

          <td><span class="namespace">{{ item.Title1 }}</span></td>
          <td><router-link :to="{ name: 'page', params: { title1: item.Title1, title2: item.Title2}}">{{ item.Title2 }}</router-link></td>
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
      <GetDesktopPageTimeCreate :ajson="DATA.Pages"></GetDesktopPageTimeCreate>
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

        if(this.tmpjson.Status=="ERROR - NOT LOGGED IN"){
          localStorage.AdminHash = ""
          location.reload();
        }

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
