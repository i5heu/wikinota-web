/*

GELDLOG IS disabled BECAUSE ITS NOT AN MVP FEATURE!!!!


*/


const Geldlog = {
  name: "Geldlog",
  data: function() {
    return {
      Status: "",
      DATA: "ERROR",
      loading: true,
      Title1: "main",
      Title2: "main",
      Num1: 1,
      Sending: false,
    }
  },
  // template: `
  // <div id="content">
  //   <div class="fancyinput">
  //     Cat:<input v-model="Title1"></input><button @click="Title1 = 'food'">food</button><button @click="Title1 = 'transport'">transport</button><br>
  //     Name:<input v-model="Title2"></input><br>
  //     Amount:<input type="number" v-model.number="Num1"></input><br>
  //     <button v-on:click="SendGeldlog" v-on:click="GetPage" :disabled="Sending">SEND <i class="fa fa-paper-plane" aria-hidden="true"></i></button>
  //     <button v-on:click="GetPage" >Refresh <i class="fa fa-refresh" aria-hidden="true"></i></button>
  //   </div>
  //   <div v-if="loading == false">
  //     <DeskGeldlog :ajson="DATA"></DeskGeldlog>
  //   </div>
  //   <div v-else>
  //     <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
  //     <span class="sr-only">Loading...</span>
  //   </div>
  // </div>
  // `,
  template: `
  <div id="content">
    GELDLOG IS disabled BECAUSE ITS NOT AN Minimum Viable Product FEATURE!!!!
  </div>
  `,
  methods: {
    update: function() {
      this.GetPage()
    },
    GetPage: function() {
      this.loading = true
      // POST /someUrl
      this.$http.post(ApiUrl, {
        UserName : UserName,
        PWD: PwdHash,
        Method: "Desk",
      }).then(response => {
        // get status
        response.status;

        console.log("API-", response.status, "->", PwdHash);

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


        console.log("Geldlog -- >",this.DATA);
        this.loading = false
        return this.DATA

      }, response => {
        // error callback
        console.log("API-ERROR");
      });
    },
    SendGeldlog: function() {
      this.Sending = true
      // POST /someUrl
      AddToSyncQueue({
        UserName : UserName,
        PWD: PwdHash,
        Method: "ItemWrite",
        APP: "geldlog",
        Timecreate: CurentTimestamp(),
        Title1: this.Title1,
        Title2: this.Title2,
        Num1: this.Num1,
        needlogin: true
      })

      this.Sending = false
    }
  },
  beforeMount() {
    console.log("HAHAHAHAHH");
    this.GetPage()
  }
};
