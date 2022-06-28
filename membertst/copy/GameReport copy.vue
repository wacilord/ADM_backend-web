
<template>
  <div class="GameReport">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">游戏统计</span>
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
                  @change="getSelect"
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
                placeholder="可输入查询ID ( 选填 )"
                v-model="input"
                clearable
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

    <div v-show="hasData">
      <div class="exportBox">
        <el-button class="exportBtn" @click="downloadReport">
          <i class="el-icon-download"></i> 导出搜寻报表
        </el-button>
      </div>
      <el-tabs type="border-card" class="tabsBox">
        <el-tab-pane
          label="老虎机"
          v-if="queryParameters.gameType.indexOf(1) > -1"
        >
          <el-table
            :data="slotGameRecords"
            border
            style="width: 100%"
            class="exportTable"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column
              fixed
              label="游戏名称"
              min-width="150"
              prop="gameName"
            ></el-table-column>
            <el-table-column
              label="币别"
              min-width="100"
              prop="currency"
            ></el-table-column>
            <el-table-column prop label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumValidBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ prop.row.sumJackpotContribute | commaFloatFormat }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumJackpot) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="佣金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumCommission) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumNetWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="items"
              label="交易笔数"
              min-width="100"
            ></el-table-column>
            <el-table-column prop label="庄家优势" min-width="120">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.bankerAdvantage) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="捕鱼机"
          v-if="queryParameters.gameType.indexOf(2) > -1"
        >
          <el-table
            :data="fishingGameRecords"
            border
            style="width: 100%"
            class="exportTable"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column
              fixed
              label="游戏名称"
              min-width="150"
              prop="gameName"
            ></el-table-column>
            <el-table-column
              label="币别"
              min-width="100"
              prop="currency"
            ></el-table-column>
            <el-table-column prop label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumValidBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ prop.row.sumJackpotContribute | commaFloatFormat }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumJackpot) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="佣金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumCommission) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumNetWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="items"
              label="交易笔数"
              min-width="100"
            ></el-table-column>
            <el-table-column prop label="庄家优势" min-width="120">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.bankerAdvantage) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="棋牌"
          v-if="queryParameters.gameType.indexOf(3) > -1"
        >
          <el-table
            :data="cardGameRecords"
            border
            style="width: 100%"
            class="exportTable"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column
              fixed
              label="游戏名称"
              min-width="150"
              prop="gameName"
            ></el-table-column>
            <el-table-column
              label="币别"
              min-width="100"
              prop="currency"
            ></el-table-column>
            <el-table-column prop label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumValidBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ prop.row.sumJackpotContribute | commaFloatFormat }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumJackpot) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="佣金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumCommission) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumNetWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="items"
              label="交易笔数"
              min-width="100"
            ></el-table-column>
            <el-table-column prop label="庄家优势" min-width="120">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.bankerAdvantage) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="小游戏"
          v-if="queryParameters.gameType.indexOf(4) > -1"
        >
          <el-table
            :data="miniGameRecords"
            border
            style="width: 100%"
            class="exportTable"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column
              fixed
              label="游戏名称"
              min-width="150"
              prop="gameName"
            ></el-table-column>
            <el-table-column
              label="币别"
              min-width="100"
              prop="currency"
            ></el-table-column>
            <el-table-column prop label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumValidBets) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ prop.row.sumJackpotContribute | commaFloatFormat }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumJackpot) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="佣金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumCommission) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumNetWin) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="items"
              label="交易笔数"
              min-width="100"
            ></el-table-column>
            <el-table-column prop label="庄家优势" min-width="120">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.bankerAdvantage) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import { codeTransferName } from "../lang/searchCode";
import moment from "moment";

export default {
  name: "GameReport",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "gamereport")) {
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
  data() {
    return {
      input: "",
      options: [],
      loading: true,
      queryParameters: {
        gameType: [],
        startDate: null,
        endDate: null,
        gameCode: [],
      },
      getGameType: [],
      slotGameRecords: [],
      fishingGameRecords: [],
      cardGameRecords: [],
      miniGameRecords: [],
      hasData: false,
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
  methods: {
    getSelect() {
      // ajax 捞 gamecode
      if (this.queryParameters.gameType.length == 0) {
        this.hasData = false;
      }
    },
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
      this.slotGameRecords = [];
      this.fishingGameRecords = [];
      this.cardGameRecords = [];
      this.miniGameRecords = [];
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
        this.parametersError(errs);
        return;
      }
      this.query();
    },
    startDatePickerFormat(time) {
      this.queryParameters.startDate = time;
    },
    endDatePickerFormat(time) {
      this.queryParameters.endDate = time;
    },
    query() {
      this.loading = true;
      backendapiService.gamereport(this.queryParameters).then((res) => {
        if (res.data.statusCode === 200) {
          this.slotGameRecords = res.data.data.slotGameRecords;
          this.slotGameRecords.forEach((ele) => {
            ele.gameName = this.lang.getGameCodeName(ele.gameCode);
          });
          this.fishingGameRecords = res.data.data.fishingGameRecords;
          this.fishingGameRecords.forEach((ele) => {
            ele.gameName = this.lang.getGameCodeName(ele.gameCode);
          });
          this.cardGameRecords = res.data.data.cardGameRecords;
          this.cardGameRecords.forEach((ele) => {
            ele.gameName = this.lang.getGameCodeName(ele.gameCode);
          });
          this.miniGameRecords = res.data.data.miniGameRecords;
          this.miniGameRecords.forEach((ele) => {
            ele.gameName = this.lang.getGameCodeName(ele.gameCode);
          });
          this.hasData = true;
          window.setTimeout(() => (this.loading = false), 1000);
        }
      });
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    downloadReport() {
      backendapiService.gamereportdownload(this.queryParameters).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "GameReport.csv");
        document.body.appendChild(link);
        link.click();
      });
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
.el-tabs--border-card {
  border: 1px solid #4c4c4c;
  background-color: rgba(46, 46, 46, 0.7);
}

.GameReport {
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

.inputSize {
  width: 100%;
  margin: 0 !important;
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
  .GameReport {
    padding: 20px;
  }
}
</style>
