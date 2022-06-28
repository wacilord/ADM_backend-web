
<template>
  <div class="ReconciliationStatement">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>对帐报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">对帐报表</span>
        </el-row>
        <div class="searchForm">
          <el-form ref="form" label-width="80px">
            <el-form-item label="游戏类别">
              <el-checkbox-group v-model="queryParameters.gameType">
                <el-checkbox
                  v-for="item in getGameType"
                  :key="item.gameTypeId"
                  name="type"
                  :label="item.gameTypeId"
                  >{{ item.gameTypeName }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="日期">
              <el-date-picker
                v-model="queryParameters.startDate"
                type="date"
                placeholder="选择开始时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerStartDate"
              ></el-date-picker>
              <el-date-picker
                v-model="queryParameters.endDate"
                type="date"
                placeholder="选择结束时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerEndDate"
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button class="sureBtn" @click="startQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="dateInfo">
          <i class="el-icon-info"></i>
          <span>搜寻日期仅近6个月</span>
        </div>
      </el-row>
    </el-container>
    <div v-show="queried">
      <div class="exportBox">
        <el-button class="exportBtn" @click="downloadReport">
          <i class="el-icon-download"></i> 导出报表
        </el-button>
      </div>
      <el-table
        :data="records"
        border
        style="width: 100%"
        class="exportTable"
        v-loading="loading"
        :row-style="tableRowStyle"
        :cell-style="tableRowStyle"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column fixed prop label="帐务日期" min-width="150">
          <template slot-scope="prop">
            <div>{{ dateFormat(prop.row.accountDate) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="币别"
          min-width="100"
          prop="currency"
        ></el-table-column>
        <el-table-column label="总投注额" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumBets) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="有效投注额" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumValidBets) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="赢分" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">{{ getfloat(prop.row.sumWin) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop label="天九福彩" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumJackpot) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop label="天九红包" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumJackpot3) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="彩金贡献" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ prop.row.sumJackpotContribute | commaFloatFormat }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="天九福彩(新)" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumJackpot2) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="佣金" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.commission) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="盈利" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumNetWin) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="純盈利" min-width="150">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ prop.row.sumPureNetWin | commaFloatFormat }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="items"
          label="交易笔数"
          min-width="120"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import { codeTransferName } from "../lang/searchCode";
import moment from "moment";

export default {
  name: "ReconciliationStatement",
  data() {
    return {
      loading: true,
      queryParameters: {
        gameType: [],
        startDate: null,
        endDate: null,
      },
      queryParameters2: {
        gameType: [],
        startDate: null,
        endDate: null,
      },
      records: [],
      isTableTitle: false,
      recordTotal: [],
      getGameType: [],
      queried: false,
      pickerStartDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 8.64e7;
        },
      },
      pickerEndDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 8.64e7;
        },
      },
    };
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "dailyreport")) {
        return;
      }
    }
    this.$store.state.showNav = 0;

    let tempGameType = JSON.parse(sessionStorage.getItem("dbGameType"));
    tempGameType.sort();
    tempGameType.forEach((element, index) => {
      this.getGameType.push({
        gameTypeId: element,
        gameTypeName: codeTransferName.transGameTypeName(element),
      });
    });
  },
  methods: {
    checkParameters() {
      var errs = [];
      if (this.queryParameters.gameType.length == 0) {
        errs.push("请选择游戏类别");
      }
      if (this.queryParameters.startDate == null) {
        errs.push("请选择开始时间");
      }
      if (this.queryParameters.endDate == null) {
        errs.push("请选择结束时间");
      }
      if (
        this.queryParameters.startDate != null &&
        this.queryParameters.startDate != null &&
        this.queryParameters.startDate == this.queryParameters.endDate
      ) {
        errs.push("开始时间不能等于结束时间");
      }
      if (
        this.queryParameters.startDate != null &&
        this.queryParameters.startDate != null &&
        moment(this.queryParameters.startDate) >
          moment(this.queryParameters.endDate)
      ) {
        errs.push("开始时间不能大于结束时间");
      }

      let months = moment(this.queryParameters.endDate).diff(
        moment(this.queryParameters.startDate),
        "months"
      );
      if (months > 5) {
        errs.push("日期查询区间不能超过6个月");
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

      //
      this.queryParameters2 = JSON.parse(JSON.stringify(this.queryParameters));
      this.query();
      this.queried = true;
    },
    query() {
      this.loading = true;
      backendapiService.dailyreport(this.queryParameters).then((res) => {
        if (res.data.statusCode != 200) {
          return;
        }
        this.records = res.data.data.records;
        this.setTotal(res);
        window.setTimeout(() => (this.loading = false), 1000);
      });
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    downloadReport() {
      backendapiService
        .dailyreportdownload(this.queryParameters2)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "DailyReport.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
    setTotal(res) {
      this.recordTotal = res.data.data.total;
      this.records.unshift({
        currency: this.recordTotal.currency,
        sumBets: this.recordTotal.totalBets,
        sumValidBets: this.recordTotal.totalValidBets,
        sumWin: this.recordTotal.totalWin,
        sumJackpotContribute: this.recordTotal.totalJackpotContribute,
        sumJackpot: this.recordTotal.totalJackpot,
        commission: this.recordTotal.totalCommission,
        sumJackpot2: this.recordTotal.totalJackpot2,
        sumJackpot3: this.recordTotal.totalJackpot3,
        sumPureNetWin: this.recordTotal.totalPureNetWin,

        sumNetWin: this.recordTotal.totalNetWin,
        items: this.recordTotal.items,
        accountDate: "总计",
      });
    },
    tableRowStyle({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "background-color: rgb(7, 65, 109)";
      }
    },
    dateFormat(value) {
      if (!value) return "";
      if (value.match("总计") || value.match("小计")) {
        return value;
      } else {
        return moment(value).format("YYYY-MM-DD");
      }
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
  margin: 30px 0;
}

.ReconciliationStatement {
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

.exportTable {
  margin-top: 30px;
}

.dateInfo {
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  letter-spacing: 1.5px;
}

.exportBox {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;
}

.exportBtn {
  background: -webkit-linear-gradient(#fcf63a, #d98c27);
  background: -o-linear-gradient(#fcf63a, #d98c27);
  background: -moz-linear-gradient(#fcf63a, #d98c27);
  background: linear-gradient(#fcf63a, #d98c27);
  border: none;
  color: #fff;
  font-weight: 900;
  text-shadow: 1px 1px 4px #000;
  font-family: arial, "Microsoft JhengHei", "微軟正黑體", sans-serif !important;
}
@media screen and (max-width: 414px) {
  .ReconciliationStatement {
    padding: 20px;
  }
}
</style>
