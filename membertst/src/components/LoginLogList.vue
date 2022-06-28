
<template>
  <div class="LoginLogList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/UserInfo' }">我的资料</el-breadcrumb-item>
      <el-breadcrumb-item>登录记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">登录记录</span>
        </el-row>
      </el-row>
    </el-container>
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
      <el-table-column fixed prop="ip" label="IP" min-width="150"></el-table-column>
      <el-table-column prop="createDateTime" label="时间" min-width="200"></el-table-column>
      <el-table-column prop="loginID" label="帐号" min-width="150"></el-table-column>
      <el-table-column prop="resultText" label="结果" min-width="200"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { backendapiService } from "../service/backendapiService.js";
export default {
  name: "LoginLogList",
  components: {
    "app-pagination": Pagination
  },
  data() {
    return {
      loading: true,
      queryParameters: {
        pageIndex: 1,
        pageSize: 10
      },
      records: [],
      pageIndex: 0,
      pageSize: 0,
      itemCount: 0,
      pageCount: 0,
      endQuery: false
    };
  },
  mounted() {
    this.$store.state.showNav = 0;
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.endQuery = false;
      backendapiService.loginloglist(this.queryParameters).then(res => {
        if (res.data.statusCode == 200) {
          this.records = res.data.data.records;
          this.records.forEach(ele => {
            ele.resultText = this.lang.getLoginResult(ele.errorCode);
          });
          this.pageIndex = res.data.data.pageIndex;
          this.pageSize = res.data.data.pageSize;
          this.pageCount = res.data.data.pageCount;
          this.itemCount = res.data.data.itemCount;

          window.setTimeout(() => {
            this.loading = false;
            this.endQuery = true;
          }, 1000);
        }
      });
    },
    clickPage(e) {
      if (!this.endQuery) {
        return;
      }
      this.queryParameters.pageIndex = e.pageIndex;
      this.query();
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
.LoginLogList {
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

@media screen and (max-width: 414px) {
  .LoginLogList {
    padding: 15px;
  }
  .table-row {
    padding: 10px;
  }
}
</style>
