// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill';
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vuex from "vuex";
import moment from "moment";
import { getCurrentLangFile } from "./lang/langData.js";
import { accessQueryData } from "./common/accessQueryData.js";
import { authUtil } from "./common/authUtil.js";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Vuex);


const store = new Vuex.Store({
  // 存放全局資料(共用的資料)
  state: {
    accountID: "",
    domain: "",
    token: "",
    level: '',
    queryData: [],
    showNav: 1,
    accountType: 1, //1:代理 0: 子帳
    dbAcl: [],
    dbFunType: [],
    dbFun: [],
    dbGameType: [],
    queryDetailWithSAT: [],
    queryDetailWithAGT: [],
    queryUser: ""

  },
  // 過濾，比較，取得狀態資料的方法，操作狀態(似計算屬性 computed ，可以運算state裡的資料做出新的資料)
  getters: {
    accountID(state) {
      return state.accountID || sessionStorage.getItem("accountID");
    },
    domain(state) {
      return state.domain || sessionStorage.getItem("domain");
    },
    token(state) {
      return state.token || sessionStorage.getItem("token");
    },
    level(state) {
      return state.level || sessionStorage.getItem("level");
    },
    accountType(state) {
      // return sessionStorage.getItem("accountType") || state.accountType;
      state.accountType = sessionStorage.getItem("accountType");
      return state.accountType;
    },
    dbAcl(state) {
      return JSON.parse(sessionStorage.getItem("dbAcl")) || state.dbAcl;
    },
    dbFunType(state) {
      return JSON.parse(sessionStorage.getItem("dbFunType")) || state.dbFunType;
    }
    ,
    dbFun(state) {
      return JSON.parse(sessionStorage.getItem("dbFun")) || state.dbFun;
    }
    ,
    dbGameType(state) {
      return JSON.parse(sessionStorage.getItem("dbGameType")) || state.dbGameType;
    },
    getQuerySAT(state) {
      state.queryDetailWithSAT = JSON.parse(sessionStorage.getItem("querySat"));
      return state.queryDetailWithSAT;
    },
    getQueryAGT(state) {
      state.queryDetailWithAGT = JSON.parse(sessionStorage.getItem("queryAgt"));
      return state.queryDetailWithAGT;
    },
    getQueryUser(state) {
      state.queryUser = JSON.parse(sessionStorage.getItem("queryID"));
      return state.queryUser;
    }
  },
  // 更動資料的地方(似事件方法 methods)
  mutations: {
    setAccountID(state, val) {
      state.accountID = val;
      sessionStorage.setItem("accountID", val);
    },
    setDomain(state, val) {
      state.domain = val;
      sessionStorage.setItem("domain", val);
    },
    setToken(state, val) {
      state.token = val;
      sessionStorage.setItem("token", val);
    },
    setLevel(state, val) {
      state.level = val;
      sessionStorage.setItem("level", val);
    },
    setAccountType(state, val) {
      state.accountType = val;
      sessionStorage.setItem("accountType", val);
    },
    setAcl(state, val) {
      let txt = JSON.stringify(val)
      sessionStorage.setItem("dbAcl", txt);
      state.dbAcl = val;
      // console.log("state.dbAcl", val);
    },
    setFunType(state, val) {
      let txt = JSON.stringify(val)
      sessionStorage.setItem("dbFunType", txt);
      state.dbFunType = val;
      // console.log("state.dbFunType", val);
    },
    setFun(state, val) {
      let txt = JSON.stringify(val)
      state.dbFun = val;
      sessionStorage.setItem("dbFun", txt);
      // console.log("state.dbFun1", val);
    },
    setGameType(state, val) {
      let txt = JSON.stringify(val)
      state.dbGameType = val;
      sessionStorage.setItem("dbGameType", txt);
      // console.log("state.dbFun1", val);
    },
    SET_QUERY_SAT(state, val) {
      let txt = JSON.stringify(val);
      state.queryDetailWithSAT = val;
      sessionStorage.setItem("querySat", txt);
    },
    SET_QUERY_AGT(state, val) {
      let txt = JSON.stringify(val);
      state.queryDetailWithAGT = val;
      sessionStorage.setItem("queryAgt", txt);
    },
    SET_QUERY_USER(state, val) {
      let txt = JSON.stringify(val);
      state.queryUser = val;
      sessionStorage.setItem("queryID", txt);
    }
  },
  // 異步資料操作，Action 提交的是 mutation，而不是直接变更状态
  actions: {
    REQUEST_QUERY_SAT: (context, userInfo) => {
      let temp = [{ guid: userInfo.satGuid, userId: userInfo.accountID }];
      return context.commit("SET_QUERY_SAT", temp);
    },
    REQUEST_QUERY_AGT: (context, userInfo) => {
      let temp = [{ guid: userInfo.agtGuid, userId: userInfo.accountID }];
      return context.commit("SET_QUERY_AGT", temp);
    },
    REQUEST_QUERY_USER: (context, userInfo) => {
      let temp = [{ userId: userInfo.accountID, guid: userInfo.playerGuid }];
      return context.commit("SET_QUERY_USER", temp);
    },
  }
});

Vue.filter("dateTimeFormat", function (value) {
  if (!value) return "";
  return moment(value).format("YYYY-MM-DD HH:mm:ss");
});

Vue.filter("dateFormat", function (value) {
  if (!value) return "";
  return moment(value).format("YYYY-MM-DD");
});

Vue.filter("commaFormat", function (value) {


  var f = parseFloat(value);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(value * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }

  return s
    .toString()
    .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
      return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
    });
});

Vue.filter("commaFloatFormat", function (value) {


  var f = parseFloat(value);
  if (isNaN(f)) {
    return false;
  }
  // var f = Math.round(value * 100) / 100;

  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 4) {
    s += '0';
  }

  return s
    .toString()
    .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
      return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
    });
});


let lang = getCurrentLangFile();

Vue.prototype.lang = lang;
Vue.prototype.accessQueryData = accessQueryData;
Vue.prototype.authUtil = authUtil;


new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
  render: h => h(App),
  watch: {
    "$route.path": function (newVal, oldVal) {

      if (newVal == '/' || newVal == "/FirstPassword") {
        this.$store.state.showNav = 1;
        // sessionStorage.removeItem("queryKey");
      }
      if (newVal !== '/' || newVal !== "/FirstPassword") {
        this.$store.state.showNav = 0;
      } else {
        this.$store.state.showNav = 1;
      }


    }
  }
});
