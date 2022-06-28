
<template>
  <div class="PlayerDailyTradeList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>帐变记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">帐变记录</span>
        </el-row>
        <div class="searchForm">
          <el-form>
            <el-form-item label="帐号" class="dailyTradeInput">
              <el-input
                v-model="queryParameters.accountID"
                placeholder="请输入帐号"
                class="tempSize"
                maxlength="40"
              ></el-input>
            </el-form-item>
            <el-form-item label="日期" class="dailyTradeInput dailyDate">
              <el-date-picker
                v-model="queryParameters.startDate"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:00"
                type="datetime"
                placeholder="选择开始时间"
                :picker-options="pickerStartDate"
              ></el-date-picker>
              <el-date-picker
                v-model="queryParameters.endDate"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:00"
                type="datetime"
                placeholder="选择结束时间"
                :picker-options="pickerEndDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="类别" class="dailyTradeInput">
              <el-select
                v-model="queryParameters.queryType"
                multiple
                placeholder="请选择类别 (必填， 可多选 )"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="sureBtn" @click="startQuery">查询</el-button>
              <div class="textBox">
                <p>
                  <i class="el-icon-warning-outline"></i>
                  <span>日期查询区间为七天内</span>
                </p>
                <p>搜寻日期仅近3个月</p>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-row>
    </el-container>
    <!-- <div class="textBox">
      <p>
        <i class="el-icon-warning-outline"></i>
        <span>日期查询区间为七天内</span>
      </p>
      <p>搜寻日期仅近3个月</p>
      <span v-if="!IsSearch">暂无资料</span>
      <span v-else style="letter-spacing: 5px;">会员于该时段无此类别帐变记录</span>
    </div>-->

    <!-- v-show="itemCount > 0 " -->

    <div v-show="IsSearch" class="tableBox">
      <div class="exportBox">
        <div class="btnGroup">
          <el-button
            :class="{ dateBtn: true, activeDate: checkCurrent(item) }"
            type="primary"
            v-for="item in dateList"
            :key="item"
            @click="changeCurrentDate(item)"
            >{{ item }}</el-button
          >
        </div>
        <el-button class="exportBtn" @click="downloadReport">
          <i class="el-icon-download"></i> 导出搜寻报表
        </el-button>
      </div>
      <app-pagination
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :pageCount="pageCount"
        :itemCount="itemCount"
        @clickPage="clickPage"
        :endQuery="endQuery"
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
        <el-table-column fixed prop label="单号" min-width="150">
          <template slot-scope="prop">
            <div
              v-if="prop.row.code == '2001'"
              class="seq"
              @click="getDetail(prop.row.seq)"
            >
              {{ prop.row.seq }}
            </div>
            <div v-if="prop.row.code == '6001'">
              {{ prop.row.seq }}
            </div>
            <div v-if="prop.row.code != '6001' || prop.row.code != '2001'">
              {{ prop.row.transferID }}
            </div>

            <!-- <div
              v-if="prop.row.code == '2001' || prop.row.code == '6001'"
              class="seq"
              @click="getDetail(prop.row.seq)"
            >
              {{ prop.row.seq }}
            </div>
            <div v-else>{{ prop.row.transferID }}</div> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="accountID"
          label="帐号"
          min-width="180"
        ></el-table-column>
        <el-table-column prop="agentTree" label="阶层" min-width="300">
          <template slot-scope="prop">{{
            filterLevel(prop.row.agentTree)
          }}</template>
        </el-table-column>

        <el-table-column
          prop="updateDate"
          label="交易时间"
          min-width="180"
        ></el-table-column>
        <el-table-column
          prop="codeName"
          label="帐务类型"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="gameName"
          label="游戏"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="currency"
          label="币别"
          min-width="100"
        ></el-table-column>
        <el-table-column prop="tradePoint" label="变动分数" min-width="150">
          <template slot-scope="prop">
            <div>{{ prop.row.tradePoint | commaFormat }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="交易后点数" min-width="150">
          <template slot-scope="prop">
            <div style="text-align:right;">{{ getfloat(prop.row.afterBalance) }}</div>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import moment from "moment";

export default {
  name: "PlayerDailyTradeList",
  components: {
    "app-pagination": Pagination,
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "dailytradelist")) {
        return;
      }
    }
    this.$store.state.showNav = 0;
    this.queryParameters.queryType = ["3102", "3101", "2001", "6001"];
    this.lang.getTable();
  },
  data() {
    return {
      loading: true,
      endQuery: false,
      queryParameters: {
        accountID: "",
        startDate: null,
        endDate: null,
        pageIndex: 1,
        pageSize: 10,
        queryType: [],
        currentDate: "",
      },
      queryDetailParameters: {
        gameTurn: "",
      },
      tempQuery: {},
      records: [],
      pageIndex: 0,
      pageSize: 0,
      pageCount: 0,
      itemCount: 0,
      IsSearch: false,
      currentDate: "",
      dateList: [],
      pickerStartDate: {
        disabledDate(time) {
          return time.getTime() > Date.now();
          // return time.getTime() > Date.now() + 8.64e7;
        },
      },
      pickerEndDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 8.64e7;
        },
      },
      options: [
        // 3101入金,3102出金,2001遊戲紀錄
        { value: "3102", label: "出金" },
        { value: "3101", label: "入金" },
        { value: "2001", label: "游戏记录" },
        { value: "6001", label: "活动纪录" },
      ],
    };
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
    changeCurrentDate(item) {
      // this.queryParameters.pageIndex = 1;
      this.currentDate = item;
      // this.queryParameters.currentDate = item;

      this.tempQuery.pageIndex = 1;
      this.tempQuery.currentDate = item;

      this.queryParameters = JSON.parse(JSON.stringify(this.tempQuery));
      this.query();
    },
    checkCurrent(item) {
      if (this.currentDate == item) return true;
      return false;
    },
    checkParameters() {
      var errs = [];
      if (this.queryParameters.accountID == "") {
        errs.push("请输入帐号");
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
      let DateRange = moment(this.queryParameters.endDate).diff(
        moment(this.queryParameters.startDate),
        "minutes"
      );
      if (DateRange > 10080) {
        errs.push("日期查询区间为七天内");
      }
      return errs;
    },
    parametersError(errs) {
      let errMsg = errs.join("<br>");
      this.alertError(errMsg);
      this.records = [];
      this.pageIndex = 1;
      this.pageSize = 10;
      this.pageCount = 1;
      this.itemCount = 0;
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
        this.IsSearch = false;
        return;
      }
      this.queryParameters.pageIndex = 1;
      this.queryParameters.currentDate = "";

      this.tempQuery = JSON.parse(JSON.stringify(this.queryParameters));
      // this.currentDate = "";
      this.dateList = [];

      this.query();
    },
    query() {
      this.loading = true;
      this.endQuery = false;
      this.IsSearch = true;
      backendapiService.dailytradelist(this.tempQuery).then((res) => {
        if (res.data.statusCode !== 200) {
          this.itemCount = 0;
          this.IsSearch = false;
          return;
        }

        this.currentDate = res.data.data.currentDate;
        this.dateList = res.data.data.dateList;

        this.records = res.data.data.records;
        if (res.data.data.records.length == 0) {
          this.IsSearch = true;
        }
        this.records.forEach((ele) => {
          ele.codeName = this.lang.getAccountCode(ele.code);
          if (ele.code == "2001") {
            ele.gameName = this.lang.getGameCodeName(ele.gameCode);
          } else {
            ele.gameName = "";
          }
        });
        this.pageIndex = res.data.data.pageIndex;
        this.pageSize = res.data.data.pageSize;
        this.pageCount = res.data.data.pageCount;
        this.itemCount = res.data.data.itemCount;

        window.setTimeout(() => {
          this.loading = false;
          this.endQuery = true;
        }, 1000);
      });
    },
    selectTime(time) {
      this.queryParameters.startDate = time;
      let date1 = moment(this.queryParameters.startDate)
        .add(1, "d")
        .format("YYYY-MM-DD HH:mm");
      this.queryParameters.endDate = date1;
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
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    getDetail(seq) {
      this.queryDetailParameters.gameTurn = seq;
      // console.log(this.queryDetailParameters);
      backendapiService
        .querygamedetail(this.queryDetailParameters)
        .then(async (res) => {
          // console.log(res);
          let detailUrl = res.data.data;
          await this.openDetailPage(detailUrl);
        });
    },
    async openDetailPage(url) {
      window.open(url);
    },
    downloadReport() {
      backendapiService.dailytradelistdownload(this.tempQuery).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "PalyerDailyTradeReport.csv");
        document.body.appendChild(link);
        link.click();
      });
    },
    endDatePickerFormat(time) {
      this.queryParameters.endDate = time;
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
.PlayerDailyTradeList {
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
.textBox p {
  letter-spacing: 5px;
  font-size: 14px;
  padding-bottom: 10px;
  color: gold;
}

.seq {
  color: aliceblue;
  border-bottom: 2px solid #00ffbf;
  cursor: pointer;
}
.tableBox {
  margin: 30px 0;
}

.exportBox {
  display: flex;
  justify-content: space-between;
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

.el-select {
  width: 100%;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  /* background-color: #5fc260 ; */
  background-color: #003b36;
  color: #fff;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
  /* background-color: #013632; */
  background-color: #003b36;
  color: #00ffbf;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background-color: #00665d;
  color: #fff;
}
.el-select-dropdown__item {
  color: #fff;
}

.dateBtn {
  margin: 10px;
  background-color: #00665e81;
  border: 3px solid #00665d;
}

.activeDate {
  background-color: #00a193cb !important;
  text-shadow: 1px 1px 2px #000;
  box-shadow: 2px 2px 4px #001614 !important;
  border-bottom: 2px solid #05534d !important;
  border-right: 2px solid #05534d !important;
  border-top: 2px solid #0cb1a0 !important;
  border-left: 2px solid #0cb1a0 !important;
}

.btnGroup {
  margin: 10px 0;
}

@media screen and (max-width: 1200px) {
  .exportBox {
    /* flex-direction: column; */
  }
}

@media screen and (max-width: 414px) {
  .LoginLogList {
    padding: 15px;
  }
  .table-row {
    padding: 10px;
  }
  .PlayerDailyTradeList {
    padding: 20px;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
