
<template>
  <div class="AgentReport">
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
  name: "AgentReport",
  data() {
    return {
      modalParent: null,
      modalSelf: null,
      accountLV: null,
      loading: false,
      agentRecords: [],
      endAgentQuery: true,
      agentPageIndex: 0,
      agentPageSize: 0,
      agentPageCount: 0,
      agentItemCount: 0,
      agentTotal: [],
      agentSubTotal: [],
      queryAgentParameters: [],
      agentID: "",
      prevAgent: "",
    };
  },
  components: {
    "app-pagination": Pagination,
  },
  methods: {
    init(parent, agent, querySource) {
      this.modalParent = parent;
      this.modalSelf = agent;
      this.queryAgentParameters = querySource;
      this.accountLV = sessionStorage.getItem("level");

      if (
        this.agentID != "" &&
        this.queryAgentParameters.agent != this.agentID
      ) {
        let temp = this.agentID;
        this.prevAgent = temp;
        this.agentID = this.queryAgentParameters.agent;
        this.queryAgentParameters.pageIndex = 1;
      } else {
        this.agentID = this.queryAgentParameters.agent;
      }
      this.queryAgent();
    },
    tableRowStyle({ row, rowIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return "background-color: rgb(7, 65, 109)";
      }
    },
    downloadReportMember() {
      this.queryAgentParameters.agent = this.agentID;

      backendapiService
        .summaryreportplayerdownload(this.queryAgentParameters)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "WinLostReport_Member.csv");
          document.body.appendChild(link);
          link.click();
        });
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
      this.queryAgentParameters.agent = this.agentID;

      this.modalParent.childResetQuery(this.queryAgentParameters);
      this.queryAgent();
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    queryAgent() {
      this.loading = true;
      this.endAgentQuery = false;
      backendapiService
        .playersummaryreport(this.queryAgentParameters)
        .then((res) => {
          if (res.data.statusCode != 200 || res.data.data.records.length == 0) {
            window.setTimeout(() => {
              this.loading = false;
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
              sumJackpot2: this.agentTotal.totalJackpot2,
              sumJackpot3: this.agentTotal.totalJackpot3,
              sumPureNetWin: this.agentTotal.totalPureNetWin,

              commission: this.agentTotal.totalCommission,
              sumNetWin: this.agentTotal.totalNetWin,
              items: this.agentTotal.items,
              accountID: "总计",
            },
            {
              currency: this.agentSubTotal.currency,
              sumBets: this.agentSubTotal.subTotalBets,
              sumValidBets: this.agentSubTotal.subTotalValidBets,
              sumWin: this.agentSubTotal.subTotalWin,
              sumJackpotContribute: this.agentSubTotal
                .subTotalJackpotContribute,
              sumJackpot: this.agentSubTotal.subTotalJackpot,
              sumJackpot2: this.agentSubTotal.subTotalJackpot2,
              sumJackpot3: this.agentSubTotal.subTotalJackpot3,

              sumPureNetWin: this.agentSubTotal.subTotalPureNetWin,

              commission: this.agentSubTotal.subCommission,
              sumNetWin: this.agentSubTotal.subTotalNetWin,
              items: this.agentSubTotal.items,
              accountID: "小计",
            }
          );
          this.endAgentQuery = true;
          window.setTimeout(() => {
            this.loading = false;
            this.endAgentQuery = true;
          }, 1000);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
