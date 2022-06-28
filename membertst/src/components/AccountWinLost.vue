
<template>
  <div class="AccountWinLost">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>单一会员输赢</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">单一会员输赢</span>
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
                type="datetime"
                placeholder="选择开始时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:00"
                :picker-options="pickerStartDate"
                @change="startDatePickerFormat"
              ></el-date-picker>
              <el-date-picker
                v-model="queryParameters.endDate"
                type="datetime"
                placeholder="选择结束时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:00"
                :picker-options="pickerEndDate"
                @change="endDatePickerFormat"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="帐号">
              <el-input
                v-model="queryParameters.playerID"
                placeholder="请输入帐号"
                maxlength="40"
              ></el-input>
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
      <el-table
        :data="records"
        border
        style="width: 100%"
        class="tableCss"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column
          prop="accountID"
          label="帐号"
          min-width="140"
        ></el-table-column>
        <el-table-column label="阶层" min-width="300">
          <template slot-scope="prop">{{
            getAccountLV(prop.row.agentTree)
          }}</template>
        </el-table-column>
        <el-table-column label="游戏类别" min-width="120">
          <template slot-scope="prop">{{
            getTypeName(prop.row.gameType)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="币别"
          min-width="100"
        ></el-table-column>
        <el-table-column label="总投注额" min-width="140">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumBets) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="有效投注额" min-width="140">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumValidBets) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sumWin" label="赢分" min-width="140">
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
        <el-table-column label="彩金贡献" min-width="140">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ prop.row.sumJackpotContribute | commaFloatFormat  }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="天九福彩(新)" min-width="140">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumJackpot2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="佣金" min-width="140">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.commission) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="盈利" min-width="140">
          <template slot-scope="prop">
            <div style="text-align: right">
              {{ getfloat(prop.row.sumNetWin) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="items"
          label="交易笔数"
          min-width="140"
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
  name: "AccountWinLost",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "playerwinlosereport")) {
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
  computed: {},
  data() {
    return {
      loading: true,
      getGameType: [],
      queryParameters: {
        gameType: [],
        startDate: null,
        endDate: null,
        playerID: "",
      },
      queryParameters2: {
        gameType: [],
        startDate: null,
        endDate: null,
        playerID: "",
      },
      records: [],
      pickerStartDate: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      pickerEndDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 8.64e7;
        },
      },
      queried: false,
    };
  },
  methods: {
    startDatePickerFormat(time) {
      this.queryParameters.startDate = time;
    },
    endDatePickerFormat(time) {
      this.queryParameters.endDate = time;
    },
    getTypeName(typeID) {
      let tmp = this.getGameType.find((res) => {
        return res.gameTypeId == typeID;
      });
      return tmp.gameTypeName;
    },
    getAccountLV(data) {
      let text = "";
      for (let i = 0; i < data.length; i++) {
        text = text + data[i];
        if (i + 1 < data.length) {
          text = text + " > ";
        }
      }
      return text;
    },

    checkParameters() {
      var errs = [];
      if (this.queryParameters.playerID == "") {
        errs.push("请输入查询帐号");
      }
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
    },
    alertError(txt) {
      this.$notify.error({
        title: "T9 错误",
        dangerouslyUseHTMLString: true,
        message: txt,
      });
    },
    startQuery() {
      var errs = this.checkParameters();
      if (errs.length > 0) {
        this.queried = false;
        this.parametersError(errs);
        return;
      }

      this.queryParameters2 = JSON.parse(JSON.stringify(this.queryParameters));

      backendapiService
        .singleplayersummaryreport(this.queryParameters)
        .then((res) => {
          if (res.data.statusCode !== 200) {
            this.queried = false;
          }

          if (res.data.statusCode == 200) {
            this.queried = true;
            this.records = res.data.data.records;
            this.records.sort((a, b) => {
              return a.gameType - b.gameType;
            });
            this.loading = false;
          }
        });
    },

    setGameTotal(res) {
      if (res.data.data.gameRecord.records.length == 0) {
        return;
      }
      // 取游戏类别总计小计
      this.gameTotal = res.data.data.gameRecord.total;
      this.gameSubTotal = res.data.data.gameRecord.subTotal;

      this.gameRecords.unshift(
        {
          currency: this.gameTotal.currency,
          sumBets: this.gameTotal.totalBets,
          sumValidBets: this.gameTotal.totalValidBets,
          sumWin: this.gameTotal.totalWin,
          sumJackpotContribute: this.gameTotal.totalJackpotContribute,
          sumJackpot: this.gameTotal.totalJackpot,
          commission: this.gameTotal.totalCommission,
          sumNetWin: this.gameTotal.totalNetWin,
          items: this.gameTotal.items,
          gameTypeName: "总计",
        },
        {
          currency: this.gameSubTotal.currency,
          sumBets: this.gameSubTotal.subTotalBets,
          sumValidBets: this.gameSubTotal.subTotalValidBets,
          sumWin: this.gameSubTotal.subTotalWin,
          sumJackpotContribute: this.gameSubTotal.subTotalJackpotContribute,
          sumJackpot: this.gameSubTotal.subTotalJackpot,
          commission: this.gameSubTotal.subCommission,
          sumNetWin: this.gameSubTotal.subTotalNetWin,
          items: this.gameSubTotal.items,
          gameTypeName: "小计",
        }
      );
    },
    setPlayerTotla(res) {
      // 取玩家总计小计
      if (this.onlyPlayer) {
        if (res.data.data.records.length == 0) {
          return;
        }
        this.playerTotal = res.data.data.total;
        this.playerSubTotal = res.data.data.subTotal;
      } else {
        if (res.data.data.playerRecord.records.length == 0) {
          return;
        }
        this.playerTotal = res.data.data.playerRecord.total;
        this.playerSubTotal = res.data.data.playerRecord.subTotal;
      }
      this.playerRecords.unshift(
        {
          currency: this.playerTotal.currency,
          sumBets: this.playerTotal.totalBets,
          sumValidBets: this.playerTotal.totalValidBets,
          sumWin: this.playerTotal.totalWin,
          sumJackpotContribute: this.playerTotal.totalJackpotContribute,
          sumJackpot: this.playerTotal.totalJackpot,
          commission: this.playerTotal.totalCommission,
          sumNetWin: this.playerTotal.totalNetWin,
          items: this.playerTotal.items,
          accountID: "总计",
        },
        {
          currency: this.playerSubTotal.currency,
          sumBets: this.playerSubTotal.subTotalBets,
          sumValidBets: this.playerSubTotal.subTotalValidBets,
          sumWin: this.playerSubTotal.subTotalWin,
          sumJackpotContribute: this.playerSubTotal.subTotalJackpotContribute,
          sumJackpot: this.playerSubTotal.subTotalJackpot,
          commission: this.playerSubTotal.subCommission,
          sumNetWin: this.playerSubTotal.subTotalNetWin,
          items: this.playerSubTotal.items,
          accountID: "小计",
        }
      );
    },

    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    downloadReportByGame() {
      this.queryParameters.agent = null;
      backendapiService
        .summaryreportgamedownload(this.queryParameters)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "WinLostReport_Game.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
    downloadReportByPlayer() {
      let fileText = "";
      if (this.accountLV == 1) {
        fileText = "Manager";
      } else if (this.accountLV == 2) {
        fileText = "Agent";
      } else {
        fileText = "Player";
      }
      this.queryParameters.agent = null;
      backendapiService
        .summaryreportplayerdownload(this.queryParameters)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `WinLostReport_${fileText}.csv`);
          document.body.appendChild(link);
          link.click();
        });
    },
    tableRowStyle({ row, rowIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return "background-color: rgb(7, 65, 109)";
      }
    },
  },
};
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rowSize {
  width: 100%;
  /* color: rgb(7, 65, 109); */
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
.el-tabs--border-card {
  border: 1px solid #4c4c4c;
  background-color: rgba(46, 46, 46, 0.7);
}

.AccountWinLost {
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
.tabsBox {
  margin: 30px 0;
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
.playerBox {
  cursor: pointer;
  border-bottom: 2px solid #00ffbf;
}

.tableCss {
  margin: 20px 0;
}

@media screen and (max-width: 991px) {
  .el-date-editor.el-input {
    width: 100%;
  }
  .time-hours {
    width: 100%;
  }
}
@media screen and (max-width: 414px) {
  .table-row {
    padding: 10px;
  }
  .WinLost {
    padding: 20px;
  }
}
</style>
