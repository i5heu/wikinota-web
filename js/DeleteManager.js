
const DeleteManager = {
  name: "DeleteManager",
  data: function() {
    return {
      DATA: "ERROR",
      loading: true
    }
  },
  template: `
  <div>
  DELETE MANAGER
  <hr>
    <div v-if="loading == false" class="desk">
      <table>
        <tr v-for="item in DATA">
            <td>{{item.ItemID}}</td>
            <td>{{item.APP}}</td>
            <td>{{item.Title1}}</td>
            <td>{{item.Title2}}</td>
            <td>{{item.Public}}</td>
            <td>{{item.Timelastedit}}</td>
            <td><button @click="Delete(item.ItemID)" style="background-color:red;" >DEL</button></td>
        </tr>
      </table>

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
        UserName : UserName,
        PWD: PwdHash,
        Method: "ItemListRead",
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

        this.DATA = this.tmpjson.DATA



        // for(DATAkey in this.DATA.Geldlog){
        //   this.DATA.Geldlog[DATAkey].Timecreate = moment(this.DATA.Geldlog[DATAkey].Timecreate).format("hh:mm DD.MM.YY");
        // }

        console.log(this.DATA);
        this.loading = false
        return this.DATA




      }, response => {
        // error callback
        console.log("API-ERROR");
      });
    },
    Delete: function(ID) {
      // POST /someUrl
      this.$http.post(ApiUrl, {
        UserName : UserName,
        PWD: PwdHash,
        Method: "ItemDelete",
        ItemID: ID,
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

        this.DATA = this.tmpjson.DATA



        // for(DATAkey in this.DATA.Geldlog){
        //   this.DATA.Geldlog[DATAkey].Timecreate = moment(this.DATA.Geldlog[DATAkey].Timecreate).format("hh:mm DD.MM.YY");
        // }

        console.log(this.Status);
        this.loading = false
        this.GetPage()
        return




      }, response => {
        // error callback
        console.log("API-ERROR");
      });
    }
  },
  beforeMount() {
    console.log("GET ITEMS");
    this.GetPage()
  }
};
