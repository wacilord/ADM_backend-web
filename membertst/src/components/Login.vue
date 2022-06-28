<template>
  <div class="Login">
    <div
      class="newLogo"
      v-bind:style="{
        'background-image': 'url(' + myImgUrl + 'logo/T9LOGO.png)',
      }"
    ></div>
    <div v-show="isMobile" class="TG_title"></div>
    <el-row type="flex" justify="center" class="rowSize">
      <el-col :xs="20" :sm="16" :md="12" :lg="10" class="loginCard">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item
            prop="accountID"
            class="input_margin"
            :label="this.lang.loginTextCN('accountID', 'label')"
          >
            <el-input
              v-model="ruleForm.accountID"
              :placeholder="this.lang.loginTextCN('accountID', 'holder')"
              class="loginInput"
              maxlength="40"
              minlength="6"
            ></el-input>
          </el-form-item>

          <el-form-item
            prop="password"
            class="input_margin"
            :label="this.lang.loginTextCN('password', 'label')"
          >
            <el-input
              :placeholder="this.lang.loginTextCN('password', 'holder')"
              v-model="ruleForm.password"
              show-password
              maxlength="20"
              minlength="6"
              class="loginInput"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="domain"
            class="input_margin"
            :label="this.lang.loginTextCN('domain', 'label')"
          >
            <el-input
              v-model="ruleForm.domain"
              :placeholder="this.lang.loginTextCN('domain', 'holder')"
              class="loginInput"
              maxlength="20"
              minlength="6"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btnLogin"
              ref="loginBtn"
              @click="login('ruleForm')"
              v-bind:style="{
                'background-image':
                  'url(' + myImgUrl + 'backend/loginImage/button.png)',
              }"
            ></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
import { configData } from "../config/config.js";
import SelectLineService from "../service/selectLineService";
import { backendapiService } from "../service/backendapiService.js";

export default {
  name: "Login",
  data() {
    return {
      myImgUrl: "",
      isMobile: false,
      ruleForm: {
        accountID: "",
        password: "",
        domain: "",
      },
      lineServerData: {
        /**
         * 選線檔上方資料
         */
        lineInfo: null,
        /**
         * 選線檔選線資料
         */
        lineData: null,
      },
      rules: {
        accountID: [
          {
            required: true,
            message: this.lang.getText("登录页", "请输入帐号"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.lang.getText("登录页", "请输入密码"),
            trigger: "blur",
          },
        ],
        domain: [
          {
            required: true,
            message: this.lang.getText("登录页", "请输入域名"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 在methods裡需透過 this.$store.commit("mutations事件名稱")，但透過...mapMutations(["setUserId"])更方便

    ...mapMutations([
      "setAccountID",
      "setDomain",
      "setToken",
      "setLevel",
      "setAccountType",
      "setAcl",
      "setFunType",
      "setFun",
      "setGameType",
    ]),
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          backendapiService.login(this.ruleForm).then((res) => {
            if (res.data.statusCode === 200) {
              this.setAccountID(this.ruleForm.accountID);
              this.setDomain(this.ruleForm.domain);
              this.setToken(res.data.data.token);
              this.setLevel(res.data.data.agentLevel);
              this.setGameType(res.data.data.gameTypes);

              if (res.data.data.type === 0) this.setAccountType(0);
              if (res.data.data.type !== 0) this.setAccountType(1);
              sessionStorage.setItem("firstLogin", res.data.data.firstLogin);
              this.getMenuData();

              // backendapiService.gamecodelist({gameType:[]}).then(res => {
              //   var gameType=[];
              //   for (var i=0;i<res.data.data.gameType.length;i++) {
              //     var element=res.data.data.gameType[i];
              //     //console.log(element);
              //     gameType.push({"typeCode":element.gm_TypeSerial,"value":element.gm_GameTypeName});
              //   }

              // sessionStorage.setItem("gameTypeName",JSON.stringify(gameType));

              // });

              //(var i in obj) 方法
              //  backendapiService.gamecodelist({gameType:[]}).then(res => {
              //   //  console.log(res.data.data.gameType)
              //   var gameType=[];
              //   for (var i in res.data.data.gameType) {
              //     var element = res.data.data.gameType[i];
              //     console.log(element);
              //     gameType.push({"typeCode":element.gm_TypeSerial,"value":element.gm_GameTypeName});
              //   }

              //   sessionStorage.setItem("gameTypeName",JSON.stringify(gameType));

              // });

              //forEach 方法
              backendapiService.gamecodelist({ gameType: [] }).then((res) => {
                var gameType = [];
                var element = res.data.data.gameType;

                element.forEach((res) => {
                  gameType.push({
                    typeCode: res.gm_TypeSerial,
                    value: res.gm_GameTypeName,
                  });
                });

                sessionStorage.setItem(
                  "gameTypeName",
                  JSON.stringify(gameType)
                );
              });
            }
          });
        }
      });
    },
    getMenuData() {
      // call menulist
      //   --(funType) => 渲染下拉title  //  --(fun) => 权限总表
      backendapiService.menulist(this.queryParameters).then((res) => {
        if (res.data.statusCode === 200) {
          this.setFun(res.data.data.fun); // 权限总表( load DB)
          this.setFunType(res.data.data.funType); // navbar列表( load DB)
          this.setAcl(res.data.data.acl); // 子帐号权限表( load DB)
          this.$router.push({ path: "/" });
        }
      });
    },
    init() {
      this.startSelectLine();
    },
    startSelectLine() {
      let getSelectLineService = new SelectLineService();
      getSelectLineService.init();

      getSelectLineService.setConfigLocation(configData.lineUrl);
      getSelectLineService.setFinishJob((info, data) => {
        this.lineServerData.lineInfo = info;
        this.lineServerData.lineData = data;
        configData.backendAPIUrl = data.backendAPI;
        configData.staticUrl = info.resourceUrl;

        sessionStorage.setItem("api", configData.backendAPIUrl);
        this.myImgUrl = info.resourceUrl;
        sessionStorage.setItem("static", info.resourceUrl);

        var elHead, elLink;
        elLink = document.createElement("link");
        elLink.rel = "icon";
        elLink.type = "image/x-icon";
        elLink.href = info.resourceUrl + "icon/T9LOGO_ICO.ico";
        elHead = document.getElementsByTagName("head")[0];
        elHead.appendChild(elLink);

        document
          .querySelector(".btnLogin")
          .addEventListener("mouseover", function () {
            document
              .querySelector(".btnLogin")
              .setAttribute(
                "style",
                `background-image: url(${info.resourceUrl}backend/loginImage/button-hover.png)`
              );
          });

        document
          .querySelector(".btnLogin")
          .addEventListener("mouseout", function () {
            document
              .querySelector(".btnLogin")
              .setAttribute(
                "style",
                `background-image: url(${info.resourceUrl}backend/loginImage/button.png)`
              );
          });

        sessionStorage.setItem("api", configData.backendAPIUrl);
      });
      getSelectLineService.startSelectLine();
    },
    changeImg() {
      alert(111);
      // if (data == 1) {
      //   document
      //     .querySelector(".btnLogin")
      //     .setAttribute(
      //       "style",
      //       `background-image: url(${myImgUrl}backend/loginImage/button-hover.png)`
      //     );
      // } else {
      //   document
      //     .querySelector(".btnLogin")
      //     .setAttribute(
      //       "style",
      //       `background-image: url(${myImgUrl}backend/loginImage/button.png)`
      //     );
      // }
    },
  },

  mounted() {
    this.$store.state.showNav = 1;
    if (window.innerWidth <= 414) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.init();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-image: url("../../static/loginImage/BG1.png"); */
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #1d1718;
  min-height: 100vh;
}
.loginCard {
  padding: 20px !important;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  box-shadow: 3px 3px 10px rgb(24, 24, 24);
}
.rowSize {
  width: 100%;
}

.btnLogin {
  /* background-image: url("https://game1.bjjnsj.com/frontend/backend/loginImage/button.png"); */
  background-size: cover;
  background-color: transparent !important;
  border: none;
  padding: 25px 60px;
  margin-top: 10px;
}
.btnLogin:hover {
  /* background-image: url("https://game1.bjjnsj.com/frontend/backend/loginImage/button-hover.png"); */
}
.input_margin {
  margin-bottom: 5px;
  font-weight: 700;
}
.el-form-item__label {
  color: #fff !important;
}
.TG_title {
  width: 100%;
  height: 50px;
  position: fixed;
  top: 75px;
  /* background-image: url("../../static/loginImage/title.png"); */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.newLogo {
  width: 300px;
  height: 70px;
  position: fixed;
  bottom: 10px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* background-image: url("https://game1.bjjnsj.com/frontend/logo/T9LOGO.png"); */
}
@media screen and (max-width: 414px) {
  .Login {
    /* background-image: url("../../static/loginImage/bg414.png"); */
    background-color: #1d1921;
  }
  .loginCard {
    background-color: transparent;
    box-shadow: none;
  }
}
</style>
