
<template>
  <div class="DetailManager">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/ManagerList' }">经理清单</el-breadcrumb-item>
      <el-breadcrumb-item class="IDtext">经理ID ( {{ queryParameters.accountID }} )</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">经理明细</span>
        </el-row>
        <el-row class="AccountTable">
          <!-- <div class="AgentCard">
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
                    minlength="6"
                    maxlength="20"
                  ></el-input>
                  <p>创建日期 {{ userinfoRecords.createDateTime | dateTimeFormat }}</p>
                </div>
              </div>
              <div class="info-row">
                <div class="text_row cardText">
                  <span class="label-text">层级</span>
                  <span class="value-row">{{ getOrgTreeString }}</span>
                </div>
                <div class="text_row cardText">
                  <span class="label-text">域名</span>
                  <span class="value-row">{{ userinfoRecords.domain }}</span>
                </div>
              </div>
              <a class="cover"></a>
            </div>
          </div>-->

          <!-- NEW****************************************** -->
          <el-col :xs="24" :sm="8" :md="8">
            <div class="flexBox">
              <p class="groupBox">
                <i class="fas fa-id-card"></i> 帐号
              </p>
              <span class="longID">{{ queryParameters.accountID }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8">
            <div class="flexBox">
              <span class="groupBox">
                <i class="fas fa-users"></i> 层级
              </span>
              <span>{{ getOrgTreeString }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8">
            <div class="flexBox">
              <span class="groupBox">
                <i class="fas fa-globe"></i> 域名
              </span>
              <span>{{ userinfoRecords.domain }}</span>
            </div>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12">
            <div class="pwdBox">
              <span class="groupBox toolCard">
                <i class="fas fa-key"></i> 密码设定
                <div class="inputGroup">
                  <el-input
                    v-model="queryParameters.password"
                    placeholder="修改密码"
                    minlength="6"
                    maxlength="20"
                  ></el-input>
                  <p class="pwdTips">
                    <i class="fas pwdIcon">&#xf05a;</i>
                    <span class="pwdText">密码为英文+数字，6~20字</span>
                  </p>
                </div>
                <el-button class="sureBtn" @click="changePasswordEvent">
                  <span>变更密码</span>
                </el-button>
              </span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <div class="pwdBox">
              <span class="groupBox toolCard">
                <i class="fas fa-marker"></i> 备注
                <div class="inputGroup">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    maxlength="100"
                    v-model="queryParameters.memo"
                    class="memoInput"
                  ></el-input>
                </div>
                <el-button class="sureBtn" @click="changeOption">
                  <span>确认修改</span>
                </el-button>
              </span>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24">
            <div class="flexBox dateTimeText">
              <p>创建日期 {{ userinfoRecords.createDateTime | dateTimeFormat }}</p>
            </div>
          </el-col>
          <!-- <div class="AccountTable">
            <div class="flexBox">
              <p class="groupBox">
                <i class="fas fa-id-card"></i> 帐号
              </p>
              <span class="longID">{{ queryParameters.accountID }}</span>
            </div>
            <div class="flexBox">
              <span class="groupBox">
                <i class="fas fa-users"></i> 层级
              </span>
              <span>{{ getOrgTreeString }}</span>
            </div>
            <div class="flexBox">
              <span class="groupBox">
                <i class="fas fa-globe"></i> 域名
              </span>
              <span>{{ userinfoRecords.domain }}</span>
            </div>

            <div class="flexBox dateTimeText">
              <p>创建日期 {{ userinfoRecords.createDateTime | dateTimeFormat }}</p>
            </div>

            <div class="flexBox">
              <el-input
                v-model="queryParameters.password"
                placeholder="修改密码( 选填 )"
                class="rightItem"
                minlength="6"
                maxlength="20"
              ></el-input>
              <p class="pwdTips">
                <i class="fas pwdIcon">&#xf05a;</i>
                <span class="pwdText">密码为英文+数字，6~20字</span>
              </p>
            </div>
          </div>-->
        </el-row>

        <!-- NEW****************************************** -->

        <!-- <el-row class="row-list pwdText-row">
          <i style="font-size:18px ; color: #FFBB94;" class="fas">&#xf05a;</i>
          <span class="pwdText">
            密码需由数字及字母组成
            <br />密码长度应介于6-20字
          </span>
        </el-row>-->
        <!-- <el-row class="row-list pwdText-row">
          <el-button class="sureBtn" @click="changePasswordEvent">
            <span>变更密码</span>
          </el-button>
        </el-row>
        <el-row class="memoBox">
          <div class="textBox">
            <p>备注</p>
          </div>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            maxlength="100"
            v-model="queryParameters.memo"
            class="memoInput"
          ></el-input>
        </el-row>
        <el-row class="row-list pwdText-row">
          <el-button class="sureBtn" @click="changeOption">
            <span>确认修改</span>
          </el-button>
        </el-row>-->
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import { mapGetters } from "vuex";

export default {
  name: "DetailManager",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "managerlist")) {
        return;
      }
    }

    this.$store.state.showNav = 0;
    this.queryParameters.agentGuid = this.getQueryAGT[0].guid;
    // this.queryParameters.agentGuid = this.$route.params.agentGuid;
    this.query();
  },
  data() {
    return {
      editMemo: false,
      queryParameters: {
        accountID: "",
        agentGuid: "",
        password: "",
        memo: ""
      },
      userinfoRecords: [],
      orgTree: []
    };
  },
  computed: {
    ...mapGetters(["getQueryAGT"]),
    getOrgTreeString() {
      if (!this.orgTree) {
        return "";
      }
      return this.orgTree.join(" > ");
    }
  },
  methods: {
    changePasswordEvent() {
      if (this.queryParameters.password !== "") {
        if (this.queryParameters.accountID == this.queryParameters.password) {
          this.$notify.error({
            title: "T9 错误",
            message: "密码不可与帐号相同"
          });
        } else {
          this.changePassword();
        }
      } else {
        this.passwordError("请设定欲变更密码");
      }
    },
    changeOption() {
      this.updateDetail();
    },
    updateDetail() {
      // 编辑备注
      backendapiService
        .updateagent(this.queryParameters)
        .then(res => {
          if (res.data.statusCode === 200) {
            this.$notify({
              title: "T9",
              message: "修改成功",
              type: "success"
            });
            this.query();
          }
        })
        .catch(error => {
          this.$notify.error({
            title: "T9 错误",
            message: "修改失败"
          });
        });
    },
    changePassword() {
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
          .updateagentpassword(this.queryParameters)
          .then(res => {
            if (res.data.statusCode === 200) {
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
    passwordError(txt) {
      this.$notify.error({
        title: "T9 错误",
        message: txt
      });
    },
    EditPassword() {
      this.editMemo = false;
    },
    query() {
      backendapiService.agentdetail(this.queryParameters).then(res => {
        if (res.data.statusCode === 200) {
          this.queryParameters.accountID = res.data.data.accountID;
          this.userinfoRecords = res.data.data;
          this.orgTree = res.data.data.orgTree;
          this.queryParameters.memo = res.data.data.memo;
        }
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

.IDtext {
  word-break: break-all;
}

.app-myCard {
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
}
.textBox {
  border: 3px solid #1f1f1f;
  border-radius: 5px;
  background-color: rgb(54, 54, 54);
  display: flex;
  flex-direction: column;
}
.memoBox {
  padding: 30px;
  width: 60%;
  margin: 0 auto;
}
.memoBox,
.memoInput {
  border-radius: 0px !important;
}
.DetailManager {
  padding: 30px;
  min-height: 100vh;
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
  letter-spacing: 2px;
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

.inputGroup {
  margin: 10px 0;
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
  width: 60%;
  /* margin: 5px 0;
  cursor: pointer; */
}

.pwdText {
  font-size: 12px;
  letter-spacing: 2px;
  margin-left: 5px;
  color: #ffab7b;
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

@media screen and (max-width: 1360px) {
  .info-row {
    flex-direction: column;
    margin-top: 20px;
  }
  .text_row {
    margin: 3px 0;
  }
  .infoBox {
    margin-top: 25px;
  }
  .cardText {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}

@media screen and (max-width: 414px) {
  .table-row {
    padding: 10px;
  }
  .DetailManager {
    padding: 20px;
  }

  .infoBox {
    margin-top: 30px;
  }

  .text_title {
    padding: 15px;
  }
  .memoBox {
    width: 100%;
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
