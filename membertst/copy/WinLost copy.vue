
<template>
  <div class="WinLost">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>输赢报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">输赢报表</span>
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
                >{{item.gameTypeName}}</el-checkbox>
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
      <el-tabs type="border-card" class="tabsBox" @tab-click="handleClick" v-model="activeName">
        <!-- ************************************************************************************** -->
        <el-tab-pane label="游戏类型" name="game">
          <div class="exportBox">
            <el-button class="exportBtn" @click="downloadReportByGame">
              <i class="el-icon-download"></i> 导出报表
            </el-button>
          </div>

          <el-table
            :data="gameRecords"
            border
            :row-style="tableRowStyle"
            :cell-style="tableRowStyle"
            style="width: 100%"
            class="exportTable"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column fixed label="游戏类型" min-width="150" prop="gameTypeName"></el-table-column>
            <el-table-column label="币别" min-width="100" prop="currency"></el-table-column>
            <el-table-column label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumValidBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ prop.row.sumJackpotContribute | commaFloatFormat  }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right ">{{getfloat(prop.row.sumJackpot) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="佣金" min-width="150">
              <template slot-scope="prop ">
                <div style="text-align:right ;">{{ getfloat(prop.row.commission) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.sumNetWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="items" label="交易笔数" min-width="100"></el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ************************************************************************************** -->

        <el-tab-pane :label="getAccountTabLabel" name="next1">
          <div class="exportBox">
            <el-button class="exportBtn" @click="downloadReportByPlayer">
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
            :data="playerRecords"
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
            <el-table-column fixed label="帐号" min-width="150" prop>
              <template slot-scope="prop">
                <div
                  v-if="checkCanClick(prop.row.accountID , true)"
                  @click="requestManager(prop.row.accountID)"
                  class="playerBox"
                >{{ prop.row.accountID }}</div>
                <div v-else>{{ prop.row.accountID }}</div>
              </template>
            </el-table-column>
            <el-table-column label="币别" min-width="100" prop="currency"></el-table-column>
            <el-table-column label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumValidBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ prop.row.sumJackpotContribute | commaFloatFormat  }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumJackpot) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="佣金" min-width="150">
              <template slot-scope="prop ">
                <div style="text-align:right ;">{{ getfloat(prop.row.commission) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.sumNetWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="items" label="交易笔数" min-width="100"></el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ************************************************************************************** -->
        <!-- 经理头 -->
        <el-tab-pane v-if="isShowAgentTab" name="next2">
          <span slot="label">
            代理输赢
            <i v-if="mangerTabLoading" class="el-icon-loading"></i>
          </span>
          <div class="exportBox">
            <el-button class="exportBtn" @click="downloadReportAgent">
              <i class="el-icon-download"></i> 导出报表
            </el-button>
          </div>

          <app-pagination
            :endQuery="endManagerQuery"
            :pageIndex="managerPageIndex"
            :pageSize="managerPageSize"
            :pageCount="managerPageCount"
            :itemCount="managerItemCount"
            @clickPage="clickManagerPage"
          ></app-pagination>

          <el-table
            :data="managerRecords"
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
            <el-table-column fixed label="帐号" min-width="150" prop>
              <template slot-scope="prop">
                <div
                  v-if="checkCanClick(prop.row.accountID , true)"
                  @click="requestAgent(prop.row.accountID)"
                  class="playerBox"
                >{{ prop.row.accountID }}</div>
                <div v-else>{{ prop.row.accountID }}</div>
              </template>
            </el-table-column>
            <el-table-column label="币别" min-width="100" prop="currency"></el-table-column>
            <el-table-column label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumValidBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ prop.row.sumJackpotContribute | commaFloatFormat  }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumJackpot) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="佣金" min-width="150">
              <template slot-scope="prop ">
                <div style="text-align:right ;">{{ getfloat(prop.row.commission) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.sumNetWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="items" label="交易笔数" min-width="100"></el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ************************************************************************************** -->
        <!-- 代理头 -->
        <el-tab-pane v-if="isShowPlayerTab" name="next3">
          <span slot="label">
            会员输赢
            <i v-if="agentTabLoading" class="el-icon-loading"></i>
          </span>
          <div class="exportBox">
            <el-button class="exportBtn" @click="downloadReportMember">
              <i class="el-icon-download"></i> 导出报表
            </el-button>
          </div>

          <app-pagination
            :endQuery="endAgentQuery"
            :pageIndex="agentPageIndex"
            :pageSize="agentPageSize"
            :pageCount="agentPageCount"
            :itemCount="agentItemCount"
            @clickPage="clickAgentPage"
          ></app-pagination>

          <el-table
            :data="agentRecords"
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
            <el-table-column fixed label="帐号" min-width="150" prop>
              <template slot-scope="prop">
                <div>{{ prop.row.accountID }}</div>
              </template>
            </el-table-column>
            <el-table-column label="币别" min-width="100" prop="currency"></el-table-column>
            <el-table-column label="总投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="有效投注额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumValidBets) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="赢分" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金贡献" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ prop.row.sumJackpotContribute | commaFloatFormat  }}</div>
              </template>
            </el-table-column>
            <el-table-column label="彩金" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{getfloat(prop.row.sumJackpot) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="佣金" min-width="150">
              <template slot-scope="prop ">
                <div style="text-align:right ;">{{ getfloat(prop.row.commission) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="盈利" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.sumNetWin) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="items" label="交易笔数" min-width="100"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import { codeTransferName } from "../lang/searchCode";
import moment from "moment";

export default {
  name: "WinLost",
  components: {
    "app-pagination": Pagination
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "winlosereportreport")) {
        return;
      }
    }
    this.$store.state.showNav = 0;
    this.accountLV = sessionStorage.getItem("level");

    let tempGameType = JSON.parse(sessionStorage.getItem("dbGameType"));
    tempGameType.sort();
    tempGameType.forEach((element, index) => {
      this.getGameType.push({
        gameTypeId: element,
        gameTypeName: codeTransferName.transGameTypeName(element)
      });
    });
  },
  computed: {
    getAccountTabLabel() {
      if (this.accountLV == 1) {
        return "经理输赢";
      } else if (this.accountLV == 2) {
        return "代理输赢";
      } else {
        return "会员输赢";
      }
    }
  },
  data() {
    return {
      loading: true,
      queryParameters: {
        gameType: [],
        timeHour: 0,
        startDate: null,
        endDate: null,
        pageIndex: 0,
        pageSize: 10,
        agent: null
      },
      queryManagerParameters: {
        gameType: [],
        timeHour: 0,
        startDate: null,
        endDate: null,
        pageIndex: 0,
        pageSize: 10,
        agent: null
      },
      queryAgentParameters: {
        gameType: [],
        timeHour: 0,
        startDate: null,
        endDate: null,
        pageIndex: 0,
        pageSize: 10,
        agent: null
      },
      getGameType: [],
      gameRecords: [],
      playerRecords: [],
      managerRecords: [],
      agentRecords: [],
      pageIndex: 0,
      pageSize: 0,
      pageCount: 0,
      itemCount: 0,
      managerPageIndex: 0,
      managerPageSize: 0,
      managerPageCount: 0,
      managerItemCount: 0,
      agentPageIndex: 0,
      agentPageSize: 0,
      agentPageCount: 0,
      agentItemCount: 0,
      endQuery: true,
      endManagerQuery: false,
      endAgentQuery: false,
      pickerStartDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 8.64e7;
        }
      },
      pickerEndDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 8.64e7;
        }
      },
      queried: false,
      gameTotal: [],
      gameSubTotal: [],
      playerTotal: [],
      playerSubTotal: [],
      managerTotal: [],
      managerSubTotal: [],
      agentTotal: [],
      agentSubTotal: [],
      onlyPlayer: false,
      AccountTabLabel: "",
      accountLV: null,

      isShowAgentTab: false,
      isShowPlayerTab: false,
      canClick: false,
      mangerTabLoading: true,
      agentTabLoading: true,
      quesManager: "",
      quesAgent: "",
      activeName: "game"
    };
  },
  methods: {
    startDatePickerFormat(time) {
      this.queryParameters.startDate = time;
    },
    endDatePickerFormat(time) {
      this.queryParameters.endDate = time;
    },
    handleClick(tab, event) {
      // if (this.accountLV == 1) {
      //   if (tab.index == 1) {
      //     this.isShowAgentTab = false;
      //     this.isShowPlayerTab = false;
      //   }
      //   if (tab.index == 2) {
      //     this.isShowPlayerTab = false;
      //   }
      // } else if (this.accountLV == 2) {
      //   if (tab.index == 1) {
      //     this.isShowPlayerTab = false;
      //   }
      // } else {
      // }
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
    requestManager(id) {
      // console.log("上一个manager = " + this.quesManager);
      if (this.quesManager != "" && this.quesManager != id) {
        if (this.accountLV == 1) {
          this.isShowAgentTab = false;
          this.isShowPlayerTab = false;
        } else if (this.accountLV == 2) {
          this.isShowPlayerTab = false;
        } else {
        }
      }
      this.activeName = "next2";
      this.quesManager = id;
      if (this.accountLV == 1) {
        this.isShowAgentTab = true;
        this.queryManagerParameters = this.queryParameters;
        this.queryManagerParameters.pageIndex = 1;
        this.queryManagerParameters.agent = id;
        this.queryManger();
      } else {
        this.requestAgent(id);
      }

      // console.log(id);
      // console.log("manager = " + this.quesManager);
    },
    requestAgent(id) {
      // console.log("agent = " + this.quesAgent);
      if (this.quesAgent != "" && this.quesAgent != id) {
        this.isShowPlayerTab = false;
        // if (this.accountLV == 1) {
        //   this.isShowPlayerTab = false;
        // } else if (this.accountLV == 2) {
        //   this.isShowPlayerTab = false;
        // } else {
        // }
      }
      this.activeName = "next3";
      this.quesAgent = id;
      this.isShowPlayerTab = true;
      this.queryAgentParameters = this.queryParameters;
      this.queryAgentParameters.pageIndex = 1;
      this.queryAgentParameters.agent = id;
      this.queryAgent();

      // console.log(id);
      // console.log("上一个agent = " + this.quesAgent);
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
      this.gameRecords = [];
      this.playerRecords = [];
      this.pageIndex = 1;
      this.pageSize = 10;
      this.pageCount = 1;
      this.itemCount = 0;
    },
    alertError(txt) {
      this.$notify.error({
        title: "T9 错误",
        dangerouslyUseHTMLString: true,
        message: txt
      });
    },
    startQuery() {
      // this.initParameters();
      this.queryParameters.pageIndex = 1;
      var errs = this.checkParameters();
      if (errs.length > 0) {
        this.parametersError(errs);
        return;
      }
      this.queryForSummary();
      this.queried = true;
      this.activeName = "game";
    },
    queryForSummary() {
      this.loading = true;
      this.queryParameters.pageIndex = 1;
      this.queryParameters.agent = null;
      this.onlyPlayer = false;
      this.isShowPlayerTab = false;
      this.isShowAgentTab = false;
      backendapiService.summaryreport(this.queryParameters).then(res => {
        if (res.data.statusCode != 200) {
          this.queried = false;
          return;
        }
        this.gameRecords = res.data.data.gameRecord.records;
        this.gameRecords.forEach(ele => {
          ele.gameTypeName = this.lang.getGameTypeName(ele.gameType);
        });

        this.setGameTotal(res);
        this.playerRecords = res.data.data.playerRecord.records;
        this.setPlayerTotla(res);

        this.pageIndex = res.data.data.playerRecord.pageIndex;
        this.pageSize = res.data.data.playerRecord.pageSize;
        this.pageCount = res.data.data.playerRecord.pageCount;
        this.itemCount = res.data.data.playerRecord.itemCount;

        window.setTimeout(() => (this.loading = false), 1000);
      });
    },
    queryForGame() {
      this.loading = true;
      backendapiService.gamesummaryreport(this.queryParameters).then(res => {
        if (res.data.statusCode != 200) {
          return;
        }
        this.gameRecords = res.data.data.records;
        this.gameRecords.forEach(ele => {
          ele.gameTypeName = this.lang.getGameTypeName(ele.gameType);
        });

        window.setTimeout(() => (this.loading = false), 1000);
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
          gameTypeName: "总计"
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
          gameTypeName: "小计"
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
          accountID: "总计"
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
          accountID: "小计"
        }
      );
    },
    queryForPlayer() {
      this.loading = true;
      this.endQuery = false;
      backendapiService.playersummaryreport(this.queryParameters).then(res => {
        if (res.data.statusCode != 200 || res.data.data.records.length == 0) {
          window.setTimeout(() => (this.loading = false), 1000);
          return;
        }

        this.playerRecords = res.data.data.records;
        this.onlyPlayer = true;
        this.setPlayerTotla(res);
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
    queryManger() {
      this.loading = true;
      this.mangerTabLoading = true;
      this.endManagerQuery = false;
      backendapiService
        .playersummaryreport(this.queryManagerParameters)
        .then(res => {
          if (res.data.statusCode != 200 || res.data.data.records.length == 0) {
            window.setTimeout(() => {
              this.loading = false;
              this.mangerTabLoading = false;
            }, 1000);
            // window.setTimeout(() => (this.loading = false), 1000);
            return;
          }
          this.managerRecords = res.data.data.records;
          this.managerPageIndex = res.data.data.pageIndex;
          this.managerPageSize = res.data.data.pageSize;
          this.managerPageCount = res.data.data.pageCount;
          this.managerItemCount = res.data.data.itemCount;

          this.managerTotal = res.data.data.total;
          this.managerSubTotal = res.data.data.subTotal;

          this.managerRecords.unshift(
            {
              currency: this.managerTotal.currency,
              sumBets: this.managerTotal.totalBets,
              sumValidBets: this.managerTotal.totalValidBets,
              sumWin: this.managerTotal.totalWin,
              sumJackpotContribute: this.managerTotal.totalJackpotContribute,
              sumJackpot: this.managerTotal.totalJackpot,
              commission: this.managerTotal.totalCommission,
              sumNetWin: this.managerTotal.totalNetWin,
              items: this.managerTotal.items,
              accountID: "总计"
            },
            {
              currency: this.managerSubTotal.currency,
              sumBets: this.managerSubTotal.subTotalBets,
              sumValidBets: this.managerSubTotal.subTotalValidBets,
              sumWin: this.managerSubTotal.subTotalWin,
              sumJackpotContribute: this.managerSubTotal
                .subTotalJackpotContribute,
              sumJackpot: this.managerSubTotal.subTotalJackpot,
              commission: this.managerSubTotal.subCommission,
              sumNetWin: this.managerSubTotal.subTotalNetWin,
              items: this.managerSubTotal.items,
              accountID: "小计"
            }
          );

          // window.setTimeout(() => (this.loading = false), 1000);
          window.setTimeout(() => {
            this.loading = false;
            this.mangerTabLoading = false;
            this.endManagerQuery = true;
          }, 1000);
        });
    },
    queryAgent() {
      this.loading = true;
      this.agentTabLoading = true;
      this.endAgentQuery = false;
      backendapiService
        .playersummaryreport(this.queryAgentParameters)
        .then(res => {
          if (res.data.statusCode != 200 || res.data.data.records.length == 0) {
            // window.setTimeout(() => (this.loading = false), 1000);
            window.setTimeout(() => {
              this.loading = false;
              this.agentTabLoading = false;
            }, 1000);
            return;
          }
          this.agentRecords = res.data.data.records;
          this.agentPageIndex = res.data.data.pageIndex;
          this.agentPageSize = res.data.data.pageSize;
          this.agentPageCount = res.data.data.pageCount;
          this.agentItemCount = res.data.data.itemCount;

          this.agentTotal = res.data.data.total;
          this.agentSubTotal = res.data.data.subTotal;

          this.agentRecords.unshift(
            {
              currency: this.agentTotal.currency,
              sumBets: this.agentTotal.totalBets,
              sumValidBets: this.agentTotal.totalValidBets,
              sumWin: this.agentTotal.totalWin,
              sumJackpotContribute: this.agentTotal.totalJackpotContribute,
              sumJackpot: this.agentTotal.totalJackpot,
              commission: this.agentTotal.totalCommission,
              sumNetWin: this.agentTotal.totalNetWin,
              items: this.agentTotal.items,
              accountID: "总计"
            },
            {
              currency: this.agentSubTotal.currency,
              sumBets: this.agentSubTotal.subTotalBets,
              sumValidBets: this.agentSubTotal.subTotalValidBets,
              sumWin: this.agentSubTotal.subTotalWin,
              sumJackpotContribute: this.agentSubTotal
                .subTotalJackpotContribute,
              sumJackpot: this.agentSubTotal.subTotalJackpot,
              commission: this.agentSubTotal.subCommission,
              sumNetWin: this.agentSubTotal.subTotalNetWin,
              items: this.agentSubTotal.items,
              accountID: "小计"
            }
          );

          // window.setTimeout(() => (this.loading = false), 1000);
          window.setTimeout(() => {
            this.loading = false;
            this.agentTabLoading = false;
            this.endAgentQuery = true;
          }, 1000);
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
      this.queryParameters.agent = null;
      this.queryForPlayer();
    },
    clickManagerPage(e) {
 
      if (!this.endManagerQuery) {
        return;
      }
      if (
        e.pageIndex == this.managerPageCount &&
        this.managerPageIndex == this.managerPageCount
      ) {
        return;
      }
      if (e.pageIndex == this.managerPageIndex) {
        return;
      }
      this.queryManagerParameters.pageIndex = e.pageIndex;
      this.queryManagerParameters.agent = this.quesManager;
      this.queryManger();
    },
    clickAgentPage(e) {
  
      if (!this.endAgentQuery) {
        return;
      }
      if (
        e.pageIndex == this.agentPageCount &&
        this.agentPageIndex == this.agentPageCount
      ) {
        return;
      }
      if (e.pageIndex == this.agentPageIndex) {
        return;
      }
      this.queryAgentParameters.pageIndex = e.pageIndex;
      this.queryAgentParameters.agent = this.quesAgent;
      this.queryAgent();
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    downloadReportByGame() {
      this.queryParameters.agent = null;
      backendapiService
        .summaryreportgamedownload(this.queryParameters)
        .then(res => {
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
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `WinLostReport_${fileText}.csv`);
          document.body.appendChild(link);
          link.click();
        });
    },
    downloadReportAgent() {
      this.queryManagerParameters.agent = this.quesManager;

      backendapiService
        .summaryreportplayerdownload(this.queryManagerParameters)
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "WinLostReport_Agent.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
    downloadReportMember() {
      this.queryManagerParameters.agent = this.quesAgent;

      backendapiService
        .summaryreportplayerdownload(this.queryAgentParameters)
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "WinLostReport_Member.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
    tableRowStyle({ row, rowIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return "background-color: rgb(7, 65, 109)";
      }
    },
    getUserData1(ID) {
      if (this.accountLV != "3") {
        // console.log(ID);
        this.userID1 = ID;
        this.isShowTab1 = true;
      } else {
        return;
      }
    }
  }
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

.WinLost {
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
