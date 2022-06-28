
<template>
  <div class="AddAgentByMerchant">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/AgentListByManagerID' }">总代代理清单</el-breadcrumb-item>
      <el-breadcrumb-item>总代新增代理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">总代新增代理</span>
        </el-row>
        <el-row class="row-list">
          <div class="AgentCard">
            <div class="text_title">
              <div class="logobox"></div>
              <div class="text_row infoBox">
                <div class="left">
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="right">
                  <el-select
                    v-model="queryParameters.managerAccountID"
                    placeholder="请选择经理"
                    class="rightItem"
                  >
                    <el-option
                      v-for="item in managerList"
                      :key="item.agtGuid"
                      :label="item.accountID"
                      :value="item.accountID"
                    ></el-option>
                  </el-select>
                  <el-input
                    v-model="queryParameters.accountID"
                    placeholder="请输入帐号"
                    class="rightItem"
                    maxlength="40"
                  ></el-input>
                  <el-input
                    placeholder="请输入密码"
                    v-model="queryParameters.password"
                    show-password
                    class="rightItem"
                    minlength="6"
                    maxlength="20"
                  ></el-input>
                  <!-- <i class="el-icon-edit rightItem" @click="editMemo = true">备注</i> -->
                </div>
              </div>
              <div class="info-row">
                <div class="text_row">
                  <span class="label-text">阶级</span>
                  <span class="value-row">代理</span>
                </div>
                <div class="text_row">
                  <span class="label-text">域名</span>
                  <span class="value-row">{{ domain }}</span>
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
        <el-row class="memoBox">
          <div class="textBox">
            <p>备注</p>
          </div>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="queryParameters.memo"
            class="memoInput"
            maxlength="100"
          ></el-input>
        </el-row>
      </el-row>
    </el-container>
    <div class="btn_row">
      <el-button class="sureBtn" @click="save">
        <i class="fas fa-user-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { mapGetters } from "vuex";
import { passwordstrength } from "../password/passwordStrength";

export default {
  name: "AddAgentByMerchant",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "addagentbymanagerid")) {
        return;
      }
    }
    this.$store.state.showNav = 0;
    this.getManagerList();
  },
  computed: {
    ...mapGetters(["level", "domain"])
  },
  data() {
    return {
      queryParameters: {
        managerAccountID: "",
        password: "",
        nickName: "",
        memo: ""
      },
      editMemo: false,
      managerList: []
    };
  },
  methods: {
    getManagerList() {
      backendapiService.managerlist({ status: 0, accountID: "" }).then(res => {
        this.managerList = res.data.data.records;
      });
    },
    checkParameters() {
      var errs = [];
      if (this.queryParameters.accountID == "") {
        errs.push("请输入帐号");
      }
      if (this.queryParameters.password == "") {
        errs.push("请输入密码");
      }
      return errs;
    },
    parametersError(errs) {
      let errMsg = errs.join("<br>");
      this.alertError(errMsg);
      this.records = [];
    },
    alertError(txt) {
      this.$notify.error({
        title: "T9 错误",
        dangerouslyUseHTMLString: true,
        message: txt
      });
    },
    isStrongPassword(pwd) {
      let strength = passwordstrength.checkStrong(pwd);
      let textContent = "";
      let checked = false;
      switch (strength) {
        case 0:
          textContent = "密码长度应为6-20位数";
          this.alertError(textContent);
          break;
        case 1:
          textContent = "密码强度太弱";
          this.alertError(textContent);
          break;
        case 777:
          textContent = "密码不可包含符号";
          this.alertError(textContent);
          break;
        default:
          checked = true;
          break;
      }
      return checked;
    },
    isEnableAccount(accountID) {
      if (accountID.length < 6) {
        this.alertError("帐号长度应介于6-20");
        return false;
      }

      let allowID = passwordstrength.checkStrong(accountID);
      if (allowID == 777) {
        this.alertError("帐号不可包含符号");
        return false;
      }
      return true;
    },
    save() {
      let errs = this.checkParameters();
      if (errs.length > 0) {
        this.parametersError(errs);
        return;
      }

      if (
        this.isStrongPassword(this.queryParameters.password) &&
        this.isEnableAccount(this.queryParameters.accountID)
      ) {
        if (this.queryParameters.accountID == this.queryParameters.password) {
          this.$notify.error({
            title: "T9 错误",
            message: "密码不可与帐号相同"
          });
        } else {
          backendapiService
            .addagentbymanagerid(this.queryParameters)
            .then(res => {
              if (res.data.statusCode != 200) {
                return;
              }
              this.updateOk();
            });
        }
      }
    },
    updateOk() {
      this.queryParameters = {};
      this.$notify({
        title: "T9",
        message: "新增成功",
        type: "success"
      });
      this.$router.push({
        name: "AgentListByManagerID"
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
.memoBox {
  padding: 30px;
  width: 60%;
  margin: 0 auto;
}
.memoBox .textBox,
.memoInput {
  border-radius: 0px !important;
}
.AddAgentByMerchant {
  padding: 30px;
  height: 100vh;
  color: aliceblue;
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
  font-weight: 700;
  letter-spacing: 5px;
  line-height: 80px;
  padding: 15px 0;
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
  width: 100%;
  cursor: pointer;
}
.btn_row {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.pwdText {
  font-size: 14px;
  letter-spacing: 2px;
  margin-left: 5px;
  color: #ffbb94;
}

.pwdText-row {
  padding: 20px;
}
@media screen and (max-width: 414px) {
  .table-row {
    padding: 10px;
  }
  .AddAgent {
    padding: 0px;
    padding-top: 20px;
  }
  .text_row {
    margin-top: 10px;
  }
  .infoBox {
    margin-top: 30px;
  }
  .memoBox {
    width: 100%;
  }
}
</style>
