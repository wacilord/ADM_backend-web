
import { codeHelper } from "../lang/responseCode.js";
import { backendapiService } from "../service/backendapiService"

let routeTable = [
  { funCode: "summary", funName: "总览", url: "/" },
  { funCode: "menu1", funName: "会员管理", url: "" },
  { funCode: "menu2", funName: "统计报表", url: "" },
  { funCode: "menu3", funName: "点数查询", url: "/TransferList" },
  { funCode: "menu4", funName: "快速搜寻", url: "" },
  { funCode: "menu5", funName: "总览", url: "/" },

  { funCode: "addagentbymanagerid", funName: "总代新增代理", url: "/AddAgentByMerchant" },
  { funCode: "agentlistbymanagerid", funName: "总代代理清单", url: "/AgentListByManagerID" },
  { funCode: "managerlist", funName: "经理清单", url: "/ManagerList" },
  { funCode: "playerlist", funName: "会员清单", url: "/MemberList" },
  { funCode: "agentlist", funName: "代理清单", url: "/AgentList" },
  { funCode: "addagent", funName: "新增代理", url: "/AddAgent" },
  { funCode: "addmanager", funName: "新增经理", url: "/AddManager" },
  { funCode: "subaccountlist", funName: "子帐号清单", url: "/SubAccountList" },
  { funCode: "addsubaccount", funName: "新增子帐号", url: "/AddSubAccount" },

  { funCode: "transfer", funName: "点数查询", url: "/TransferList" },


  { funCode: "summarycamreport", funName: "活动中奖查询", url: "/Summarycomreport" },
  { funCode: "jackpotreport", funName: "天九福彩(新)查询", url: "/JackpotAgentReport" },
  { funCode: "winlosereportreport", funName: "输赢报表", url: "/WinLost" },
  { funCode: "dailyreport", funName: "对帐报表", url: "/ReconciliationStatement" },
  { funCode: "gamereport", funName: "游戏统计", url: "/GameReport" },
  { funCode: "dailytradelist", funName: "帐变记录", url: "/PlayerDailyTradeList" },

  { funCode: "playerdetail", funName: "依会员ID查询", url: "/PlayerDetail" },
  { funCode: "gamedetail", funName: "依注单号查询", url: "/GameDetail" },
  { funCode: "playerwinlosereport", funName: "单一会员输赢", url: "/AccountWinLost" },

  { funCode: "unlockplayer", funName: "解锁会员", url: "" },
  { funCode: "unlockagent", funName: "解锁代理", url: "" },
  { funCode: "lockplayer", funName: "上锁会员", url: "" },
  { funCode: "lockagent", funName: "上锁代理", url: "" },
  { funCode: "unlocksubaccount", funName: "解锁子帐号", url: "" },
  { funCode: "locksubaccount", funName: "上锁子帐号", url: "" }
]

let cnTable = [
  { page: "登录页", key: "请输入会员帐号", value: "请输入会员帐号" },
  { page: "登录页", key: "请输入会员密码", value: "请输入会员密码" },
  { page: "登录页", key: "请输入域名", value: "请输入域名" },
  { page: "登录页", key: "请输入帐号", value: "请输入帐号" },
  { page: "登录页", key: "请输入密码", value: "请输入密码" }
];

let cnGameCodeNameTable = [
  // { gameCode: "1001", key: "1001", gameName: "财神到" },
  // { gameCode: "1002", key: "1002", gameName: "盗墓笔记" },
  // { gameCode: "1003", key: "1003", gameName: "燃爆嘻哈夜" },
  // { gameCode: "1004", key: "1004", gameName: "三倍泰山" },
  // { gameCode: "1005", key: "1005", gameName: "火焰777" },
  // { gameCode: "1006", key: "1006", gameName: "魔童哪吒" },
  // { gameCode: "1007", key: "1007", gameName: "足球风云" },
  // { gameCode: "1008", key: "1008", gameName: "五龙吐珠" },
  // { gameCode: "2001", key: "2001", gameName: "捕鱼来了" },
  // { gameCode: "3003", key: "3003", gameName: "通比牛牛" },
  // { gameCode: "4001", key: "4001", gameName: "禁抢红包" },
];

let cnTypeTable = [];

let cnLoginTable = [
  { key: "accountID", textCONTENT: "帐号", placeholderText: "请输入会员帐号" },
  { key: "password", textCONTENT: "密码", placeholderText: "请输入会员密码" },
  { key: "domain", textCONTENT: "域名", placeholderText: "请输入域名" },
]


var cnFile = {
  loginTextCN(key, textType) {
    let txt = cnLoginTable.find(res => {
      return res.key == key;
    })
    if (textType == "label") {
      return txt.textCONTENT;
    }
    if (textType == "holder") {
      return txt.placeholderText;
    }
  },
  getTable() {
    backendapiService.gamecodelist({ gameType: [] }).then(res => {
      cnGameCodeNameTable = res.data.data.list;
      cnTypeTable = res.data.data.gameType
    })
  },
  getGameCodeName(gameCode) {
    let txt = cnGameCodeNameTable.find(res => {
      return res.gameCode == gameCode
    })
    if (txt == undefined) {
      return gameCode;
    } else {
      return txt.gameName;
    }
  },
  getAccountCode(code) {
    code = "" + code;
    switch (code) {
      case "3101":
        return "入金";
      case "3102":
        return "出金";
      case "2001":
        return "游戏记录";
      case "6001":
        return "活动纪录";
      default:
        return "无此代码";
    }
  },
  getGameTypeName(gameType) {

    let text = cnTypeTable.find(res => {
      return res.gm_TypeSerial == gameType
    })

    if (text == undefined) {
      text = " - "
    } else {
      text = text.gm_GameTypeName
    }
    return text;

    // switch (gameType) {
    //   case 1:
    //     return "老虎机";
    //   case 2:
    //     return "捕鱼机";
    //   case 3:
    //     return "棋牌类";
    //   case 4:
    //     return "小游戏";
    //   default:
    //     return "无此代码";
    // }
  },
  getLoginResult(errorCode) {
    switch (errorCode) {
      case 200:
        return "成功";
      case 1160:
        return "等候可登录时间";
      case 1170:
        return "密码错误";
      case 1130:
        return "IP不允许登录";
      case 1241:
        return "帐号锁定";
      default:

        let codeData = codeHelper.find(obj => {
          return obj.statusCode == errorCode;
        });

        if (codeData != undefined) {
          return codeData.cn
        } else {
          // console.log(errorCode + "not exist");
          return "ErrorCode Not Exist";
        }
    }
  },
  getLockText(bResult) {
    if (bResult) {
      return "上锁";
    }
    return "正常";
  },
  getTransferStatus(bResult) {
    if (parseInt(bResult) > 0) {
      return "成功";
    }
    return "失败";
  },
  getAgentLevelText(level) {
    switch (level) {
      case 1:
        return "总代";
      case 2:
        return "经理";
      case 3:
        return "代理";
      default:
        return "无效的阶层";
    }
  },
  getText(page, key) {
    let data = cnTable.find(f => {
      return f.page == page && f.key == key;
    });
    if (data == null) {
      return "请输入栏位";
    }
    return data.value;
  },
  getRoute(funCode) {

    let data = routeTable.find(f => {
      return f.funCode == funCode;
    });
    if (data == null) {
      return { funCode: "null", funName: "null", url: "/" }
    }
    return data;
  }
};

var twFile = {};

var enFile = {};

var getCurrentLangFile = function () {
  var lang = localStorage.getItem("currentLang");
  switch (lang) {
    case "CN":
      return cnFile;
    case "TW":
      return twFile;
    case "EN":
      return enFile;
    default:
      return cnFile;
  }
};
export { getCurrentLangFile };
