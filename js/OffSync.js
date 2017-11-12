console.log("LOAD OffSync.js");

var OffSyncQueueAmount = 0
var SyncinProgress = false

Vue.component("offsync", {
  data: function() {
    return {
      DATA: [],
      ShowButNoSync: false,
      SyncInProgress: false,
      ItemsInQueue: 0
    }
  },
  template: `
  <div id="OffSync">

    <div v-if="SyncInProgress">
      {{ItemsInQueue}}
      <i class="fa fa-refresh fa-spin fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else>
      <div v-if="ShowButNoSync">
      {{ItemsInQueue}}
      <i class="fa fa-refresh fa-fw"></i>
      <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
  `,
  methods: {
    TriggerSync: function() {
      this.SyncinProgress = SyncinProgress
      if (OffSyncQueueAmount > 0 && SyncinProgress == false) {
        console.log("TRIGGER SendToServer", this.ItemsInQueue , this.SyncInProgress);
        this.SendToServer()
      }
    },
    SetSyncinProgress: function(bar){
      SyncInProgress = bar
      this.SyncinProgress = bar
    },
    SendToServer: function() {
      this.SetSyncinProgress(true)
      this.SyncInProgress = true

      var self = this

      var blaa = db.allDocs({
        include_docs: true,
        descending: true
      }, function(err, doc) {
        var foo = []

        if (doc.rows.length == 0) {

          console.log("OffSync - No Items for Sync");
          self.SyncInProgress = false
          return
        }

        self.$http.post(ApiUrl, doc.rows[0].doc.DATA).then(response => {


          self.tmpjson = JSON.parse(JSON.stringify(response.body));
          if (self.tmpjson.Status == "OK") {

            db.get(doc.rows[0].id).then(function(doc) {
              return db.remove(doc);
            });
          }


          console.log("OffSync - Syncinc Finished");
          self.SetSyncinProgress(false)
        }, response => {
          // error callback
          console.log("API-ERROR", response.status);
          self.SetSyncinProgress(false)
        });


      })

    }
  },
  created: function() {
    console.log("TRAAAARTAA");
    GetSyncQueueAmount();
    let self = this;

    setInterval(function() {
      self.ItemsInQueue = OffSyncQueueAmount
      self.SyncinProgress = SyncinProgress
      if (self.ItemsInQueue != 0) {
        self.ShowButNoSync = true
      }else{
        self.ShowButNoSync = false
      }
    }, 300);

    setInterval(function() {
      GetSyncQueueAmount();
      if(self.ItemsInQueue != 0){
        self.TriggerSync()
      }
    }, 2000);

  }
})

function AddToSyncQueue(Data) {
  var QueueItem = {
    _id: new Date().toISOString(),
    OffSync: true,
    DATA: Data
  };

  db.put(QueueItem, function callback(err, result) {
    if (!err) {
      console.log('Successfully add to SyncQueue!');
    } else {
      console.log('ERROR by add Item to SyncQueue! --->', err);
    }
  });

  GetSyncQueueAmount()

}

const GetSyncQueueAmount = () => {
  db.allDocs({
    include_docs: true,
    descending: true
  }, function(err, doc) {
    var foo = []

    for (var key in doc.rows) {
      if (doc.rows[key].doc.DATA.Method == "ItemWrite") {
        foo.push(doc.rows[key])
      }
    }

    OffSyncQueueAmount = foo.length

  })
  return
}
