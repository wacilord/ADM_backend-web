
<template>
  <div class="EventPlayer">
    <div class="exportBox">
      <el-button class="exportBtn" @click="downloadEventList_player">
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
      :data="renderList"
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
      <el-table-column fixed label="单号" min-width="170" prop>
        <template slot-scope="prop">
          <div>{{ prop.row.gameTurn }}</div>
        </template>
      </el-table-column>

      <el-table-column label="帐号" min-width="150" prop>
        <template slot-scope="prop">
          <div>{{ prop.row.accountID }}</div>
        </template>
      </el-table-column>

      <el-table-column label="中奖金额" min-width="150">
        <template slot-scope="prop">
          <div style="text-align: right">
            {{ getfloat(prop.row.camWin) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="币别"
        min-width="100"
        prop="currency"
      ></el-table-column>

      <el-table-column
        label="奖项名称"
        min-width="100"
        prop="camAwardTypeName"
      ></el-table-column>

      <el-table-column
        label="中奖时间"
        min-width="180"
        prop="camAwardCreateDateTime"
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
  name: "EventPlayer",
  data() {
    return {
      modalParent: null,
      modalSelf: null,
      accountLV: null,
      loading: false,
      queryPlayerParameters: {},
      renderList: [],
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
    init(grand, player, querySource) {
      this.modalParent = grand;
      this.modalSelf = player;
      this.queryPlayerParameters = querySource;
      this.accountLV = sessionStorage.getItem("level");

      this.queryPlayerParameters.pageIndex = 1;
      this.queryPlayerParameters.pageSize = 10;
      this.queryPlayer();
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    downloadEventList_player() {
      backendapiService
        .summarycamreportdownload(this.queryPlayerParameters)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "EventAwardList4.csv");
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
      this.queryPlayerParameters.pageIndex = e.pageIndex;
      //   this.queryParameters.agent = null;
      this.queryPlayer();
    },
    queryPlayer() {
      this.loading = true;
      //   this.queryPlayerParameters.pageIndex = 1;
      //   this.queryPlayerParameters.pageSize = 10;

      backendapiService
        .playersummarycamreport(this.queryPlayerParameters)
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
          this.renderList = res.data.data.records;
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
    setEventTotal(res) {
      if (res.data.data.records.length == 0) {
        return;
      }
      // 取游戏类别总计小计
      this.eventTotal = res.data.data.total;
      this.eventSubTotal = res.data.data.subTotal;

      this.renderList.unshift(
        {
          currency: this.eventTotal.currency,
          items: this.eventTotal.items,
          camWin: this.eventTotal.totalCamWin,
          gameTurn: "总计",
          accountID: "- -",
          camAwardCreateDateTime: "- -",
          camAwardTypeName: "- -",
        },
        {
          currency: this.eventSubTotal.currency,
          items: this.eventSubTotal.items,
          camWin: this.eventSubTotal.totalCamWin,
          gameTurn: "小计",
          accountID: "- -",
          camAwardCreateDateTime: "- -",
          camAwardTypeName: "- -",
        }
      );
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
.playerBox {
  cursor: pointer;
  border-bottom: 2px solid #00ffbf;
}

.inputSize {
  margin: 8px 0;
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
