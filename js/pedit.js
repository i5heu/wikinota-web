const pEdit = {
  name: "pEdit",
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
    },
    new: {
      default: false
    },
    APP: {
      default: "APP"
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
      <span class="namespace edit"contenteditable="true" @blur="updateHtml" name="Title1">{{PC.Title1}}</span>
      <h1 class="edit" contenteditable="true" @blur="updateHtml" name="Title2">{{ PC.Title2 }}</h1>
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
        public: {{PC.Public}}
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
        Method: "ItemWrite",
        ItemID: this.PC.ItemID,
        APP: this.PC.APP,
        Timecreate: this.PC.Timecreate,
        public: this.PC.public,
        Title1: this.PC.Title1,
        Title2: this.PC.Title2,
        Text1: this.PC.Text1,
        Text2: this.PC.Text2,
        Tags1: this.PC.Tags1
      }).then(response => {

        // get status
        response.status;

        console.log("API-", response.status, "->", AdminHash);

        // get status text
        if (response.body.Status == "OK") {
          this.loading = false
          router.push({
            name: 'page',
            params: {
              title1: response.body.Title1,
              title2: response.body.Title2
            }
          })
        } else {

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
        Method: "ItemIdRead",
        APP: "page",
        Title1: this.title1,
        Title2: this.title2
      }).then(response => {
        // get status
        response.status

        console.log("API-", response.status, "->", AdminHash)

        // get status text
        response.statusText

        // get 'Expires' header
        response.headers.get('Expires')

        // get body data
        this.json = JSON.parse(JSON.stringify(response.body))

        this.PC = this.json.DATA[0]

        if (this.PC.Title1 == "") {
          this.PC.Title1 = "main"
        }


        if (this.PC.Title2 == "") {
          this.PC.Title2 = "main"
        }

        if (this.PC.APP == "") {
          this.PC.APP = this.APP
        }

        if (this.PC.Timecreate == "0001-01-01T00:00:00Z") {
          this.PC.Timecreate = CurentTimestamp()
        }

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
    console.log("HAHAHAHAHH");
    if (this.new == true) {
      this.CreateEmptyPage()
    } else {
      this.GetPage()
    }

  }
};
