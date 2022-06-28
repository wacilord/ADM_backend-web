
<template>
  <div class="ManagerReport">
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
            v-if="checkCanClick(prop.row.accountID, true)"
            @click="requestAgent(prop.row.accountID)"
            class="playerBox"
          >
            {{ prop.row.accountID }}
          </div>
          <div v-else>{{ prop.row.accountID }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="币别"
        min-width="100"
        prop="currency"
      ></el-table-column>
      <el-table-column label="总投注额" min-width="150">
        <template slot-scope="prop">
          <div style="text-align: right">{{ getfloat(prop.row.sumBets) }}</div>
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
        min-width="100"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";

export default {
  name: "ManagerReport",
  data() {
    return {
      modalParent: null,
      modalSelf: null,
      queryManagerParameters: [],
      managerPageIndex: 0,
      managerPageSize: 0,
      managerPageCount: 0,
      managerItemCount: 0,
      endManagerQuery: false,
      managerRecords: [],
      managerTotal: [],
      managerSubTotal: [],
      accountLV: null,
      loading: false,
      queryAgentParameters: {
        gameType: [],
        timeHour: 0,
        startDate: null,
        endDate: null,
        pageIndex: 1,
        pageSize: 10,
        agent: null,
      },
      managerID: "",
      prevManager: "",
    };
  },
  components: {
    "app-pagination": Pagination,
  },
  methods: {
    dataInit(parent, manager, querySource) {
      this.modalParent = parent;
      this.modalSelf = manager;
      this.queryManagerParameters = querySource;
      this.accountLV = sessionStorage.getItem("level");

      if (
        this.managerID != "" &&
        this.queryManagerParameters.agent != this.managerID
      ) {
        let temp = this.managerID;
        this.prevManager = temp;
        this.managerID = this.queryManagerParameters.agent;
        this.queryManagerParameters.pageIndex = 1;
      } else {
        this.managerID = this.queryManagerParameters.agent;
      }

      this.queryManger();
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
      this.queryManagerParameters.agent = this.managerID;

      // 呼叫父層，改回原查詢條件
      this.modalParent.childResetQuery(this.queryManagerParameters);
      this.queryManger();
    },
    tableRowStyle({ row, rowIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return "background-color: rgb(7, 65, 109)";
      }
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
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    queryManger() {
      this.loading = true;
      this.endManagerQuery = false;
      backendapiService
        .playersummaryreport(this.queryManagerParameters)
        .then((res) => {
          if (res.data.statusCode != 200 || res.data.data.records.length == 0) {
            window.setTimeout(() => {
              this.loading = false;
            }, 1000);
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
              sumJackpot2: this.managerTotal.totalJackpot2,
              sumJackpot3: this.managerTotal.totalJackpot3,
              sumPureNetWin: this.managerTotal.totalPureNetWin,

              commission: this.managerTotal.totalCommission,
              sumNetWin: this.managerTotal.totalNetWin,
              items: this.managerTotal.items,
              accountID: "总计",
            },
            {
              currency: this.managerSubTotal.currency,
              sumBets: this.managerSubTotal.subTotalBets,
              sumValidBets: this.managerSubTotal.subTotalValidBets,
              sumWin: this.managerSubTotal.subTotalWin,
              sumJackpotContribute: this.managerSubTotal
                .subTotalJackpotContribute,
              sumJackpot: this.managerSubTotal.subTotalJackpot,
              sumJackpot2: this.managerSubTotal.subTotalJackpot2,
              sumJackpot3: this.managerSubTotal.subTotalJackpot3,
              sumPureNetWin: this.managerSubTotal.subTotalPureNetWin,

              commission: this.managerSubTotal.subCommission,
              sumNetWin: this.managerSubTotal.subTotalNetWin,
              items: this.managerSubTotal.items,
              accountID: "小计",
            }
          );

          window.setTimeout(() => {
            this.loading = false;
            this.endManagerQuery = true;
          }, 1000);
        });
    },
    requestAgent(id) {
      this.queryAgentParameters = this.queryManagerParameters;
      this.queryAgentParameters.agent = id;
      this.modalParent.getComponentManager(this.queryAgentParameters);
    },
    downloadReportAgent() {
      this.queryManagerParameters.agent = this.managerID;

      backendapiService
        .summaryreportplayerdownload(this.queryManagerParameters)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "WinLostReport_Agent.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.playerBox {
  cursor: pointer;
  border-bottom: 2px solid #00ffbf;
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
.exportBox {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;
}
</style>
