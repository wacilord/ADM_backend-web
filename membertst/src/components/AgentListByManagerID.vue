
<template>
  <div class="AgentListByManagerID">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>总代代理清单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">总代代理清单</span>
        </el-row>
        <div class="searchForm">
          <el-form :inline="true" class="demo-form-inline formSize">
            <el-form-item label="所属经理">
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
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="queryParameters.status" placeholder="请选择代理状态">
                <el-option :label="'全部'" :value="0"></el-option>
                <el-option :label="'正常'" :value="1"></el-option>
                <el-option :label="'上锁'" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="帐号">
              <el-input v-model="queryParameters.accountID" placeholder="请输入帐号(选填)" maxlength="40"></el-input>
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
        <el-table-column label="管理" min-width="100">
          <template slot-scope="scope">
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
  name: "AgentListByManagerID",
  components: {
    "app-pagination": Pagination
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "agentlistbymanagerid")) {
        return;
      }
    }
    this.getManagerList();

    this.$store.state.showNav = 0;
    // sessionStorage.setItem("reRolad", this.queryParameters.pageIndex);
    
  },
  data() {
    return {
      loading: true,
      queryParameters: {
        status: 0,
        accountID: "",
        pageIndex: 1,
        pageSize: 10,
        managerAccountID: ""
      },
      tempQuery: {},
      pageIndex: 0,
      pageSize: 0,
      pageCount: 0,
      itemCount: 0,
      records: [],
      setParameters: false,
      endQuery: false,
      managerList: []
    };
  },
  computed: {
    ...mapGetters(["accountType"])
  },
  methods: {
    getManagerList() {
      backendapiService.managerlist({ status: 0, accountID: "" }).then(res => {
        this.managerList = res.data.data.records;
      });
    },
    startQuery() {
      this.queryParameters.pageIndex = 1;
      this.tempQuery = JSON.parse(JSON.stringify(this.queryParameters));

      this.query();
    },
    query() {
      this.loading = true;
      this.endQuery = false;
      // this.accessQueryData.setQueryData("AgentList", this.queryParameters);
      backendapiService.agentlistbymanagerid(this.tempQuery).then(res => {
        if (res.data.statusCode != 200) {
          this.loading = false;
          return;
        }
        this.setParameters = false;
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

        if (this.records.length == 0) {
          if (this.pageIndex - 1 > 0) {
            this.queryParameters.pageIndex = this.pageIndex - 1;
            this.query();
          }
        }
      });
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

      this.queryParameters = JSON.parse(JSON.stringify(this.tempQuery));
      this.query();
    },
    lockAgent(row) {
      this.loading = true;
      backendapiService.lockagent({ agentGuid: row.agtGuid }).then(res => {
        if (res.data.statusCode == 200) {
          this.query();
        } else {
          window.setTimeout(() => (this.loading = false), 1000);
        }
      });
    },
    unlockAgent(row) {
      this.loading = true;
      backendapiService.unlockagent({ agentGuid: row.agtGuid }).then(res => {
        if (res.data.statusCode == 200) {
          this.query();
        } else {
          window.setTimeout(() => (this.loading = false), 1000);
        }
      });
    },
    showDetail(row) {
      this.$store.dispatch("REQUEST_QUERY_AGT", row);
      this.$router.push({ path: "/DetailAgentByMerchant" });
      // this.$router.push({
      //   name: "DetailAgentByMerchant",
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
.AgentListByManagerID {
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

.formSize {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 991px) {
  .formSize {
    display: inline-block;
  }
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
  .formSize {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
