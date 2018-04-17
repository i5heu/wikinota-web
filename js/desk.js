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
        <tr v-for="item in ajson.List">

          <td><router-link :to="{ name: 'namespace', params: { section: item.Link_VUE }}">{{ item.Sections }}</router-link></td>
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
//
// var DeskGeldlog = Vue.component("DeskGeldlog", {
//   props: ["ajson"],
//   data: function() {
//     return {
//       jsontmp: ""
//     }
//   },
//   template: `
//   <div class="tile">
//   Geldlog
//   <table>
//    <tr><td>Last7Days:</td><td>{{ajson.GeldlogLast7Days.Float64}}</tr></td>
//    <tr><td>CurrentMonth:</td><td>{{ajson.GeldlogCurentMonth.Float64}}</tr></td>
//    <tr><td>CurrentMonthFood:</td><td>{{ajson.GeldlogCurentMonthFood.Float64}}</tr></td>
//    <tr><td>ALL:</td><td>{{ajson.GeldlogAll.Float64}}</tr></td>
//   </table>
//   <hr>
//     <table>
//         <tr>
//           <th>Title</th>
//           <th>Namespace</th>
//           <th>Amount</th>
//           <th>Time</th>
//         </tr>
//         <tr v-for="item in ajson.Geldlog">
//           <td>{{ item.Title1 }}</td>
//           <td><span class="namespace">{{ item.Title2 }}</span></td>
//           <td>{{ item.Num1.Float64}}</td>
//           <td>{{ item.Timecreate}}</td>
//         </tr>
//     </table>
//   </div>
//   `
// })
//




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
      <GetDesktopPageTimeCreate :ajson="DATA[0].DATA.List"></GetDesktopPageTimeCreate>
      <!-- <DeskGeldlog :ajson="DATA"></DeskGeldlog> -->
      <DesktopPageCategory :ajson="DATA[1].DATA"></DesktopPageCategory>
      <!-- <DeskEventlog :ajson="DATA.Eventlog"></DeskEventlog>  EVENTLOG IS DISABLET BECAUSE OF MVP -->
    </div>
    <div v-else>
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  `,
  methods: {
    GetPage: function() {
      if(localStorage.PwdHash == "" || localStorage.PwdHash == null || localStorage.PwdHash == 0){
        console.log("DESK- REUTRN NO PwdHash");
        return
      }
      // POST /someUrl
      this.$http.post(MultiApiUrl, {

          "MultiAPI":[
            {
              UserName : UserName,
              PWD: PwdHash,
              Method: "list",
              DATA:{"ListModule":"ListArticleDesktop"}
            },
            {
              UserName : UserName,
              PWD: PwdHash,
              Method: "list",
              DATA:{"ListModule":"ListPathSubSection","Path":"page"}
            },
      ]
      }).then(response => {
        // get status
        //response.status;

        console.log("API-", response.status, "->", PwdHash, "-->",response.statusText);


        // get 'Expires' header
        //response.headers.get('Expires');

        // get body data
        this.tmpjson = JSON.parse(response.body);

        this.DATA = this.tmpjson

        if(this.tmpjson.Error=="authentication failed"){
          localStorage.PwdHash = ""
          location.reload();
          return
        }

        // for(DATAkey in this.DATA.List){
        //   this.DATA.List[DATAkey].Timecreate = moment(this.DATA.List[DATAkey].Timecreate).format("hh:mm DD.MM.YY");
        // }



        for (i in this.DATA[1].DATA.List){ //ADD ":" to the path so the category vue module is properly linked

          if(this.DATA[1].DATA.List[i].Sections != "page:"){ //page: has alrdy an ":" at the end
            this.DATA[1].DATA.List[i].Link_VUE = this.DATA[1].DATA.List[i].Sections + ":"
          }else{
            this.DATA[1].DATA.List[i].Link_VUE = this.DATA[1].DATA.List[i].Sections
          }


        }



        console.log("DESKTOP-DATA:",this.DATA);
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
      loading: true,
      modal: false,
      deleteStatus: "no Status",
      NotExist: false
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
  <span id="PathHierarchyPath">{{this.path}}</span>
   <span v-if="PH.PathUpDisable == false">
    <router-link class="EditButton PathUp" :to="{ name: 'page', params: { path : PH.PathUp }}"><i class="fa fa-chevron-up"></i></router-link>
   </span>
    <table>

    <tr>
      <th>Path</th>
      <!--<th>Title1</th>
      <th>Title2</th>-->
    </tr>
    <tr v-for="item in PH">
      <td><router-link :to="{ name: 'page', params: { path : item.Path }}">{{ item.Path }}</router-link></td>
      <!--<td><span >{{ item.Title1 }}</span></td>
      <td><span >{{ item.Title2 }}</span></td>-->
    </tr>


    </table>
  </div>
  <div id="content">
    <div v-if="loading == true">
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else>

    <div class="emptyPath" v-if="NotExist == true" >
        DATA IS NOT EXISTENT FOR FOLOWING PATH <br> <span style="border:1px solid black;">{{ this.path }}</span>
    </div>

    <div class="PathContainer">
    <span class="namespace path" >{{PC.Path1}}</span><span class="path">{{PC.Path2}}</span>
    </div>
    <router-link class="EditButton" :to="{ name: 'pedit', params: { path : PC.Path }, query: { hierachyDown: true }}"><i class="fa fa-chevron-down"></i></router-link>
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

      <button v-on:click="Delete()" class="DelButton">DELETE</button>

    </div>
    </div>

<div v-if="modal" class="modal-mask">
  <div class="modal">
      Delete Item?<br>

      <button v-on:click="CloseModal()" >Cancle</button>-------------
      <button v-on:click="DeleteTRUE()" class="DelButton">DELETE</button>

      <div>STATUS: {{ deleteStatus }}</div>
    </div>
  </div>
</div>
  `,
  methods: {

    //GET ItemDATA
    GetPage: function() {
      if(this.path == "page"){
        router.push({name:"home"})
        return
      }

      // POST /someUrl
      this.$http.post(ApiUrl, {
        UserName : UserName,
        PWD: PwdHash,
        Method: "list",
        DATA:{
          ListModule: "Path",
          Path: this.path,
        },
      }).then(response => {

        // get status
        response.status;

        console.log("API-", response.status, "->", PwdHash);

        // get status text
        response.statusText;

        // get 'Expires' header
        response.headers.get('Expires');

        // get body data
        this.json = JSON.parse(response.body);


        if(this.json.DATA.List == null){
          console.log("THERE IS NO DATA FOR THIS PATH");

          this.loading = false
          this.NotExist = true

          return
        }
        
        this.NotExist = false
        console.log("this.json.DATA.List[0] ----",this.json.DATA.List[0]);

        this.PC = this.json.DATA.List[0]
        this.PC.Text1 = marked(this.PC.Text1, {
          sanitize: true
        })


        console.log("DEBUG PATH ---- PC.Path:",this.PC.Path);
        var Path2 = this.path
        var Path2tmp = Path2.substring(Path2.indexOf(':')+1)
        this.PC.Path2 = Path2tmp

        var Path1 = this.path
        var Path1tmp = Path1.substring(0,Path1.indexOf(':')+1)
        this.PC.Path1 = Path1tmp


        console.log(this.PC.Path);
        this.loading = false
        return this.PC


      }, response => {
        // error callback
        console.log("API-ERROR");
      });


      //GET PageHierarchy
      this.$http.post(ApiUrl, {
        UserName : UserName,
        PWD: PwdHash,
        Method: "list",
        DATA:{
          ListModule: "PathHierarchy",
          Path: this.path,
        },
      }).then(response => {

        // get status
      //  response.status;

        console.log("API-", response.status, "->", PwdHash);

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

        console.log("DEBUG PATH ---- PC.Path:",this.path);
        var Path2 = this.path
        var Path2tmp = Path2.substring(Path2.indexOf(':')+1)
        this.PH.Path2 = Path2tmp

        var Path1 = this.path
        var Path1tmp = Path1.substring(0,Path1.indexOf(':')+1)
        this.PH.Path1 = Path1tmp


        var PathUp = this.path
        console.log("FIEEEEEERRRDDXDDD Split lenght -----", this.path,"--------" ,this.path.split(":").length-1);
        var PathUptmp = PathUp.substring(0,PathUp.lastIndexOf(':'))

        if (this.path.split(":").length-1 < 1){
          console.log("PathUp To Short:", this.path.split(":").length-1);
          this.PH.PathUpDisable = true
          return
        }else{
          this.PH.PathUpDisable = false
          this.PH.PathUp = PathUptmp
          console.log("PathUp Not To Short:", PathUptmp);
        }


      }, response => {
        // error callback
        console.log("API-ERROR");
      });


    },
   Delete: function() {
     console.log("DELETE TRIGGERD");
     this.modal = true
   },
  CloseModal: function() {
    console.log("CloseModal TRIGGERD");
    this.modal = false
  },
  DeleteTRUE: function() {
    console.log("DeleteTRUE TRIGGERD");

    // POST /someUrl
    this.$http.post(ApiUrl, {
      UserName : UserName,
      PWD: PwdHash,
      Method: "delete_item",
      DATA:{
        Path: this.path,
      },
    }).then(response => {

      // get status
      response.status;

      console.log("API-", response.status, "->", PwdHash);

      // get status text
      response.statusText;

      // get 'Expires' header
      response.headers.get('Expires');

      // get body data
      this.json = JSON.parse(response.body);

      this.deleteStatus = this.json.DATA.Status

      setTimeout(function(){  console.log("PUSH TO HOME"); router.push({name:"home"}); } , 500);

      return


    }, response => {
      // error callback
      console.log("API-ERROR");
    });
    },
  },
  beforeMount() {
    if(this.path == "page"){
      router.push({name:"home"})
      return
    }
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
