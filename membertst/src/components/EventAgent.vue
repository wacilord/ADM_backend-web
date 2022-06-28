
<template>
  <div class="EventAgent">
    <div class="exportBox">
      <el-button class="exportBtn" @click="downloadEventList_Agent">
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
      :data="agentEventList"
      border
      :row-style="tableRowStyle"
      :cell-style="tableRowStyle"
      class="exportTable"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column fixed label="帐号" min-width="150" prop>
        <template slot-scope="prop">
          <div
            v-if="checkCanClick(prop.row.accountID, true)"
            @click="requestPlayer(prop.row.accountID)"
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
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import Pagination from "@/components/Pagination";

export default {
  name: "EventAgent",
  data() {
    return {
      modalParent: null,
      modalSelf: null,
      accountLV: null,
      loading: false,
      queryAgentParameters: {},
      agentEventList: [],
      eventTotal: null,
      eventSubTotal: null,
      pageIndex: 0,
      pageSize: 0,
      pageCount: 0,
      itemCount: 0,
      endQuery: true,
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

      this.queryAgent();
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    downloadEventList_Agent() {
    //   this.queryParameters.agent = null;
      backendapiService
        .summarycamreportdownload(this.queryAgentParameters)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "EventAwardList3.csv");
          document.body.appendChild(link);
          link.click();
        });
    },
    clickPage(e) {
      console.log(e)
      if (!this.endQuery) {
        return;
      }
      if (e.pageIndex == this.pageCount && this.pageIndex == this.pageCount) {
        return;
      }
      if (e.pageIndex == this.pageIndex) {
        return;
      }
      this.queryAgentParameters.pageIndex = e.pageIndex;
      //   this.queryParameters.agent = null;
      this.queryAgent();
    },
    queryAgent() {
      this.loading = true;
      backendapiService
        .summarycamreport(this.queryAgentParameters)
        .then((res) => {
          if (res.data.statusCode != 200) {
            this.alertError("查询失败");
            return;
          }

          this.pageIndex = res.data.data.pageIndex;
          this.pageSize = res.data.data.pageSize;
          this.pageCount = res.data.data.pageCount;
          this.itemCount = res.data.data.itemCount;
          this.agentEventList = res.data.data.records;
          this.setEventTotal(res);

          window.setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
    },
    alertError(txt) {
      this.$notify.error({
        title: "T9 错误",
        dangerouslyUseHTMLString: true,
        message: txt,
      });
    },
    checkCanClick(id, canClickID) {
      if (this.accountLV != 3 && canClickID) {
        return true;
      }
      return false;
    },
    requestPlayer(val) {
      let temp = {
        accountID: "",
        startDate: "",
        endDate: "",
      };
      temp.accountID = val;
      temp.startDate = this.queryAgentParameters.startDate;
      temp.endDate = this.queryAgentParameters.endDate;

      this.modalParent.showPlayer(temp);
      this.modalParent.initDataPlayer(temp);
    },
    setEventTotal(res) {
      if (res.data.data.records.length == 0) {
        return;
      }
      // 取游戏类别总计小计
      this.eventTotal = res.data.data.total;
      this.eventSubTotal = res.data.data.subTotal;

      this.agentEventList.unshift(
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
