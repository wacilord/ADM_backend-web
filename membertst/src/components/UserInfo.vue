<template>
  <div class="UserInfo">
    <el-card class="UserInfoPage">
      <el-row :gutter="24" class="rowSize" v-if="AccountType == 1">
        <!-- Row1 使用者头像ICON -->
        <el-col :md="24">
          <div class="infoBox">
            <i class="fas fa-user-circle"></i>
          </div>
        </el-col>
        <!-- Row2 基本用户资讯 -->
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <span class="boxTitle">网域名称</span>
            <span>{{ userInfo.domain }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <span class="boxTitle">所属层级</span>
            <span>{{ userInfo.accountID }}</span>
          </div>
        </el-col>
        <!-- Row3 用户密码编辑 -->
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <span class="boxTitle">用户密码</span>
            <el-button icon="el-icon-edit" circle class="editIcon" @click="showPasswordDialog"></el-button>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <span class="boxTitle">登录记录</span>
            <el-button icon="el-icon-s-order" circle class="editIcon" @click="pageToLoginLog"></el-button>
          </div>
        </el-col>
        <!-- Row4 会员资料 -->
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <div class="smCard">
              <h3 class="boxTitle">组织层级</h3>
              <span>{{ getOrgTreeString }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <div class="smCard">
              <h3 class="boxTitle">创建日期</h3>
              <span>{{ userInfo.createDateTime | dateTimeFormat }}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 子帐号 -->
      <el-row :gutter="24" class="rowSize" v-if="AccountType == 0">
        <!-- Row1 使用者头像ICON -->
        <el-col :md="24">
          <div class="infoBox">
            <i class="fas fa-user-circle"></i>
          </div>
        </el-col>
        <!-- Row2 基本用户资讯 -->
        <el-col :xs="24" :sm="8" :md="8">
          <div class="infoBox">
            <span class="boxTitle">网域名称</span>
            <span>{{ userInfo.domain }}</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8">
          <div class="infoBox">
            <span class="boxTitle">所属层级</span>
            <span>{{ userInfo.accountID }}</span>
          </div>
        </el-col>
        <!-- Row3 用户密码编辑 -->
        <el-col :xs="24" :sm="8" :md="8">
          <div class="infoBox">
            <span class="boxTitle">用户密码</span>
            <el-button icon="el-icon-edit" circle class="editIcon" @click="showPasswordDialog"></el-button>
          </div>
        </el-col>
        <!-- Row4 会员资料 -->
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <div class="smCard">
              <h3 class="boxTitle">组织层级</h3>
              <span>{{ getOrgTreeString }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <div class="infoBox">
            <div class="smCard">
              <h3 class="boxTitle">创建日期</h3>
              <span>{{ userInfo.createDateTime | dateTimeFormat }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div class="versionBox">
      <span>T9web-1.1.8</span>
    </div>

    <!-- 修改密码  弹窗-->
    <el-dialog
      title="修改密码"
      :visible.sync="changePassword"
      width="80%"
      center
      :before-close="handleClose"
    >
      <div class="inputList">
        <p>旧密码</p>
        <el-input
          class="myinput"
          placeholder="请输入旧密码"
          v-model="queryParameters.oldPassword"
          maxlength="20"
          show-password
        ></el-input>
      </div>
      <div class="inputList">
        <p>新密码</p>
        <el-input
          placeholder="请输入新密码"
          v-model="queryParameters.password"
          show-password
          maxlength="20"
        ></el-input>
      </div>
      <div class="inputList">
        <p>确认新密码</p>
        <el-input
          placeholder="请再次输入新密码"
          v-model="queryParameters.password2"
          show-password
          maxlength="20"
        ></el-input>
      </div>
      <div class="inputList">
        <i style="font-size:18px ; color: #FFBB94;" class="fas">&#xf05a;</i>
        <span class="pwdText">
          密码需由数字及字母组成
          <br />密码长度应介于6-20字
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" class="cancelBtn">取 消</el-button>
        <el-button @click="save" class="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LoginLogList from "../components/LoginLogList.vue";
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength";

export default {
  name: "UserInfo",
  mounted() {
    this.$store.state.showNav = 0;
    this.AccountType = parseInt(sessionStorage.getItem("accountType"));
    this.init();
  },
  computed: {
    ...mapGetters(["accountID", "domain", "token"]),
    getOrgTreeString() {
      if (!this.userInfo.orgTree) {
        return "";
      }
      return this.userInfo.orgTree.join(">");
    }
  },
  data() {
    return {
      queryParameters: {
        oldPassword: "",
        password: ""
      },
      userInfo: {},
      changePassword: false,
      AccountType: 0
    };
  },
  methods: {
    init() {
      backendapiService.logininfo({}).then(res => {
        this.userInfo = res.data.data;
      });
    },
    checkParameters() {
      var errs = [];
      if (
        this.queryParameters.oldPassword == "" ||
        this.queryParameters.oldPassword == undefined
      ) {
        errs.push("请输入旧密码");
      }
      if (
        this.queryParameters.password == "" ||
        this.queryParameters.password == undefined
      ) {
        errs.push("请输入新密码");
      }
      if (
        this.queryParameters.password2 == "" ||
        this.queryParameters.password2 == undefined
      ) {
        errs.push("请再次输入新密码");
      }
      if (this.queryParameters.password != this.queryParameters.password2) {
        errs.push("两次输入的密码不一致");
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
    save() {
      let errs = this.checkParameters();
      if (errs.length > 0) {
        this.parametersError(errs);
        return;
      }

      if (!this.isStrongPassword(this.queryParameters.password)) {
        return;
      }
      if (this.queryParameters.password == this.$store.getters.accountID) {
        this.$notify.error({
          title: "T9 错误",
          message: "密码不可与帐号相同"
        });
      } else {
        backendapiService.updatepassword(this.queryParameters).then(res => {
          if (res.data.statusCode != 200) {
            return;
          }
          this.updateOk();
        });
      }
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
    cancel() {
      this.queryParameters = {};
      this.changePassword = false;
    },
    showPasswordDialog() {
      this.queryParameters = {};
      this.changePassword = true;
    },
    updateOk() {
      this.queryParameters = {};
      this.$notify({
        title: "T9 成功",
        message: "成功更新密码",
        type: "success"
      });
      this.changePassword = false;
    },
    pageToLoginLog() {
      this.$router.push({
        name: "LoginLogList"
      });
    },
    handleClose(done) {
      this.changePassword = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.UserInfo {
  padding: 50px;
  min-height: 100vh;
}
.UserInfoPage {
  background-color: rgba(46, 46, 46, 0.7);
  border: 2px solid #4c4c4c;
  border-radius: 5px;
  color: aliceblue;
}
.versionBox {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  letter-spacing: 1px;
  color: #8d8d8d;
  font-weight: 700;
  font-size: 10px;
}
.fa-user-circle {
  color: #ff5809;
  font-size: 48px;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.623);
  border: 3px double #4c4c4c;
  border-radius: 50%;
  padding: 5px;
}
.rowSize {
  width: 100%;
  margin: 0 auto !important;
}
.infoBox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  line-height: 50px;
}
.boxTitle {
  color: #8d8d8d;
  padding-right: 15px;
}
.editIcon {
  background-color: rgba(0, 255, 191, 0.3);
  color: aliceblue;
  font-size: 18px;
}

.inputList {
  margin: 20px 0;
}
.inputList p {
  margin: 10px 0;
  color: aliceblue;
}
.cancelBtn {
  background: linear-gradient(#5a5a5a, 70%, #444444);
  border: 1px solid rgb(0, 0, 0);
  color: aliceblue;
  font-weight: 700;
}
.sureBtn {
  background: linear-gradient(#20b2aa, 30%, #00665d);
  border: 1px solid rgb(0, 0, 0);
  color: aliceblue;
  font-weight: 700;
}
.smCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 65%;
  padding: 20px 0;
  border: 3px double #00665d;
  background-color: #00665e25;
}
.smCard .boxTitle {
  text-align: center;
  padding: 0;
  margin-bottom: 10px;
  color: #00ffbf;
}
.icon-btn {
  cursor: pointer;
  margin: 0 15px;
  color: aliceblue;
}
.pwdText {
  font-size: 14px;
  letter-spacing: 2px;
  margin-left: 5px;
  color: #ffbb94;
}
@media screen and (max-width: 991px) {
  .smCard {
    width: 85%;
  }
}
@media screen and (max-width: 414px) {
  .smCard {
    width: 100%;
  }
  .UserInfo {
    padding: 20px;
  }
}
</style>
