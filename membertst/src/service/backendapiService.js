import axios from "axios";
import { configData } from "../config/config";
import { codeHelper } from "../lang/responseCode.js";
import Vue from "vue";
import router from "../router/index";
import { compare } from "semver";
import moment from "moment";
import { Notification } from 'element-ui';
var AjaxTime = null;
var duplicateAccount = false;


function checkAjaxTimeout() {
  let checkRes = false;
  let tempTime = moment().format('YYYY-MM-DD HH:mm:ss');
  if (moment(tempTime) < moment(AjaxTime)) {
    checkRes = true;
  }
  return checkRes;
}


function extendAjaxTime() {
  AjaxTime = moment().add(29, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  sessionStorage.setItem("TimeLog", AjaxTime);
}

function getFileAjax(url, data, resToken) {
  let headers = {
    "Content-Type": "application/json",
    token: sessionStorage.getItem("token")
  };
  return axios
    .post(url, data, {
      headers: headers,
      responseType: 'blob', // important           
    }).then(res => {
      return Promise.resolve(res);
    })
    .catch(ex => {
      console.log(ex);
      console.log("error");
    });
}

function getAjaxWithoutToken(url, data) {
  let headers = {
    "Content-Type": "application/json"
  };
  return axios
    .post(url, data, {
      headers: headers
    })
    .then(res => {
      if (res.data.statusCode == 200) {
        AjaxTime = moment().format('YYYY-MM-DD HH:mm:ss');
        sessionStorage.setItem("TimeLog", AjaxTime);
        // console.log(AjaxTime);
      }

      if (res.data.statusCode != 200) {
        let codeData = codeHelper.find(obj => {
          return obj.statusCode == res.data.statusCode;
        });

        if (codeData.statusCode == 1090 || codeData.statusCode == 1092 || codeData.statusCode == 131040 || codeData.statusCode == 131050 || codeData.statusCode == 131060) {
          window.sessionStorage.clear();
          router.push({ path: '/Login' })
        }
        if (codeData.statusCode == 131180) {
          router.push({ path: '/FirstPassword' })
        }


        if (codeData.statusCode == 131180) {
          let errorTEXT = codeData.cn + "(" + codeData.statusCode + ")";
          Notification({
            title: "T9 提示",
            message: errorTEXT,
            type: data.type || 'warning'
          });
        } else {
          let errorTEXT = codeData.cn + "(" + codeData.statusCode + ")";
          Notification({
            title: "T9 错误",
            message: errorTEXT,
            type: data.type || 'error'
          });
        }

      }
      return Promise.resolve(res);
    })
    .catch(ex => {
      console.log(ex);
      console.log("error");
    });
}
const JSONbig = require('json-bigint')({ 'storeAsString': true });
function getAjax(url, data) {
  let headers = {
    "Content-Type": "application/json",
    token: sessionStorage.getItem("token")
  };
  return axios
    .post(url, data, {
      headers: headers,
      transformResponse: ((data) => {
        // console.log(JSONbig.parse(data));
        return JSONbig.parse(data);
      })
    }).then(res => {

      if (sessionStorage["accountID"] == null && sessionStorage["token"] == null) {
        this.$router.push({ path: "/Login" });
        return;
      }

      if (res.data.statusCode != 200) {
        let codeData = codeHelper.find(obj => {
          return obj.statusCode == res.data.statusCode;
        });

        let errorTEXT = "";
        errorTEXT = codeData.cn + "(" + codeData.statusCode + ")";


        if (codeData.statusCode == 1090 || codeData.statusCode == 1092 || codeData.statusCode == 131040 || codeData.statusCode == 131050 || codeData.statusCode == 131060) {
          window.sessionStorage.clear();
          router.push({ path: '/Login' });
        }
        if (codeData.statusCode == 131180) {
          router.push({ path: '/FirstPassword' });
        }

        if (codeData.statusCode == 131040) {
          let getRES = checkAjaxTimeout();
          // console.log(getRES)
          if (getRES) {
            errorTEXT = "重复登录";
          }
        }

        if (codeData.statusCode == 131180) {
          Notification({
            title: "T9 提示",
            message: errorTEXT,
            type: data.type || 'warning'
          });
        } else {
          Notification({
            title: "T9 错误",
            message: errorTEXT,
            type: data.type || 'error'
          });
        }



      } else {
        extendAjaxTime();
      }
      return Promise.resolve(res);
    })
    .catch(ex => {
      console.log(ex);
      console.log("error");
    });
}
function getCurrentApi() {
  if (sessionStorage.getItem("api") !== null) {
    let apiUrl = sessionStorage.getItem("api");
    configData.backendAPIUrl = apiUrl;
    let imgUrl = sessionStorage.getItem("static");
    configData.staticUrl = imgUrl;
  }
}
getCurrentApi();
var backendapiService = {
  /**
   * 登入
   * @param {*} data
   */


  login: function (data) {
    let url = configData.backendAPIUrl + "login";
    let ajax = getAjaxWithoutToken(url, data);
    return ajax;
  },
  logout: function (data) {
    let url = configData.backendAPIUrl + "logout";
    let ajax = getAjax(url, data);
    return ajax;
  },
  logininfo: function (data) {
    let url = configData.backendAPIUrl + "logininfo";
    let ajax = getAjax(url, data);
    return ajax;
  },
  updatepassword: function (data) {
    let url = configData.backendAPIUrl + "updatepassword";
    let ajax = getAjax(url, data);
    return ajax;
  },
  menulist: function (data) {
    let url = configData.backendAPIUrl + "menulist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  summary: function (data) {
    let url = configData.backendAPIUrl + "summary";
    let ajax = getAjax(url, data);
    return ajax;
  },
  playerlist: function (data) {
    let url = configData.backendAPIUrl + "playerlist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  lockplayer: function (data) {
    let url = configData.backendAPIUrl + "lockplayer";
    let ajax = getAjax(url, data);
    return ajax;
  },
  unlockplayer: function (data) {
    let url = configData.backendAPIUrl + "unlockplayer";
    let ajax = getAjax(url, data);
    return ajax;
  },
  agentdetail: function (data) {
    let url = configData.backendAPIUrl + "agentdetail";
    let ajax = getAjax(url, data);
    return ajax;
  },
  updateagentpassword: function (data) {
    let url = configData.backendAPIUrl + "updateagentpassword";
    let ajax = getAjax(url, data);
    return ajax;
  },
  updateagent: function (data) {
    let url = configData.backendAPIUrl + "updateagent";
    let ajax = getAjax(url, data);
    return ajax;
  },
  playerdetail: function (data) {
    let url = configData.backendAPIUrl + "playerdetail";
    let ajax = getAjax(url, data);
    return ajax;
  },
  agentlist: function (data) {
    let url = configData.backendAPIUrl + "agentlist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  lockagent: function (data) {
    let url = configData.backendAPIUrl + "lockagent";
    let ajax = getAjax(url, data);
    return ajax;
  },
  unlockagent: function (data) {
    let url = configData.backendAPIUrl + "unlockagent";
    let ajax = getAjax(url, data);
    return ajax;
  },
  addagent: function (data) {
    let url = configData.backendAPIUrl + "addagent";
    let ajax = getAjax(url, data);
    return ajax;
  },
  subaccountlist: function (data) {
    let url = configData.backendAPIUrl + "subaccountlist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  locksubaccount: function (data) {
    let url = configData.backendAPIUrl + "locksubaccount";
    let ajax = getAjax(url, data);
    return ajax;
  },
  unlocksubaccount: function (data) {
    let url = configData.backendAPIUrl + "unlocksubaccount";
    let ajax = getAjax(url, data);
    return ajax;
  },
  addsubaccount: function (data) {
    let url = configData.backendAPIUrl + "addsubaccount";
    let ajax = getAjax(url, data);
    return ajax;
  },
  updatesubaccountpassword: function (data) {
    let url = configData.backendAPIUrl + "updatesubaccountpassword";
    let ajax = getAjax(url, data);
    return ajax;
  },
  updatesubaccount: function (data) {
    let url = configData.backendAPIUrl + "updatesubaccount";
    let ajax = getAjax(url, data);
    return ajax;
  },
  logsubaccountdetailin: function (data) {
    let url = configData.backendAPIUrl + "subaccountdetail";
    let ajax = getAjax(url, data);
    return ajax;
  },
  gamesummaryreport: function (data) {
    let url = configData.backendAPIUrl + "gamesummaryreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  playersummaryreport: function (data) {
    let url = configData.backendAPIUrl + "playersummaryreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  summaryreport: function (data) {
    let url = configData.backendAPIUrl + "summaryreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  dailyreport: function (data) {
    let url = configData.backendAPIUrl + "dailyreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  gamereport: function (data) {
    let url = configData.backendAPIUrl + "gamereport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  dailytradelist: function (data) {
    let url = configData.backendAPIUrl + "dailytradelist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  playerdetail: function (data) {
    let url = configData.backendAPIUrl + "playerdetail";
    let ajax = getAjax(url, data);
    return ajax;
  },
  gamedetail: function (data) {
    let url = configData.backendAPIUrl + "gamedetail";
    let ajax = getAjax(url, data);
    return ajax;
  },
  transferdetail: function (data) {
    let url = configData.backendAPIUrl + "transferdetail";
    let ajax = getAjax(url, data);
    return ajax;
  },
  transferlist: function (data) {
    let url = configData.backendAPIUrl + "transferlist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  loginloglist: function (data) {
    let url = configData.backendAPIUrl + "loginloglist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  dailyreportdownload: function (data) {
    let url = configData.backendAPIUrl + "dailyreportdownload";
    let ajax = getFileAjax(url, data);
    return ajax;
  },
  dailytradelistdownload: function (data) {
    let url = configData.backendAPIUrl + "dailytradelistdownload";
    let ajax = getFileAjax(url, data);
    return ajax;
  },
  gamereportdownload: function (data) {
    let url = configData.backendAPIUrl + "gamereportdownload";
    let ajax = getFileAjax(url, data);
    return ajax;
  },
  summaryreportplayerdownload: function (data) {
    let url = configData.backendAPIUrl + "summaryreportplayerdownload";
    let ajax = getFileAjax(url, data);
    return ajax;
  },
  summaryreportgamedownload: function (data) {
    let url = configData.backendAPIUrl + "summaryreportgamedownload";
    let ajax = getFileAjax(url, data);
    return ajax;
  },
  querygamedetail: function (data) {
    let url = configData.backendAPIUrl + "querygamedetail";
    let ajax = getAjax(url, data);
    return ajax;
  },
  gamecodelist: function (data) {
    let url = configData.backendAPIUrl + "gamecodelist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  managerlist: function (data) {
    let url = configData.backendAPIUrl + "managerlist";
    let ajax = getAjax(url, data);
    return ajax;
  },
  addagentbymanagerid: function (data) {
    let url = configData.backendAPIUrl + "addagentbymanagerid";
    let ajax = getAjax(url, data);
    return ajax;
  },
  singleplayersummaryreport: function (data) {
    let url = configData.backendAPIUrl + "singleplayersummaryreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  agentlistbymanagerid: function (data) {
    let url = configData.backendAPIUrl + "agentlistbymanagerid";
    let ajax = getAjax(url, data);
    return ajax;
  },
  addmanager: function (data) {
    let url = configData.backendAPIUrl + "addmanager";
    let ajax = getAjax(url, data);
    return ajax;
  },
  jackpotagentreport: function (data) {
    let url = configData.backendAPIUrl + "jackpotagentreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  jackpotplayerreport: function (data) {
    let url = configData.backendAPIUrl + "jackpotplayerreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  summarycamreport: function (data) {
    let url = configData.backendAPIUrl + "summarycamreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
  summarycamreportdownload: function (data) {
    let url = configData.backendAPIUrl + "summarycamreportdownload";
    let ajax = getFileAjax(url, data);
    return ajax;
  },
  playersummarycamreport: function (data) {
    let url = configData.backendAPIUrl + "playersummarycamreport";
    let ajax = getAjax(url, data);
    return ajax;
  },
};

export { backendapiService };
