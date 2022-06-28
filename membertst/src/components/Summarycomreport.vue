<template>
  <div class="Summarycomreport">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动中奖查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">活动中奖查询</span>
        </el-row>

        <div class="searchForm">
          <el-date-picker
            class="dateInput"
            v-model="queryParameters.startDate"
            type="datetime"
            placeholder="选择开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerStartDate"
            @change="startDatePickerFormat"
          ></el-date-picker>

          <el-date-picker
            class="dateInput"
            v-model="queryParameters.endDate"
            type="datetime"
            placeholder="选择结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerEndDate"
            @change="endDatePickerFormat"
          ></el-date-picker>

          <el-button class="sureBtn" @click="startQuery">查询</el-button>
        </div>
      </el-row>
    </el-container>

    <div v-show="queried">
      <el-tabs
        type="border-card"
        class="tabsBox"
        v-model="activeName"
        ref="tabs"
      >
        <el-tab-pane label="中奖名单" name="self">
          <div class="exportBox">
            <el-button class="exportBtn" @click="downloadEventList">
              <i class="el-icon-download"></i> 导出报表
            </el-button>
          </div>

          <app-pagination
            :endQuery="endQuery"
            :pageIndex="pageIndex"
            :pageSize="pageSize"
            :pageCount="pageCount"
            :itemCount="itemCount"
            @clickPage="clickPage"
          ></app-pagination>

          <el-table
            :data="selfList"
            border
            :row-style="tableRowStyle"
            :cell-style="tableRowStyle"
            style="width: 100%"
            class="exportTable"
          >
            <el-table-column fixed label="帐号" min-width="150" prop>
              <template slot-scope="prop">
                <div
                  v-if="checkCanClick(prop.row.accountID, true)"
                  @click="requestManager(prop.row.accountID)"
                  class="playerBox"
                >
                  {{ prop.row.accountID }}
                </div>
                <div v-else>{{ prop.row.accountID }}</div>
              </template>
            </el-table-column>

            <el-table-column label="中奖金额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumCamWin) }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="币别"
              min-width="100"
              prop="currency"
            ></el-table-column>

            <el-table-column
              label="笔数"
              min-width="100"
              prop="items"
            ></el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ************************************************************************************** -->
        <!-- 经理 -->
        <el-tab-pane label="经理层" v-show="isShowManagerTab" name="manager">
          <div class="exportBox">
            <el-button class="exportBtn" @click="downloadEventList_Manager">
              <i class="el-icon-download"></i> 导出报表
            </el-button>
          </div>

          <app-pagination
            :endQuery="manager_endQuery"
            :pageIndex="manager_pageIndex"
            :pageSize="manager_pageSize"
            :pageCount="manager_pageCount"
            :itemCount="manager_itemCount"
            @clickPage="manager_clickPage"
          ></app-pagination>

          <el-table
            :data="ManagerList"
            border
            :row-style="tableRowStyle"
            :cell-style="tableRowStyle"
            style="width: 100%"
            class="exportTable"
          >
            <el-table-column fixed label="帐号" min-width="150" prop>
              <template slot-scope="prop">
                <div
                  v-if="checkCanClick(prop.row.accountID, true)"
                  @click="requestAgent(prop.row.accountID)"
                  class="playerBox"
                >
                  {{ prop.row.accountID }}
                </div>
                <div v-else>{{ prop.row.accountID }}</div>
              </template>
            </el-table-column>

            <el-table-column label="中奖金额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.sumCamWin) }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="币别"
              min-width="100"
              prop="currency"
            ></el-table-column>

            <el-table-column
              label="笔数"
              min-width="100"
              prop="items"
            ></el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ************************************************************************************** -->
        <!-- 代理 -->
        <el-tab-pane label="代理层" v-show="isShowAgentTab" name="agent">
          <app-AgentReport ref="modalForAgent"></app-AgentReport>
        </el-tab-pane>
        <!-- ************************************************************************************** -->
        <!-- 会员 -->
        <el-tab-pane :label="tabName" v-show="isShowPlayerTab" name="player">
          <app-PlayerReport ref="modalForPlayer"></app-PlayerReport>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { passwordstrength } from "../password/passwordStrength.js";
import { backendapiService } from "../service/backendapiService.js";
import moment from "moment";
import EventAgent from "@/components/EventAgent";
import EventPlayer from "@/components/EventPlayer";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";

export default {
  name: "Summarycomreport",
  data() {
    return {
      loginID: "",
      jpList: [],
      selfList: [],
      ManagerList: [],
      queried: false,
      activeName: "self",
      loading: true,
      isShowManagerTab: false,
      isShowAgentTab: false,
      isShowPlayerTab: false,
      eventTotal: null,
      eventSubTotal: null,
      managerTotal: null,
      managerSubTotal: null,
      queryParameters: {
        accountID: "",
        startDate: "",
        endDate: "",
        pageIndex: 1,
        pageSize: 10,
      },
      queryParameters_manager: {
        accountID: "",
        startDate: "",
        endDate: "",
        pageIndex: 1,
        pageSize: 10,
      },
      pageIndex: 0,
      pageSize: 0,
      pageCount: 0,
      itemCount: 0,
      endQuery: true,
      manager_pageIndex: 0,
      manager_pageSize: 0,
      manager_pageCount: 0,
      manager_itemCount: 0,
      manager_endQuery: true,
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
      tabName: "会员层",
    };
  },
  components: {
    "app-pagination": Pagination,
    "app-AgentReport": EventAgent,
    "app-PlayerReport": EventPlayer,
  },
  computed: {
    ...mapGetters(["accountID"]),
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "summarycamreport")) {
        return;
      }
    }
    this.$store.state.showNav = 0;
    this.accountLV = sessionStorage.getItem("level");
    this.loginID = sessionStorage.getItem("accountID");

    if (sessionStorage.getItem("accountType") == 0) {
      backendapiService.logininfo({}).then((res) => {
        this.loginID = res.data.data.accountID;
      });
    }
  },
  methods: {
    startDatePickerFormat(time) {
      this.queryParameters.startDate = time;
    },
    endDatePickerFormat(time) {
      this.queryParameters.endDate = time;
    },
    checkInput(data, inputName) {},
    startQuery() {
      this.loading = true;
      var errs = this.checkParameters();
      if (errs.length > 0) {
        this.parametersError(errs);
        window.setTimeout(() => (this.loading = false), 1000);
        return;
      }

      this.activeName = "self";

      this.hideManager();
      this.hideAgent();
      this.hidePlayer();

      this.queryParameters.accountID = this.accountID;

      //   if (this.accountLV == 1) {
      //     this.hideManager();
      //     this.hideAgent();
      //     this.hidePlayer();
      //   } else if (this.accountLV == 2) {
      //     this.hideManager();
      //     this.hidePlayer();
      //   } else {
      //     this.hideManager();
      //     this.hideAgent();
      //   }

      if (this.accountLV == 3) {
        let temp = {
          accountID: "",
          startDate: "",
          endDate: "",
        };
        temp.accountID = this.accountID;
        temp.startDate = this.queryParameters.startDate;
        temp.endDate = this.queryParameters.endDate;
        this.tabName = "中奖名单";
        this.hideSelf();
        this.showPlayer();
        this.initDataPlayer(temp);
        this.queried = true;
      } else {
        this.queryEvent();
      }
    },
    queryEvent() {
      this.queried = true;
      //   this.queryParameters.pageIndex = 1;

      // 自己
      backendapiService.summarycamreport(this.queryParameters).then((res) => {
        if (res.data.statusCode != 200) {
          this.alertError("查询失败");
          return;
        }
        this.selfList = res.data.data.records;
        this.pageIndex = res.data.data.pageIndex;
        this.pageSize = res.data.data.pageSize;
        this.pageCount = res.data.data.pageCount;
        this.itemCount = res.data.data.itemCount;

        this.setEventTotal(res);
      });

      //   // 经理账号登入
      //   if (this.accountLV == 2) {
      //     let temp = {
      //       accountID: "",
      //       startDate: "",
      //       endDate: "",
      //     };
      //     temp.accountID = this.loginID;
      //     temp.startDate = this.queryParameters.startDate;
      //     temp.endDate = this.queryParameters.endDate;
      //     // this.showAgent();
      //     this.$refs.modalForAgent.init(this, this.$refs.modalForAgent, temp);
      //     return;
      //   }

      //   // 代理账号登入
      //   if (this.accountLV == 3) {
      //     let temp = {
      //       accountID: "",
      //       startDate: "",
      //       endDate: "",
      //     };
      //     temp.accountID = this.loginID;
      //     temp.startDate = this.queryParameters.startDate;
      //     temp.endDate = this.queryParameters.endDate;
      //     // this.showPlayer();
      //     this.$refs.modalForPlayer.init(this, this.$refs.modalForPlayer, temp);
      //     return;
      //   }

      // 下一层
      //   let temp = {
      //     accountID: "",
      //     startDate: "",
      //     endDate: "",
      //   };
      //   temp.accountID = this.loginID;
      //   temp.startDate = this.queryParameters.startDate;
      //   temp.endDate = this.queryParameters.endDate;
      //   backendapiService.jackpotagentreport(temp).then((res) => {
      //     if (res.data.statusCode != 200) {
      //       this.alertError("查询失败");
      //       return;
      //     }
      //     this.jpList = res.data.data.jackpotRecord;
      //     window.setTimeout(() => (this.loading = false), 1000);
      //   });
    },

    setEventTotal(res) {
      if (res.data.data.records.length == 0) {
        return;
      }
      // 取游戏类别总计小计
      this.eventTotal = res.data.data.total;
      this.eventSubTotal = res.data.data.subTotal;

      this.selfList.unshift(
        {
          currency: this.eventTotal.currency,
          items: this.eventTotal.items,
          sumCamWin: this.eventTotal.totalCamWin,
          accountID: "总计",
        },
        {
          currency: this.eventSubTotal.currency,
          items: this.eventSubTotal.items,
          sumCamWin: this.eventSubTotal.totalCamWin,
          accountID: "小计",
        }
      );
    },

    setManagerEventTotal(res) {
      if (res.data.data.records.length == 0) {
        return;
      }
      // 取游戏类别总计小计
      this.managerTotal = res.data.data.total;
      this.managerSubTotal = res.data.data.subTotal;

      this.ManagerList.unshift(
        {
          currency: this.managerTotal.currency,
          items: this.managerTotal.items,
          sumCamWin: this.managerTotal.totalCamWin,
          accountID: "总计",
        },
        {
          currency: this.managerSubTotal.currency,
          items: this.managerSubTotal.items,
          sumCamWin: this.managerSubTotal.totalCamWin,
          accountID: "小计",
        }
      );
    },

    requestAgent(selectID) {
      let temp = {
        accountID: "",
        startDate: "",
        endDate: "",
        pageIndex: 1,
        pageSize: 10,
      };
      temp.accountID = selectID;
      temp.startDate = this.queryParameters.startDate;
      temp.endDate = this.queryParameters.endDate;

      this.showAgent();
      this.$refs.modalForAgent.init(this, this.$refs.modalForAgent, temp);
    },

    requestManager(selectID) {
      if (this.accountLV == 1) {
        this.requestAgent(selectID);
        return;
      }
      if (this.accountLV == 2) {
        let temp = {
          accountID: "",
          startDate: "",
          endDate: "",
        };
        temp.accountID = selectID;
        temp.startDate = this.queryParameters.startDate;
        temp.endDate = this.queryParameters.endDate;

        this.showPlayer();
        this.initDataPlayer(temp);
        return;
      }
      if (this.accountLV == 3) {
        return;
      }

      //   let temp = {
      //     accountID: "",
      //     startDate: "",
      //     endDate: "",
      //     pageIndex: 1,
      //     pageSize: 10,
      //   };
      //   temp.accountID = selectID;
      //   temp.startDate = this.queryParameters.startDate;
      //   temp.endDate = this.queryParameters.endDate;

      this.queryParameters_manager.accountID = selectID;
      this.queryParameters_manager.startDate = this.queryParameters.startDate;
      this.queryParameters_manager.endDate = this.queryParameters.endDate;

      this.showManager();
      backendapiService
        .summarycamreport(this.queryParameters_manager)
        .then((res) => {
          if (res.data.statusCode != 200) {
            this.alertError("查询失败");
            return;
          }

          //   console.log(res);
          this.manager_pageIndex = res.data.data.pageIndex;
          this.manager_pageSize = res.data.data.pageSize;
          this.manager_pageCount = res.data.data.pageCount;
          this.manager_itemCount = res.data.data.itemCount;

          this.ManagerList = res.data.data.records;
          this.setManagerEventTotal(res);
          window.setTimeout(() => (this.loading = false), 1000);
        });
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },

    checkParameters() {
      var errs = [];
      if (this.queryParameters.startDate == "") {
        errs.push("请选择开始时间");
      }
      if (this.queryParameters.endDate == "") {
        errs.push("请选择结束时间");
      }
      if (
        this.queryParameters.startDate != "" &&
        this.queryParameters.startDate != "" &&
        this.queryParameters.startDate == this.queryParameters.endDate
      ) {
        errs.push("开始时间不能等于结束时间");
      }
      if (
        this.queryParameters.startDate != "" &&
        this.queryParameters.startDate != "" &&
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
    showSelf() {
      document.getElementById("tab-self").style.display = "inline-block";
      this.activeName = "self";
    },
    showManager() {
      document.getElementById("tab-manager").style.display = "inline-block";
      this.activeName = "manager";
    },
    showAgent() {
      document.getElementById("tab-agent").style.display = "inline-block";
      this.activeName = "agent";
    },
    showPlayer() {
      document.getElementById("tab-player").style.display = "inline-block";
      this.activeName = "player";
    },
    hideSelf() {
      document.getElementById("tab-self").style.display = "none";
    },
    hideManager() {
      document.getElementById("tab-manager").style.display = "none";
    },
    hideAgent() {
      document.getElementById("tab-agent").style.display = "none";
    },
    hidePlayer() {
      document.getElementById("tab-player").style.display = "none";
    },
    initDataPlayer(val) {
      this.$refs.modalForPlayer.init(this, this.$refs.modalForPlayer, val);
    },

    checkCanClick(id, canClickID) {
      if (this.accountLV != 3 && canClickID) {
        if (id.match("小计") || id.match("总计")) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    tableRowStyle({ row, rowIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return "background-color: rgb(7, 65, 109)";
      }
    },
    downloadEventList() {
    //   this.queryParameters.agent = null;
      backendapiService
        .summarycamreportdownload(this.queryParameters)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "EventAwardList1.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
    downloadEventList_Manager() {
      //   this.queryParameters.agent = null;

      backendapiService
        .summarycamreportdownload(this.queryParameters_manager)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "EventAwardList2.csv");
          document.body.appendChild(link);
          link.click();
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
      this.queryParameters.pageIndex = e.pageIndex;
    //   this.queryParameters.agent = null;
      this.queryEvent();
    },
    manager_clickPage(e) {
      if (!this.manager_endQuery) {
        return;
      }
      if (
        e.pageIndex == this.manager_pageCount &&
        this.manager_pageIndex == this.manager_pageCount
      ) {
        return;
      }
      if (e.pageIndex == this.manager_pageIndex) {
        return;
      }
      this.queryParameters_manager.pageIndex = e.pageIndex;
      //   this.queryParameters.agent = null;
      this.queryEvent(this.queryParameters_manager.accountID);
    },
  },
};
</script>

<style scoped>
.app-myCard {
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
}
.rowSize {
  width: 100%;
}
.card__title {
  font-size: 18px;
  color: #00ffbf;
  line-height: 24px;
  letter-spacing: 3px;
}
.searchForm {
  padding: 20px;
  display: flex;
  justify-content: center;
}
.pageGuide {
  /* 页面导览 */
  margin: 15px 0;
  padding: 10px;
}
.Summarycomreport {
  padding: 30px;
  min-height: 100vh;
  color: aliceblue;
}
.row-list {
  display: flex;
  justify-content: center;
}
.card__header {
  background-color: #434343;
  padding: 10px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.tabsBox {
  margin: 30px 0;
}

.el-tabs--border-card {
  border: 1px solid #4c4c4c;
  background-color: rgba(46, 46, 46, 0.7);
}

.playerBox {
  cursor: pointer;
  border-bottom: 2px solid #00ffbf;
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

@media screen and (max-width: 768px) {
  .searchForm {
    flex-direction: column;
  }

  .dateInput {
    width: 100%;
  }
}
</style>