const pEdit = {
  name: "pEdit",
  data: function() {
    return {
      PC: "HAAAXXX",
      loading: true
    }
  },
  props: {
    path: {
      type: String,
      default: "main"
    },
    new: {
      default: false
    },
    APP: {
      default: "APP"
    }
  },
  watch: {
      '$route.path' (to, from) {
        console.log("PEDIT:","PATH CHANGE TRIGGER UPDATE HANDLER");
        PeditUpdatehandler(this)
      }

    },
  template: `
  <div id="content">
  <div v-on:click="SendEdit()" class="warn">SAVE <i class="fa fa-paper-plane" aria-hidden="true"></i></div>
    <div v-if="this.loading == true">
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else>
      <div class="PathContainer">
      <span class="namespace edit path"contenteditable="true" @blur="updateHtml" name="Path">{{PC.Path}}</span><span class="path" contenteditable="true" @blur="updateHtml" name="Path2">{{PC.Path2}}</span>
      </div>

      Title1: <span class="edit" contenteditable="true" @blur="updateHtml" name="Title2">{{ PC.Title2 }}</span><br>
      Title2: <span class="edit"contenteditable="true" @blur="updateHtml" name="Title1">{{PC.Title1}}</span>
      <table class="time">
        <tr>
          <td>ID </td>
          <td>{{ PC.ItemID }}</td>
        </tr>
        <tr>
          <td>createt </td>
          <td>{{ PC.Timecreate }}</td>
        </tr>
        <tr>
          <td>lastedit </td>
          <td>{{ PC.Timelastedit }}</td>
        </tr>
        <tr>
          <td>public </td>
          <td>{{PC.Public}}</td>
        </tr>
        <tr>
          <td>APP </td>
          <td>{{PC.APP}}</td>
        </tr>
      </table>
      <textarea class="Text edit" v-model="PC.Text1">{{PC.Text1}}</textarea>
      <hr>
      <div>
        Notizen:<br>
        <textarea class="Text edit" v-model="PC.Text2">{{ PC.Text2 }}</textarea>
      </div>
      <hr>
      Tags:<br>
      <input class="tags edit" :value="PC.Tags1" v-model="PC.Tags1"></input>
    </div>
  <div v-on:click="SendEdit()" class="warn">SAVE <i class="fa fa-paper-plane" aria-hidden="true"></i></div>
  <br>
  <br>
  <br>
  NoSqlData (not working):
  <input class="tags edit" :value="PC.NoSqlData" v-model="PC.NoSqlData"></input>


</div>
  `,
  methods: {
    updateHtml: function(e) {
      var foo = e.target.getAttribute("name")
      this.PC[foo] = e.target.innerHTML
      console.log("UPDATING this.PC." + foo, "  to-->", this.PC[foo]);
    },
    SendEdit: function() {
      this.loading = true
      // POST /someUrl
      this.$http.post(ApiUrl, {
        PWD: AdminHash,
        Method: "create_item",
        DATA: {
          Path: this.PC.Path+this.PC.Path2,
          ItemID: this.PC.ItemID,
          APP: this.PC.APP,
          Timecreate: this.PC.Timecreate,
          public: this.PC.public,
          Title1: this.PC.Title1,
          Title2: this.PC.Title2,
          Text1: this.PC.Text1,
          Text2: this.PC.Text2,
          Tags1: this.PC.Tags1,
          NoSqlData: this.PC.NoSqlData,
        },
      }).then(response => {

        // get status - for network error message - UI not yet written
        response.status;

        resJson = JSON.parse(response.body)


        console.log("API- Write Item - ", AdminHash);

        // get status text
        if (resJson.Error == false) {
          this.loading = false
          router.push({
            name: 'page',
            params: {
              path: resJson.DATA.Path,
            }
          })
        } else {
          //ToDo - Error message here pls.
        }



        return this.PC
      }, response => {
        // error callback
        console.log("API-ERROR");
      });
    },
    CreateEmptyPage: function() {
      this.PC = "NewPage"

      var mokupjson = `
{"DATA":[{"APP":"page","Timecreate":"0001-01-01T00:00:00Z","Timelastedit":"","Public":false,"Title1":"main","Title2":"main","Text1":"","Text2":"","Tags1":"","Num1":{"Float64":0,"Valid":true},"Num2":{"Float64":0,"Valid":true},"Num3":{"Float64":0,"Valid":true}}]}
      `

      this.json = JSON.parse(mokupjson)

      this.PC = this.json.DATA[0]

      if (this.$route.params.path == undefined) {
        this.PC.Path = "page:"
      }else{
        this.PC.Path = this.$route.params.path
      }


      if (this.$route.query.hierachyDown != true){
        var Path2 = this.PC.Path
        var Path2tmp = Path2.substring(Path2.indexOf(':')+1)
        this.PC.Path2 = Path2tmp


        var Path1 = this.PC.Path
        var Path1tmp = Path1.substring(0,Path1.indexOf(':')+1)
        this.PC.Path = Path1tmp
      }else{
        this.PC.Path += ":"
      }


      if (this.PC.Path2 == undefined) {
        this.PC.Path2 = "main"
      }

      if (this.PC.Title1 == undefined) {
        this.PC.Title1 = "main"
      }


      if (this.PC.Title2 == null) {
        this.PC.Title2 = "main"
      }

      if (this.PC.APP == "") {
        this.PC.APP = this.APP
      }

      if (this.PC.Timecreate == "0001-01-01T00:00:00Z") {
        this.PC.Timecreate = CurentTimestamp()
      }

      console.log("CreateEmptyPage------>", this.PC, this.PC.Title1)

      this.loading = false
      return this.PC

    },
    GetPage: function() {
      this.loading = true
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
        response.status

        console.log("API-", response.status, "->", AdminHash)

        // get status text
        // response.statusText


        // get 'Expires' header
        // response.headers.get('Expires')

        // get body data
        this.json = JSON.parse(response.body)


        this.PC = this.json.DATA.List[0]

        if (this.PC.Timecreate == "0001-01-01T00:00:00Z") {
          this.PC.Timecreate = CurentTimestamp()
        }

        var Path2 = this.PC.Path
        var Path2tmp = Path2.substring(Path2.indexOf(':')+1)
        this.PC.Path2 = Path2tmp

        var Path1 = this.PC.Path
        var Path1tmp = Path1.substring(0,Path1.indexOf(':')+1)
        this.PC.Path = Path1tmp


        console.log("----------->", this.PC)

        this.loading = false
        return this.PC
      }, response => {
        // error callback
        console.log("API-ERROR");
      });
    }
  },
  beforeMount() {
    console.log("beforeMount");
  PeditUpdatehandler(this)
}
};


function PeditUpdatehandler(this2) {
  if (this2.new == true) {
    this2.CreateEmptyPage()
  } else {
    if (this2.$route.query.hierachyDown != true){
      this2.GetPage()
    }else{
      console.log("CreateEmptyPage");
      this2.CreateEmptyPage()
    }
  }
}
