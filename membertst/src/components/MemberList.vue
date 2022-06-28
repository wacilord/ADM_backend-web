
<template>
  <div class="MemberList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员清单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">会员清单</span>
        </el-row>
        <div class="searchForm">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择会员状态">
                <el-option :label="'全部'" :value="0"></el-option>
                <el-option :label="'正常'" :value="1"></el-option>
                <el-option :label="'上锁'" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="帐号">
              <el-input v-model="form.accountID" placeholder="请输入帐号(选填)" maxlength="40"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="sureBtn" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>
    </el-container>
    <div class="textBox" v-if="tableData.length ==0">
      <span>暂无资料</span>
      <!-- <span v-if="setParameters">请选择查询条件并查询</span>
      <span v-else>暂无资料</span>-->
    </div>
    <div v-if="tableData.length >0">
      <app-pagination
        :name="this"
        :endQuery="endQuery"
        :pageIndex="form.pageIndex"
        :pageSize="form.pageSize"
        :pageCount="form.pageCount"
        :itemCount="form.itemCount"
        @clickPage="clickPage"
      ></app-pagination>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="exportTable"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column fixed prop="accountID" label="帐号" min-width="150"></el-table-column>
        <el-table-column prop="agentTree" label="阶层" min-width="300">
          <template slot-scope="prop">{{ filterLevel(prop.row.agentTree) }}</template>
        </el-table-column>
        <el-table-column prop="currency" label="币别" min-width="100"></el-table-column>
        <el-table-column label="余额" min-width="120">
          <template slot-scope="prop">
            <div style="text-align:right;">{{ getfloat(prop.row.point) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="lockText" label="状态" min-width="100"></el-table-column>
        <el-table-column prop="lockerAccountID" label="上锁者" min-width="100"></el-table-column>
        <el-table-column label="管理" min-width="100">
          <template slot-scope="scope">
            <div class="toolcell">
              <div v-if="accountLV >= 3">
                <el-button
                  v-show="!scope.row.lock"
                  @click="lockplayer(scope.row)"
                  type="text"
                  size="small"
                >上锁</el-button>
                <el-button
                  v-show="scope.row.lock"
                  @click="unlockplayer(scope.row)"
                  type="text"
                  size="small"
                >解锁</el-button>
              </div>

              <el-button type="text" size="small" @click="pageToDetail(scope.row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { backendapiService } from "../service/backendapiService.js";
import { mapGetters } from "vuex";
import { passwordstrength } from "../password/passwordStrength.js";

export default {
  name: "MemberList",
  components: {
    "app-pagination": Pagination
  },
  data() {
    return {
      loading: true,
      form: {
        status: 0,
        pageIndex: 1,
        pageSize: 15,
        accountID: ""
      },
      tempQuery: {
        status: 0,
        pageIndex: 1,
        pageSize: 15,
        accountID: ""
      },
      tableData: [],
      // setParameters: false,
      endQuery: false,
      accountLV: null
    };
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "playerlist")) {
        return;
      }
    }

    this.accountLV = sessionStorage.getItem("level");
    this.form = this.accessQueryData.getParameters("playerList", this.form);

    if (
      this.accessQueryData.getParameters("playerList", this.tempQuery) !==
      undefined
    ) {
      this.tempQuery = this.accessQueryData.getParameters(
        "playerList",
        this.tempQuery
      );

      this.form.pageIndex = 1;
      this.form = JSON.parse(JSON.stringify(this.tempQuery));
    }

    this.$store.state.showNav = 0;
    this.query();
  },
  computed: {
    ...mapGetters(["token"])
  },
  methods: {
    filterLevel(data) {
      let text = "";
      for (let i = 0; i < data.length; i++) {
        text = text + data[i];
        if (i + 1 < data.length) {
          text = text + " > ";
        }
      }
      return text;
    },
    lockplayer(row) {
      this.loading = true;
      let getToken = this.$store.getters.token;
      backendapiService
        .lockplayer({ token: getToken, plyGuid: row.playerGuid })
        .then(res => {
          if (res.data.statusCode == 200) {
            // this.query();
            this.searchPage();
          } else {
            window.setTimeout(() => (this.loading = false), 1000);
          }
        });
    },
    unlockplayer(row) {
      this.loading = true;
      let getToken = this.$store.getters.token;
      backendapiService
        .unlockplayer({ token: getToken, plyGuid: row.playerGuid })
        .then(res => {
          if (res.data.statusCode == 200) {
            // this.search();
            // this.query();
            this.searchPage();
          } else {
            window.setTimeout(() => (this.loading = false), 1000);
          }
        });
    },
    searchPage() {
      backendapiService.playerlist(this.form).then(res => {
        if (res.data.statusCode === 200) {
          if (
            res.data.data.pageIndex > res.data.data.pageCount &&
            res.data.data.pageCount !== 0
          ) {
            this.form.pageIndex = res.data.data.pageCount;
          }
          this.query();
          // console.log(res);
          // this.form.pageIndex = res.data.data.pageIndex;
          // this.query();
        } else {
          this.tableData = [];
        }
      });
    },
    pageToDetail(row) {
      // sessionStorage.setItem("reload", this.form.pageIndex);
      // this.form = this.accessQueryData.setQueryData("playerList", this.form);
      // this.tempQuery = this.accessQueryData.setQueryData(
      //   "playerList",
      //   this.tempQuery
      // );

      this.$store.dispatch("REQUEST_QUERY_USER", row);
      this.$router.push({ path: "/DetailPlayerList" });

      // this.$router.push({
      //   name: "DetailPlayerList",
      //   params: { accountID: row.accountID }
      // });
    },
    clickPage(e) {
      if (!this.endQuery) {
        return;
      }
      if (
        e.pageIndex == this.form.pageCount &&
        this.form.pageIndex == this.form.pageCount
      ) {
        return;
      }
      if (e.pageIndex == this.form.pageIndex) {
        return;
      }

      this.form.pageIndex = e.pageIndex;
      this.tempQuery.pageIndex = e.pageIndex;

      // this.form = JSON.parse(JSON.stringify(this.tempQuery))
      this.query();
    },
    search() {
      this.form.pageIndex = 1;
      this.form.pageSize = 15;
      this.form.pageCount = 1;
      this.form.itemCount = 1;

      this.tempQuery = JSON.parse(JSON.stringify(this.form));

      this.query();
    },
    query() {
      this.loading = true;
      this.endQuery = false;

      // this.setQueryData.setItem("memberList", this.form);
      backendapiService.playerlist(this.tempQuery).then(res => {
        if (res.data.statusCode === 200) {
          // this.setParameters = false;
          this.tableData = res.data.data.records;
          this.tableData.forEach(ele => {
            ele.lockText = this.lang.getLockText(ele.lock);
          });
          this.form.pageIndex = res.data.data.pageIndex;
          this.form.pageSize = res.data.data.pageSize;
          this.form.pageCount = res.data.data.pageCount;
          this.form.itemCount = res.data.data.itemCount;

          window.setTimeout(() => {
            this.loading = false;
            this.endQuery = true;
          }, 1000);
        } else {
          // 隱藏
          this.endQuery = false;
          // this.setParameters = false;
          this.tableData = [];
        }
      });

      this.accessQueryData.setQueryData("playerList", this.tempQuery);
      let tempData = JSON.parse(JSON.stringify(this.tempQuery));
      this.form.status = tempData.status;
      this.form.accountID = tempData.accountID;
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    }
    // resetParameters() {
    //   this.tableData.length = 0;
    //   this.setParameters = true;
    // }
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
  margin: 30px 0;
}
.MemberList {
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
.pageGuide {
  /* 页面导览 */
  margin: 15px 0;
  padding: 10px;
}
.searchForm {
  padding: 20px;
  display: flex;
  justify-content: center;
}
.el-select-dropdown__item.selected {
  color: #fff;
  background-color: #00665d;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  color: #fff;
  background-color: #00ffbfa9;
}

.exportTable {
  margin: 30px 0;
}

.toolcell {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
@media screen and (max-width: 414px) {
  .LoginLogList {
    padding: 15px;
  }
  .table-row {
    padding: 10px;
  }
  .MemberList {
    padding: 20px;
  }
}
</style>
