
<template>
  <div class="FirstPassword">
    <el-row :gutter="10" class="rowSize">
      <div
        class="imgBox"
        v-bind:style="{
          'background-image': 'url(' + myUrl + 'backend/character.png)',
        }"
      ></div>
      <el-col :xs="24" :sm="14" :md="14" class="colSize">
        <el-form ref="form" :model="form" label-width="80px" class="myform">
          <el-form-item label="旧密码">
            <el-input
              v-model="form.oldPassword"
              placeholder="请输入内容"
              maxlength="20"
              minlength="6"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
              placeholder="请输入密码"
              v-model="form.password"
              show-password
              maxlength="20"
              minlength="6"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码确认">
            <el-input
              placeholder="请输入密码"
              v-model="form.checkPassword"
              show-password
              maxlength="20"
              minlength="6"
            ></el-input>
          </el-form-item>
          <el-form-item class="textBox">
            <i style="font-size: 18px; color: #ffbb94" class="fas">&#xf05a;</i>
            <span class="pwdText">
              密码需由数字及字母组成
              <br />密码长度应介于6-20字
            </span>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" class="sureBtn">确认变更</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import { mapGetters } from "vuex";
import { configData } from "../config/config.js";

export default {
  name: "FirstPassword",
  mounted() {
    this.$store.state.showNav = 1;
    this.myUrl = configData.staticUrl;
  },
  data() {
    return {
      form: {
        oldPassword: "",
        password: "",
        checkPassword: "",
      },
      myUrl: "",
    };
  },
  methods: {
    onSubmit() {
      // let allOk = 0;
      // if (
      //   this.form.oldPassword == "" ||
      //   this.form.password == "" ||
      //   this.form.checkPassword == ""
      // ) {
      //   this.passwordError("请确实输入栏位");
      // } else {
      //   if (this.form.password == this.form.checkPassword) {
      //     allOk += 1;
      //   } else {
      //     this.passwordError("两次输入的密码不一致");
      //   }
      //   if (this.changePassword(this.form.password)) {
      //     allOk += 1;
      //   }
      //   if (allOk == 2) {
      //     if (this.$store.getters.accountID == this.form.password) {
      //       this.passwordError("密码不可与帐号相同");
      //       this.form.password = "";
      //       this.form.checkPassword = "";
      //     } else {
      //       this.callAPI();
      //     }
      //   }
      // }

      var errs = [];
      if (
        this.form.oldPassword == "" ||
        this.form.password == "" ||
        this.form.checkPassword == ""
      ) {
        errs.push("请确实输入栏位");
      }
      if (this.form.password != this.form.checkPassword) {
        errs.push("两次输入的密码不一致");
      }

      if (this.$store.getters.accountID == this.form.password) {
        errs.push("密码不可与帐号相同");
      }

      let strength = passwordstrength.checkStrong(this.form.password);
      if (strength == 0) {
        errs.push("密码长度应为6-20位数");
      }
      if (strength == 1) {
        errs.push("密码强度太弱");
      }
      if (strength == 777) {
        errs.push("密码不可包含符号");
      }

      if (errs.length > 0) {
        this.parametersError(errs);
        return;
      } else {
        this.callAPI();
      }
    },
    parametersError(errs) {
      let errMsg = errs.join("<br>");
      this.alertError(errMsg);
    },
    changePassword(pwd) {
      let strength = passwordstrength.checkStrong(pwd);
      let textContent = "";
      let checked = false;
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
          checked = true;
          break;
      }
      return checked;
    },
    passwordError(txt) {
      setTimeout(() => {
        this.$notify.error({
          title: "T9 错误",
          message: txt,
        });
      }, 100);
    },
    alertError(txt) {
      this.$notify.error({
        title: "T9 错误",
        dangerouslyUseHTMLString: true,
        message: txt,
      });
    },
    callAPI() {
      backendapiService.updatepassword(this.form).then((res) => {
        if (res.data.statusCode === 200) {
          this.$notify({
            title: "T9",
            message: "密码变更成功",
            type: "success",
          });
          sessionStorage.setItem("firstLogin", "false");
          this.$router.push({ path: "/" });
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.FirstPassword {
  color: #fff !important;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-height: 100vh;
}
.rowSize {
  margin: 0 !important;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.myform {
  padding: 20px;
  position: relative;
  z-index: 5;
}
.imgBox {
  width: 50%;
  height: 80vh;
  /* background-image: url("https://game1.bjjnsj.com/frontend/backend/character.png"); */
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  left: 0;
}
.pwdText {
  font-size: 14px;
  letter-spacing: 2px;
  margin-left: 5px;
  color: #ffbb94;
}

@media screen and (max-width: 768px) {
  .imgBox {
    width: 100%;
    height: 100vh;
    background-size: cover;
  }
  .myform {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
  .colSize {
    width: 100%;
  }
}
</style>
