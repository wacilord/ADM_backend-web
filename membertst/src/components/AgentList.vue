
<template>
  <div class="AgentList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代理清单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">代理清单</span>
        </el-row>
        <div class="searchForm">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="状态">
              <el-select v-model="queryParameters.status" placeholder="请选择代理状态">
                <el-option :label="'全部'" :value="0"></el-option>
                <el-option :label="'正常'" :value="1"></el-option>
                <el-option :label="'上锁'" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="帐号">
              <el-input maxlength="40" v-model="queryParameters.accountID" placeholder="请输入帐号(选填)"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="sureBtn" @click="startQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>
    </el-container>
    <div class="textBox" v-if="itemCount == 0">
      <span>暂无资料</span>
      <!-- <span v-if="setParameters">请选择查询条件并查询</span>
      <span v-else>暂无资料</span>-->
    </div>

    <div v-show="itemCount > 0">
      <app-pagination
        :endQuery="endQuery"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :pageCount="pageCount"
        :itemCount="itemCount"
        @clickPage="clickPage"
      ></app-pagination>

      <el-table
        :data="records"
        border
        style="width: 100%"
        class="exportTable"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column fixed prop="accountID" label="帐号" min-width="100"></el-table-column>
        <el-table-column prop="currency" label="币别" min-width="100"></el-table-column>
        <el-table-column prop="levelText" label="阶级" min-width="100"></el-table-column>
        <el-table-column prop="lockText" label="状态" min-width="100"></el-table-column>
        <el-table-column prop="locker" label="上锁者" min-width="100"></el-table-column>
        <el-table-column label="管理" min-width="100">
          <template slot-scope="scope">
            <el-button
              v-show="!scope.row.lock"
              @click="lockAgent(scope.row)"
              type="text"
              size="small"
            >上锁</el-button>
            <el-button
              v-show="scope.row.lock"
              @click="unlockAgent(scope.row)"
              type="text"
              size="small"
            >解锁</el-button>
            <el-button type="text" @click="showDetail(scope.row)" size="small">详情</el-button>
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

export default {
  name: "AgentList",
  components: {
    "app-pagination": Pagination
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "agentlist")) {
        return;
      }
    }

    this.$store.state.showNav = 0;
    // sessionStorage.setItem("reRolad", this.queryParameters.pageIndex);
    if (
      this.accessQueryData.getParameters("agentlist", this.queryParameters) !==
      undefined
    ) {
      this.tempQuery = this.accessQueryData.getParameters(
        "agentlist",
        this.tempQuery
      );
    }

    // if (
    //   this.accessQueryData.getParameters("agentlist", this.tempQuery) !==
    //   undefined
    // ) {
    //   this.tempQuery = this.accessQueryData.getParameters(
    //     "agentlist",
    //     this.tempQuery
    //   );

    //   // this.form.pageIndex = 1;
    //   // this.form = JSON.parse(JSON.stringify(this.tempQuery));
    // }

    this.query();
  },
  data() {
    return {
      loading: true,
      queryParameters: {
        status: 0,
        accountID: "",
        pageIndex: 1,
        pageSize: 10
      },
      pageIndex: 0,
      pageSize: 0,
      pageCount: 0,
      itemCount: 0,
      records: [],
      endQuery: false,
      tempQuery: {
        status: 0,
        accountID: "",
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    ...mapGetters(["accountType"])
  },
  methods: {
    startQuery() {
      this.queryParameters.pageIndex = 1;

      this.tempQuery = JSON.parse(JSON.stringify(this.queryParameters));
      this.query();
    },
    searchPage() {
      backendapiService.agentlist(this.queryParameters).then(res => {
        if (
          res.data.data.pageIndex > res.data.data.pageCount &&
          res.data.data.pageCount !== 0
        ) {
          this.queryParameters.pageIndex = res.data.data.pageCount;
        }
        this.query();
      });
    },
    query() {
      this.loading = true;
      this.endQuery = false;
      // this.accessQueryData.setQueryData("AgentList", this.queryParameters);
      backendapiService.agentlist(this.tempQuery).then(res => {
        if (res.data.statusCode != 200) {
          this.loading = false;
          return;
        }
        // this.setParameters = false;
        // console.log(res);
        this.records = res.data.data.records;
        this.records.forEach(ele => {
          ele.lockText = this.lang.getLockText(ele.lock);
          ele.levelText = this.lang.getAgentLevelText(ele.level);
        });
        this.pageIndex = res.data.data.pageIndex;
        this.pageSize = res.data.data.pageSize;
        this.pageCount = res.data.data.pageCount;
        this.itemCount = res.data.data.itemCount;
        window.setTimeout(() => {
          this.loading = false;
          this.endQuery = true;
        }, 1000);

        // 無代理
        if (this.records.length == 0) {
          if (this.pageIndex - 1 > 0) {
            // this.queryParameters.pageIndex = this.pageIndex - 1;
            this.tempQuery.pageIndex = this.pageIndex - 1;
            this.query();
          }
        }
      });

      this.accessQueryData.setQueryData("agentlist", this.tempQuery);
      let tempData = JSON.parse(JSON.stringify(this.tempQuery));
      this.queryParameters.status = tempData.status;
      this.queryParameters.accountID = tempData.accountID;
    },
    clickPage(e) {
      if (!this.endQuery) {
        return;
      }
      if (e.pageIndex == this.pageCount && this.pageIndex == this.pageCount) {
        return;
      }
      if (e.pageIndex == this.pageIndex) {
        return;
      }
      // this.queryParameters.pageIndex = e.pageIndex;

      this.tempQuery.pageIndex = e.pageIndex;
      this.query();
    },
    lockAgent(row) {
      this.loading = true;
      backendapiService.lockagent({ agentGuid: row.agtGuid }).then(res => {
        if (res.data.statusCode == 200) {
          this.searchPage();
          // this.query();
        } else {
          window.setTimeout(() => (this.loading = false), 1000);
        }
      });
    },
    unlockAgent(row) {
      this.loading = true;
      backendapiService.unlockagent({ agentGuid: row.agtGuid }).then(res => {
        if (res.data.statusCode == 200) {
          this.searchPage();
          // this.query();
        } else {
          window.setTimeout(() => (this.loading = false), 1000);
        }
      });
    },
    showDetail(row) {
      this.$store.dispatch("REQUEST_QUERY_AGT", row);
      this.$router.push({ path: "/DetailAgent" });
      // this.$router.push({
      //   name: "DetailAgent",
      //   params: { agentGuid: row.agtGuid }
      // });
    }
    // resetParameters() {
    //   this.itemCount = 0;
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
  letter-spacing: 1px;
}
.AgentList {
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
.infoBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.infoBox p span {
  margin: 0 5px;
  letter-spacing: 2px;
}
.addBtn {
  background: linear-gradient(#fd3d4d, 40%, #5e0707);
  border: 1px solid rgb(0, 0, 0);
  color: aliceblue;
  font-weight: 700;
  padding: 10.5px 15px;
  text-align: center;
  border-radius: 5px;
  margin-right: 10px;
}

.exportTable {
  margin: 30px 0;
}

@media screen and (max-width: 414px) {
  .LoginLogList {
    padding: 15px;
  }
  .table-row {
    padding: 10px;
  }
  .AgentList {
    padding: 20px;
  }
  .infoBox {
    flex-direction: column;
  }
  .infoBox p {
    margin: 10px 0px;
  }
}
</style>
