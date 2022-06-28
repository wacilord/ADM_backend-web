
<template>
  <div class="DetailSubAccount">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/SubAccountList' }">子帐号清单</el-breadcrumb-item>
      <el-breadcrumb-item class="IDtext">子帐号( {{ queryParameters.accountID }} )</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">子帐号明细</span>
        </el-row>
        <div class="textBox_row">
          <div class="textBox">
            <p>变更子帐号使用权限</p>
          </div>
        </div>
        <el-row class="rowBox">
          <el-form ref="form" label-width="80px" class="itemForm">
            <el-form-item :label="item.funName" v-for="item in groupTitle" :key="item.funSort">
              <el-checkbox-group v-model="fixQueryParameters.funCodes">
                <template v-for="inneritem in accountFun">
                  <el-checkbox
                    v-bind:key="inneritem.funSort"
                    name="type"
                    :label="inneritem.funCode"
                    v-if="inneritem.parent == item.funCode || (inneritem.funCode ==  item.funCode &&  item.funCode == 'summary')"
                  >{{ lang.getRoute(inneritem.funCode).funName }}</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-row>
        <div class="textBox_row">
          <div class="textBox">
            <p>备注</p>
          </div>
        </div>
        <el-row class="rowBox">
          <el-input
            class="memoInput"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            maxlength="100"
            v-model="queryParameters.memo"
          ></el-input>
        </el-row>
        <el-row class="rowBox">
          <el-button class="sureBtn detailbtn" @click="changeOption">
            <span>确认修改</span>
          </el-button>
        </el-row>
      </el-row>
    </el-container>

    <el-row class="AccountTable">
      <el-col :xs="24" :sm="12" :md="12">
        <div class="flexBox">
          <p class="groupBox">
            <i class="fas fa-id-card"></i> 帐号
          </p>
          <span class="longID">{{ queryParameters.accountID }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <div class="flexBox">
          <span class="groupBox">
            <i class="fas fa-users"></i> 身份
          </span>
          <span>{{ accountID }}</span>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24">
        <div class="pwdBox">
          <span class="groupBox toolCard">
            <i class="fas fa-key"></i> 密码设定
            <div class="inputGroup">
              <el-input v-model="queryParameters.password" placeholder="修改密码" maxlength="20"></el-input>
              <p class="pwdTips">
                <i class="fas pwdIcon">&#xf05a;</i>
                <span class="pwdText">密码为英文+数字，6~20字</span>
              </p>
            </div>
            <el-button class="sureBtn" @click="changePassword">
              <span>变更密码</span>
            </el-button>
          </span>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24">
        <div class="flexBox dateTimeText">
          <p>创建日期 {{ AccountCreateDatetime | dateTimeFormat }}</p>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row class="row-list">
      <div class="AgentCard">
        <div class="text_title">
          <div class="logobox"></div>
          <div class="text_row infoBox">
            <div class="left">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="right">
              <h1 class="account-text">{{ queryParameters.accountID }}</h1>
              <el-input
                v-model="queryParameters.password"
                placeholder="修改密码( 选填 )"
                class="rightItem"
                maxlength="20"
              ></el-input>
              <p class="createDateTime">创建日期 {{ AccountCreateDatetime | dateTimeFormat }}</p>
            </div>
          </div>
          <div class="info-row">
            <div class="text_row">
              <span class="label-text">身份</span>
              <span class="value-row">{{ accountID }}</span>
            </div>
          </div>
          <a class="cover"></a>
        </div>
      </div>
    </el-row>
    <el-row class="row-list pwdText-row">
      <i style="font-size:18px ; color: #FFBB94;" class="fas">&#xf05a;</i>
      <span class="pwdText">
        密码需由数字及字母组成
        <br />密码长度应介于6-20字
      </span>
    </el-row>
    <div class="btn_row">
      <el-button class="sureBtn" @click="changePassword">
        <span>变更密码</span>
      </el-button>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";

export default {
  name: "DetailSubAccount",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "subaccountlist")) {
        return;
      }
    }
    this.$store.state.showNav = 0;

    let userInfo = JSON.parse(sessionStorage.getItem("querySat"));

    this.queryParameters.accountID = userInfo[0].userId;
    this.queryParameters.satGuid = userInfo[0].guid;

    // this.queryParameters.accountID = this.$route.query.accountID;
    // this.queryParameters.satGuid = this.$route.params.satGuid;
    this.startQueryForList();
  },
  data() {
    return {
      account: "",
      pwd: "",
      memo: "",
      editMemo: false,
      authority: {
        memberManage: [],
        report: [],
        point: [],
        operating: []
      },
      queryParameters: {
        accountID: "",
        satGuid: "",
        token: "",
        password: "",
        memo: ""
      },
      fixQueryParameters: {
        accountID: "",
        satGuid: "",
        token: "",
        password: "",
        memo: "",
        funCodes: []
      },
      funList: [], // 权限总表
      accountFun: [], // 自己的权限表
      groupTitle: [],
      AccountCreateDatetime: ""
    };
  },
  computed: {
    ...mapGetters(["accountID", "token", "level", "getQuerySAT"])
  },
  methods: {
    startQueryForList() {
      this.query();
    },
    query() {
      this.queryParameters.token = this.$store.getters.token;

      this.agentLV = this.$store.getters.level;
      this.getFun();

      backendapiService
        .logsubaccountdetailin(this.queryParameters)
        .then(res => {
          if (res.data.statusCode === 200) {
            this.AccountCreateDatetime = res.data.data.createDatetime;
            this.filterFun();
            this.fixQueryParameters.funCodes = res.data.data.funCodes;
            this.queryParameters.memo = res.data.data.memo;
          }
        });
    },
    EditMemo() {
      this.editMemo = false;
    },
    changeOption() {
      this.fixQueryParameters.accountID = this.queryParameters.accountID;
      this.fixQueryParameters.satGuid = this.queryParameters.satGuid;
      this.fixQueryParameters.token = this.queryParameters.token;
      this.fixQueryParameters.password = this.queryParameters.password;
      this.fixQueryParameters.memo = this.queryParameters.memo;

      this.fixFunCode();
      // this.updateDetail();
    },
    changePassword() {
      this.fixQueryParameters.accountID = this.queryParameters.accountID;
      this.fixQueryParameters.satGuid = this.queryParameters.satGuid;
      this.fixQueryParameters.token = this.queryParameters.token;
      this.fixQueryParameters.password = this.queryParameters.password;
      this.fixQueryParameters.memo = this.queryParameters.memo;

      if (this.fixQueryParameters.password !== "") {
        if (
          this.queryParameters.accountID == this.fixQueryParameters.password
        ) {
          this.$notify.error({
            title: "T9 错误",
            message: "密码不可与帐号相同"
          });
        } else {
          this.updatePassword();
        }
      } else {
        this.passwordError("请设定欲变更密码");
      }
    },
    getFun() {
      this.funList = JSON.parse(sessionStorage.getItem("dbFun"));
    },
    filterFun() {
      // this.accountFun; 我的权限表
      // this.funList; 权限查询总表
      this.accountFun = [];
      let tempFun = [];
      tempFun = this.funList.filter(res => {
        return (
          res.levelSubAccount === true && res["level" + this.agentLV] === true
        );
      });

      tempFun.forEach(element => {
        if (
          element.funCode == "lockagent" ||
          element.funCode == "unlockagent" ||
          element.funCode == "lockplayer" ||
          element.funCode == "unlockplayer" ||
          element.funCode == "playerdetail" ||
          element.funCode == "unlockmanager" ||
          element.funCode == "lockmanager"
        ) {
        } else {
          this.accountFun.push(element);
        }
      });
      // this.accountFun = this.funList.filter(res => {
      //   return (
      //     res.levelSubAccount === true && res["level" + this.agentLV] === true
      //   );
      // });
      this.groupTitle = this.accountFun.filter(res => {
        return res.parent === "";
      });
      this.groupTitle = this.groupTitle.sort(function(a, b) {
        return a.funSort > b.funSort;
      });
    },
    updatePassword() {
      let strength;
      let textContent = "";
      let callAPI = false;
      strength = passwordstrength.checkStrong(this.queryParameters.password);
      switch (strength) {
        case 0:
          textContent = "密码长度应为6-20位数";
          this.passwordError(textContent);
          break;
        case 1:
          textContent = "密码强度太弱";
          this.passwordError(textContent);
          break;
        case 777:
          textContent = "密码不可包含符号";
          this.alertError(textContent);
          break;
        default:
          callAPI = true;
          break;
      }
      if (callAPI) {
        backendapiService
          .updatesubaccountpassword(this.fixQueryParameters)
          .then(res => {
            if (res.data.statusCode == 200) {
              this.$notify({
                title: "T9",
                message: "密码变更成功",
                type: "success"
              });
            }
          });
      }
    },
    alertError(txt) {
      this.$notify.error({
        title: "T9 错误",
        dangerouslyUseHTMLString: true,
        message: txt
      });
    },
    updateDetail() {
      backendapiService
        .updatesubaccount(this.fixQueryParameters)
        .then(res => {
          if (res.data.statusCode === 200) {
            this.startQueryForList();
            this.$notify({
              title: "T9",
              message: "修改成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          this.$notify.error({
            title: "T9 错误",
            message: "修改失败"
          });
        });
    },
    fixFunCode() {
      // let = temp;
      let codes = [
        "playerdetail",
        "unlockplayer",
        "lockplayer",
        "lockagent",
        "unlockagent",
        "unlockmanager",
        "lockmanager",
        "agentdetail",
        "updateagent",
        "updateagentpassword",
        "managerdetail"
      ];
      let codes1 = ["playerdetail", "unlockplayer", "lockplayer"];
      let codes2 = [
        "lockagent",
        "unlockagent",
        "agentdetail",
        "updateagent",
        "updateagentpassword"
      ];
      let codes3 = ["unlockmanager", "lockmanager", "managerdetail"];

      codes.forEach(data => {
        for (let i = 0; i < this.fixQueryParameters.funCodes.length; i++) {
          if (this.fixQueryParameters.funCodes[i] == data) {
            this.fixQueryParameters.funCodes.splice(i, 1);
            break;
          }
        }
      });

      this.fixQueryParameters.funCodes.forEach(ele => {
        if (ele == "playerlist") {
          codes1.forEach(data => {
            this.fixQueryParameters.funCodes.push(data);
          });
        }
        if (ele == "agentlist") {
          codes2.forEach(data => {
            this.fixQueryParameters.funCodes.push(data);
          });
        }
        if (ele == "managerlist") {
          codes3.forEach(data => {
            this.fixQueryParameters.funCodes.push(data);
          });
        }
      });

      this.updateDetail();
    },
    passwordError(txt) {
      this.$notify.error({
        title: "T9 错误",
        message: txt
      });
    }
  }
};
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rowSize {
  width: 100%;
}
.app-myCard {
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
}
.textBox {
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
  padding: 20px;
  text-align: center;
  font-weight: 200;
}
.DetailSubAccount {
  padding: 30px;
  color: aliceblue;
  min-height: 100vh;
}
.row-list {
  display: flex;
  justify-content: center;
}
.card__title {
  font-size: 18px;
  color: #00ffbf;
  line-height: 24px;
  letter-spacing: 5px;
}
.card__header {
  background-color: #434343;
  padding: 10px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
.textBox {
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
  padding: 20px;
  text-align: center;
}
.textBox p {
  font-weight: 200;
  letter-spacing: 2px;
}

.pageGuide {
  /* 页面导览 */
  margin: 15px 0;
  padding: 10px;
}
.textBox_Size {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.exportTable {
  margin-top: 30px;
}

.el-tabs--border-card {
  border: 1px solid #4c4c4c;
  background-color: rgba(46, 46, 46, 0.7);
}
.tabsBox {
  margin-top: 30px;
}

/* 信用卡造型 CSS-setting */
.text_title {
  text-align: center;
  color: white;
  position: relative;
  white-space: nowrap;
  letter-spacing: 5px;
  border-radius: 10px;
  padding: 25px;
}
.cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, black 0%, transparent 50%, black);
  opacity: 0.5;
  border-radius: 10px;
  pointer-events: none;
}
.AgentCard {
  /* 卡片设定 */
  width: 37%;
  max-width: 500px;
  min-width: 320px;
  border-radius: 10px;
  background: -webkit-linear-gradient(#474747, #1a1a1a);
  background: -o-linear-gradient(#474747, #1a1a1a);
  background: -moz-linear-gradient(#474747, #1a1a1a);
  background: linear-gradient(#474747, #1a1a1a);
  box-shadow: 0px 1px 8px #474747;
  margin: 30px 0;
}
.text_row {
  margin: 10px 0;
  display: flex;
  margin-top: 30px;
}
.text_row .left {
  width: 20%;
  font-size: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text_row .right {
  width: 70%;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.textBox_row {
  padding: 20px;
}

.label-text {
  /* 栏位说明文字 */
  font-size: 14px;
  color: rgba(119, 119, 119, 0.993);
  text-align: left;
  margin-bottom: 0.4rem;
  letter-spacing: 3px;
}
.account-text {
  /* 帐号 */
  font-size: 30px;
  letter-spacing: 2px;
  padding: 10px 0;
}
.info-row {
  display: flex;
  justify-content: space-between;
}
.value-row {
  letter-spacing: 1px;
  padding-left: 5px;
}
.logobox {
  /* 浮水印 */
  width: 100px;
  height: 50px;
  /* background: transparent url("/static/TG_LOGO.png") no-repeat; */
  background-position: center;
  background-size: contain;
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0.4;
}

.rightItem {
  margin: 5px 0;
  cursor: pointer;
}
.btn_row {
  padding: 20px;
  display: flex;
  justify-content: center;
}
.rowBox {
  display: flex;
  justify-content: center;
  align-items: center;
}
.itemForm {
  padding: 10px;
}
.memoInput {
  padding: 0 20px 30px 20px;
}

.pwdText {
  font-size: 12px;
  letter-spacing: 2px;
  margin-left: 5px;
  color: #ffab7b;
}
.detailbtn {
  margin-bottom: 20px;
}
.pwdText-row {
  padding: 20px;
}

.createDateTime {
  letter-spacing: 2px;
}

.IDtext {
  word-break: break-all;
}

.inputGroup {
  margin: 10px 0;
}

.boxTitle {
  padding: 10px;
  width: 150px;
  margin: 10px 0;
  background-color: #1f1f1f;
}

.pwdBox {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 20px 0;
}

.pwdText-row {
  padding: 20px 0;
}

.pwdIcon {
  color: #ffab7b;
  font-size: 12px;
}
.pwdTips {
  width: 100%;
}
.shortSize {
  width: 58%;
  margin: 0 auto;
}

.AccountTable {
  width: 100%;
  padding: 30px 30px 0 30px;
}

.dateTimeText {
  color: rgb(124, 124, 124);
  font-size: 14px;
  letter-spacing: 1px;
  margin: 20px 0;
}

.longID {
  word-break: break-all;
  text-align: center;
}

.flexBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px 0;
}

.toolCard {
  height: 200px;
}

.groupBox {
  letter-spacing: 2px;
  background-color: rgb(54, 54, 54);
  padding: 10px 30px;
  margin: 0 0 10px 0;
  border-radius: 5px;
  box-shadow: 2px 2px 3px #000;
  border-top: 2px solid rgb(85, 85, 85);
  border-left: 2px solid rgb(85, 85, 85);
  text-shadow: 2px 2px 3px #000;
}
@media screen and (max-width: 414px) {
  .table-row {
    padding: 10px;
  }
  .DetailSubAccount {
    padding: 10px;
  }
  .text_row {
    margin-top: 10px;
  }
  .infoBox {
    margin-top: 30px;
  }
  .AccountTable {
    padding: 10px;
  }
  .shortSize {
    width: 100%;
  }
  .toolCard {
    padding: 10px;
  }
}
</style>
