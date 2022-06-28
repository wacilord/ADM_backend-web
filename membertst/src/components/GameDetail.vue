
<template>
  <div class="GameDetail">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>依注单号查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">依注单号查询</span>
        </el-row>
        <el-row class="textBox_Size">
          <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="注单号">
              <el-input v-model="queryParameters.seq" placeholder="请输入注单号" maxlength="60"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="sureBtn" @click="startQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-row>
    </el-container>

    <div v-show="records.length > 0">
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
        <el-table-column fixed prop label="注单号" min-width="200">
          <template slot-scope="prop">
            <div class="seq" @click="getDetail(prop.row.seq)">{{ prop.row.seq }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="accountID" label="会员帐号" min-width="100"></el-table-column>
        <el-table-column prop="gameTypeName" label="游戏类型" min-width="100"></el-table-column>
        <el-table-column prop="gameCodeName" label="游戏名称" min-width="100"></el-table-column>
        <el-table-column prop="currency" label="币别" min-width="100"></el-table-column>
        <el-table-column prop label="投注额" min-width="100">
          <template slot-scope="prop">
            <div style="text-align:right;">{{ getfloat(prop.row.bets) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop label="有效投注额" min-width="100">
          <template slot-scope="prop">
            <div style="text-align:right;">{{ getfloat(prop.row.validBets) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop label="盈利" min-width="100">
          <template slot-scope="prop">
            <div style="text-align:right;">{{ getfloat(prop.row.netWin) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="游戏时间"
          :formatter="(row, column, cell) => _f('dateTimeFormat')(cell)"
          min-width="180"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";

export default {
  name: "GameDetail",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "gamedetail")) {
        return;
      }
    }
    this.$store.state.showNav = 0;
    this.lang.getTable();
  },
  data() {
    return {
      queryParameters: {
        seq: "",
      },
      records: [],
      loading: true,
      queryDetailParameters: {
        gameTurn: "",
      },
    };
  },
  methods: {
    checkParameters() {
      var errs = [];
      if (this.queryParameters.seq == "") {
        errs.push("请输入注单号");
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
        message: txt,
      });
    },
    startQuery() {
      let errs = this.checkParameters();
      if (errs.length > 0) {
        this.parametersError(errs);
        return;
      }
      this.query();
    },
    query() {
      this.loading = true;
      backendapiService.gamedetail(this.queryParameters).then((res) => {
        if (res.data.statusCode != 200) {
          this.records = [];
          return;
        }
        this.records = res.data.data.records;
        this.records.forEach((ele) => {
          ele.gameTypeName = this.lang.getGameTypeName(ele.gameType);
          ele.gameCodeName = this.lang.getGameCodeName(ele.gameCode);
        });
        window.setTimeout(() => (this.loading = false), 1000);
      });
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    getDetail(seq) {
      this.queryDetailParameters.gameTurn = seq;
      backendapiService
        .querygamedetail(this.queryDetailParameters)
        .then(async (res) => {
          let detailUrl = res.data.data;
          await this.openDetailPage(detailUrl);
        });
    },
    async openDetailPage(url) {
      window.open(url);
    },
  },
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
.GameDetail {
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

.innerItem {
  width: 45%;
  margin: 10px 5px;
}
.searchBtn {
  margin-top: 20px;
  padding: 15px 50px;
}
.seq {
  color: aliceblue;
  border-bottom: 2px solid #00ffbf;
  cursor: pointer;
}

@media screen and (max-width: 414px) {
  .table-row {
    padding: 10px;
  }
  .GameDetail {
    padding: 20px;
  }
}
</style>
