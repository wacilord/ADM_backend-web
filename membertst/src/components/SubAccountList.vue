
<template>
  <div class="SubAccountList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>子帐号清单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">子帐号清单</span>
        </el-row>
        <el-row class="textBox_Size" v-if="tableData.length == 0">
          <div class="textBox">
            <span>暂无资料</span>
          </div>
        </el-row>
      </el-row>
    </el-container>

    <div v-show="tableData.length >0">
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
        <el-table-column fixed label="子帐号" min-width="120">
          <template slot-scope="prop">
            <div style="text-align:center;">{{ prop.row.accountID }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="prop">
            <div style="text-align:center;">{{ prop.row.enable ? "正常":"上锁" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginDateTime"
          :formatter="(row, column, cell) => _f('dateTimeFormat')(cell)"
          label="最后登入时间"
          min-width="170"
          style="text-align:center;"
        ></el-table-column>
        <el-table-column label="最后登入IP" min-width="100">
          <template slot-scope="prop">
            <div style="text-align:center;">{{ prop.row.lastIP }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDateTime"
          :formatter="(row, column, cell) => _f('dateTimeFormat')(cell)"
          label="建立时间"
          min-width="170"
        ></el-table-column>
        <el-table-column label="管理" min-width="100">
          <template slot-scope="scope">
            <div style="text-align:center;">
              <el-button
                @click="lock(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.enable == 1"
              >上锁</el-button>
              <el-button
                @click="unLock(scope.row)"
                type="text"
                size="small"
                v-if="scope.row.enable == 0"
              >解锁</el-button>
              <el-button @click="showDetail(scope.row)" type="text" size="small">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { mapGetters } from "vuex";

export default {
  name: "SubAccountList",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "subaccountlist")) {
        return;
      }
    }
    this.query();
    this.$store.state.showNav = 0;
  },
  data() {
    return {
      IsSearch: true,
      loading: true,
      queryParameters: {},
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["accountType"])
  },
  methods: {
    lock(row) {
      this.loading = true;
      backendapiService.locksubaccount({ satGuid: row.satGuid }).then(res => {
        if (res.data.statusCode === 200) {
          this.query();
        }
      });
    },
    unLock(row) {
      this.loading = true;
      backendapiService.unlocksubaccount({ satGuid: row.satGuid }).then(res => {
        if (res.data.statusCode === 200) {
          this.query();
        }
      });
    },
    pageToDetail(row) {
      this.$router.push({
        name: "DetailSubAccount",
        params: { accountID: row.accountID }
      });
    },
    search() {
      this.query();
    },
    query() {
      this.loading = true;
      // this.accessQueryData.setQueryData("SubAccountList", this.queryParameters);
      backendapiService.subaccountlist(this.form).then(res => {
        if (res.data.statusCode === 200) {
          this.tableData = res.data.data;
          this.tableData.forEach(ele => {
            ele.lockText = this.lang.getLockText(ele.isLock);
          });
          window.setTimeout(() => (this.loading = false), 1000);
        }
      });
    },
    showDetail(row) {
      this.$store.dispatch("REQUEST_QUERY_SAT", row);
      this.$router.push({ path: "/DetailSubAccount" });
      // this.$router.push({
      //   name: "DetailSubAccount",
      //   params: { satGuid: row.satGuid },
      //   query: { accountID: row.accountID }
      // });
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
.SubAccountList {
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
}

.exportTable {
  margin-top: 30px;
}

@media screen and (max-width: 414px) {
  .LoginLogList {
    padding: 15px;
  }
  .table-row {
    padding: 10px;
  }
  .SubAccountList {
    padding: 20px;
  }
}
</style>
