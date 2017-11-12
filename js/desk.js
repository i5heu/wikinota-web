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
          <td><router-link :to="{ name: 'page', params: { title1: item.Title1, title2: item.Title2}}">{{ item.Title1 }}</router-link></td>
          <td>{{item.Public}}</td>
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
