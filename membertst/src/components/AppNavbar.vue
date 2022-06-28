<template>
  <div class="AppNavbar">
    <nav class="header-navbar">
      <div class="left">
        <div class="icon-btn Toolbar" @click="Menuoption">
          <i class="fas fa-bars"></i>
        </div>
      </div>
      <div class="right">
        <div class="langBtn">
          <el-dropdown>
            <i class="fas fa-globe-americas"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>简体 zh_CN</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <router-link to="/UserInfo" class="icon-btn userInfo">
          <i class="fas fa-user-circle"></i>
          <span>{{ myAccountID }}</span>
        </router-link>

        <div class="icon-btn" @click="logoutEvent">
          <i class="fas fa-sign-out-alt"></i>
          <span>登出</span>
        </div>
      </div>
    </nav>
    <!-- 隐藏选单 -->
    <transition name="el-zoom-in-top">
      <div class="menuPage" v-show="requestMenu">
        <el-row class="tac">
          <el-col :sm="12" :md="8" class="menu-option">
            <el-menu
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#2e2e2e"
              text-color="#fff"
              active-text-color="#fff"
            >
              <div v-for="item in MyfunType" :key="parseInt(item.funSort)">
                <router-link :to="lang.getRoute(item.funCode).url">
                  <el-menu-item
                    :index="item.funSort.toString()"
                    @click="Menuoption"
                    v-if="getParentMenuType(item) == 1"
                  >
                    <span slot="title">{{
                      lang.getRoute(item.funCode).funName
                    }}</span>
                  </el-menu-item>
                </router-link>

                <el-submenu
                  :index="item.funSort.toString()"
                  v-if="getParentMenuType(item) == 0"
                >
                  <template slot="title" class="tsta">
                    <span>{{ lang.getRoute(item.funCode).funName }}</span>
                  </template>
                  <!-- 子选单 -->
                  <el-menu-item-group>
                    <template v-for="subItem in MyfunAcl">
                      <router-link
                        :to="lang.getRoute(subItem.funCode).url"
                        :key="subItem.funSort.toString()"
                        v-if="checkSubitem(item, subItem)"
                      >
                        <el-menu-item
                          @click="Menuoption"
                          :index="subItem.funSort.toString()"
                          >{{
                            lang.getRoute(subItem.funCode).funName
                          }}</el-menu-item
                        >
                      </router-link>
                    </template>
                  </el-menu-item-group>
                </el-submenu>
              </div>
            </el-menu>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "@fortawesome/fontawesome-free/css/all.css";
import { backendapiService } from "../service/backendapiService.js";

export default {
  name: "AppNavbar",
  computed: {
    ...mapGetters([
      "token",
      "level",
      "accountID",
      "accountType",
      "dbAcl",
      "dbFunType",
      "dbFun",
    ]),
  },
  mounted() {
    if (
      sessionStorage["accountID"] == null &&
      sessionStorage["token"] == null
    ) {
      return;
    }
    this.queryParameters.token = this.$store.getters.token;
    this.myAccountID = this.$store.getters.accountID;

    this.funType = JSON.parse(sessionStorage.getItem("dbFunType"));
    this.funCodeList = JSON.parse(sessionStorage.getItem("dbFun"));
    this.funAcl = JSON.parse(sessionStorage.getItem("dbAcl"));

    // 从VUEX取得agnet_lv subaccount(true/false)
    this.accountLevel = this.$store.getters.level;
    this.accountSub = this.$store.getters.accountType;
    this.query();
  },
  data() {
    return {
      requestMenu: false,
      data: [],
      myAccountID: "",
      accountLevel: "",
      accountSub: false,
      queryParameters: {
        token: "",
      },
      funType: [], // navbar列表 (load DB)
      funCodeList: [], // 权限总表 (load DB)
      funAcl: [], // 子帐号权限表( load DB)
      MyfunType: [], // 自己的navbar列表
      MyfunCodeList: [], // 自己的权限总表
      MyfunAcl: [], // 自己的子帐号权限表
    };
  },
  created() {},
  methods: {
    Menuoption() {
      this.requestMenu = !this.requestMenu;
    },
    handleOpen(key, keyPath) {
      // 开启折叠选项
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // 收合折叠选项
      // console.log(key, keyPath);
    },
    query() {
      this.accountSub = sessionStorage.getItem("accountType");
      // --- 子帐号判断
      if (this.accountSub == 0) {
        this.menuForSubAccount();
      } else {
        this.menuForAgent();
      }
    },
    menuForSubAccount() {
      this.MyfunAcl = this.funCodeList.filter((f) => {
        return this.funAcl.indexOf(f.funCode) > -1;
      });
      this.MyfunAcl = this.MyfunAcl.sort((a, b) => {
        return a.funSort - b.funSort;
      });
      // 取得navbar列表
      let list = this.MyfunAcl.map((f) => {
        return f.parent;
      });
      this.MyfunType = this.funType.filter((res) => {
        return list.indexOf(res.funCode) > -1;
      });
    },
    menuForAgent() {
      let level = this.accountLevel;
      this.MyfunAcl = this.funCodeList.filter((f) => {
        return f["level" + level];
      });
      this.MyfunAcl = this.MyfunAcl.sort((a, b) => {
        return a.funSort - b.funSort;
      });
      let list = this.MyfunAcl.map((f) => {
        return f.parent;
      });
      this.MyfunType = this.funType.filter((res) => {
        return list.indexOf(res.funCode) > -1;
      });
    },
    getSubFun(funCode) {
      let list = [];
      this.funCodeList.forEach((ele) => {
        if (ele.parent == funCode && ele.funType === "MENU") {
          list.push(ele);
        }
      });
      return list;
    },
    getParentMenuType(funType) {
      let subCode = this.getSubFun(funType.funCode);
      if (
        subCode.length == 0 ||
        funType.funCode == "menu5" ||
        funType.funCode == "menu3"
      ) {
        return 1;
      }
      return 0;
    },
    checkShow(code) {
      let isShow = false;
      this.funType.forEach((res) => {
        if (res.funCode === code) {
          isShow = true;
          return;
        }
      });
      return isShow;
    },
    checkChild(code) {
      let isShow = false;
      this.funCodeList.forEach((res) => {
        if (res.funCode === code && res["level" + this.accountLevel] === true) {
          isShow = true;
          return;
        }
      });
      return isShow;
    },
    logoutEvent() {
      this.$store.state.showNav = false;
      window.sessionStorage.clear();
      this.$router.push({
        path: "/Login",
      });
    },
    checkSubitem(item, subitem) {
      let res = false;
      if (subitem.parent == item.funCode && subitem.funType == "MENU") {
        res = true;
      }
      return res;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon-btn {
  cursor: pointer;
  margin: 0 10px;
  color: aliceblue;
}
.icon-btn span {
  font-size: 0.9em;
}
.header-navbar {
  width: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 5px rgba(24, 24, 24, 0.3);
  background: linear-gradient(#5a5a5a, 70%, #444444);
  background: -ms-linear-gradient(#5a5a5a, #444444);
  color: aliceblue;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}
.header-navbar .right {
  display: flex;
  margin-left: auto;
}
.menuPage {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  margin-top: 49px;
  background-color: rgba(100, 100, 100, 0.7);
  -ms-scrollbar-track-color: #1f1f1f;
}
.AppNavbar {
  margin-bottom: 49px;
}
.el-menu {
  border: none;
}
.el-menu-item.is-active {
  background-color: #00665d !important;
}
.el-menu-item:hover {
  background-color: rgba(0, 102, 93, 0.4) !important;
}

.fa-users {
  padding: 3px;
  margin-right: 5px;
}
.fa-file-invoice-dollar,
.fa-user-astronaut,
.fa-coins {
  padding: 6px;
  margin-right: 5px;
}
.menuPage,
.tac {
  width: 100vw;
  height: calc(100% - 50px);
}
.menu-option {
  height: calc(100% + 50px);
  background-color: rgb(46, 46, 46);
  overflow-y: scroll;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: rgb(36, 36, 36);
}
::-webkit-scrollbar-track {
  -webkit-border-radius: 10px;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 4px;
  border-radius: 4px;
  background: #00665d;
}

.langBtn {
  margin: 0 10px;
}
.langBtn i {
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
</style>
