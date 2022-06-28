
<template>
  <div class="TransferList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>点数查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">点数查询</span>
        </el-row>
      </el-row>
    </el-container>

    <el-tabs type="border-card" class="tabsBox">
      <el-tab-pane label="一般查询">
        <div class="textBox">
          <div>
            <el-select v-model="queryParametersForList.code" placeholder="选择交易类型" class="innerItem">
              <el-option label="全部" value></el-option>
              <el-option label="入金" value="3101"></el-option>
              <el-option label="出金" value="3102"></el-option>
            </el-select>

            <el-input
              v-model="queryParametersForList.accountID"
              placeholder="会员帐号( 选填 )"
              class="innerItem"
              maxlength="40"
            ></el-input>

            <el-date-picker
              v-model="queryParametersForList.startDate"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:00"
              type="datetime"
              placeholder="选择开始时间"
              class="innerItem"
              :picker-options="pickerStartDate"
              @change="startDatePickerFormat"
            ></el-date-picker>
            <el-date-picker
              v-model="queryParametersForList.endDate"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:00"
              type="datetime"
              placeholder="选择结束时间"
              class="innerItem"
              :picker-options="pickerEndDate"
              @change="endDatePickerFormat"
            ></el-date-picker>
          </div>
          <div class="dateInfo">
            <i class="el-icon-info"></i>
            <span>搜寻日期仅近3个月</span>
          </div>
          <el-button class="sureBtn searchBtn" @click="startQueryForList">查询</el-button>
        </div>

        <div v-show="ResponseWithNullRecord">
          <div class="recordBox">
            <span>时间范围内无记录</span>
          </div>
        </div>

        <div v-show="listRecords.length > 0">
          <app-pagination
            :endQuery="endQuery"
            :pageIndex="pageIndex"
            :pageSize="pageSize"
            :pageCount="pageCount"
            :itemCount="itemCount"
            @clickPage="clickPage"
          ></app-pagination>
          <el-table
            :data="listRecords"
            border
            style="width: 100%"
            class="exportTable"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column fixed prop="transferID" label="交易单号" min-width="160"></el-table-column>
            <el-table-column prop="accountID" label="会员帐号" min-width="120"></el-table-column>
            <el-table-column label="阶层" min-width="300">
              <template slot-scope="prop">{{getAccountLV(prop.row.agentTree)}}</template>
            </el-table-column>
            <el-table-column prop="codeText" label="类型" min-width="100"></el-table-column>
            <el-table-column prop="currency" label="币别" min-width="100"></el-table-column>
            <el-table-column prop label="请求金额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.point) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="结果" min-width="100"></el-table-column>
            <!-- <el-table-column prop label="交易前余额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.beforeBalance) }}</div>
              </template>
            </el-table-column>-->
            <!-- <el-table-column prop label="成交金额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.balance) }}</div>
              </template>
            </el-table-column>-->
            <!-- <el-table-column prop label="交易后余额" min-width="150">
              <template slot-scope="prop">
                <div style="text-align:right;">{{ getfloat(prop.row.afterBalance) }}</div>
              </template>
            </el-table-column>-->

            <el-table-column prop="createDateTime" label="交易时间" min-width="180"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="依点数交易单号查询">
        <div class="textBox">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="交易单号">
              <el-input
                v-model="queryParametersForDetail.transferID"
                placeholder="请输入交易单号"
                maxlength="60"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="sureBtn" @click="startQueryForDetail">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="detailRecords"
          border
          style="width: 100%"
          class="exportTable"
          v-show="detailRecords.length > 0 && !errorTransferCode"
          v-loading="SEQloading"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column fixed prop="transferID" label="交易单号" min-width="160"></el-table-column>
          <el-table-column prop="accountID" label="会员帐号" min-width="120"></el-table-column>
          <el-table-column label="阶层" min-width="300">
            <template slot-scope="prop">{{getAccountLV(prop.row.agentTree)}}</template>
          </el-table-column>
          <el-table-column prop="codeText" label="类型" min-width="100"></el-table-column>
          <el-table-column prop="currency" label="币别" min-width="100"></el-table-column>
          <el-table-column prop label="请求金额" min-width="150">
            <template slot-scope="prop">
              <div style="text-align:right;">{{ getfloat(prop.row.point) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="结果" min-width="100"></el-table-column>
          <!-- <el-table-column prop label="交易前余额" min-width="150">
            <template slot-scope="prop">
              <div style="text-align:right;">{{ getfloat(prop.row.beforeBalance) }}</div>
            </template>
          </el-table-column>-->
          <!-- <el-table-column prop label="成交金额" min-width="150">
            <template slot-scope="prop">
              <div style="text-align:right;">{{ getfloat(prop.row.balance) }}</div>
            </template>
          </el-table-column>-->
          <!-- <el-table-column prop label="交易后余额" min-width="150">
            <template slot-scope="prop">
              <div style="text-align:right;">{{ getfloat(prop.row.afterBalance) }}</div>
            </template>
          </el-table-column>-->

          <el-table-column prop="createDateTime" label="交易时间" min-width="180"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";
import moment from "moment";

export default {
  name: "TransferList",
  components: {
    "app-pagination": Pagination
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (
        !this.authUtil.isAuth(this, "transfer") &&
        !this.authUtil.isAuth(this, "menu3")
      ) {
        return;
      }
    }
    this.$store.state.showNav = 0;
  },
  data() {
    return {
      loading: true,
      SEQloading: true,
      queryParametersForList: {
        code: "",
        startDate: null,
        endDate: null,
        accountID: "",
        pageIndex: 1,
        pageSize: 10
      },
      tempQuery: {},
      queryParametersForDetail: {
        transferID: ""
      },
      listRecords: [],
      ResponseWithNullRecord: false,
      errorTransferCode: false,
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      itemCount: 1,
      detailRecords: [],
      pickerStartDate: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerEndDate: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 8.64e7;
        }
      },
      endQuery: false
    };
  },
  methods: {
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
    checkParametersForList() {
      var errs = [];
      if (this.queryParametersForList.startDate == null) {
        errs.push("选择开始时间");
      }
      if (this.queryParametersForList.endDate == null) {
        errs.push("选择结束时间");
      }
      if (
        this.queryParametersForList.startDate != null &&
        this.queryParametersForList.startDate != null &&
        this.queryParametersForList.startDate ==
          this.queryParametersForList.endDate
      ) {
        errs.push("开始时间不能等于结束时间");
      }
      if (
        this.queryParametersForList.startDate != null &&
        this.queryParametersForList.startDate != null &&
        moment(this.queryParametersForList.startDate) >
          moment(this.queryParametersForList.endDate)
      ) {
        errs.push("开始时间不能大于结束时间");
      }
      let months = moment(this.queryParametersForList.endDate).diff(
        moment(this.queryParametersForList.startDate),
        "months"
      );
      if (months > 2) {
        errs.push("日期查询区间不能超过3个月");
      }
      return errs;
    },
    parametersErrorForList(errs) {
      let errMsg = errs.join("<br>");
      this.alertError(errMsg);
      this.listRecords = [];
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
    checkParametersForDetail() {
      var errs = [];
      if (this.queryParametersForDetail.transferID == "") {
        errs.push("请输入交易单号");
      }
      return errs;
    },
    parametersErrorForDetail(errs) {
      let errMsg = errs.join("\n");
      this.alertError(errMsg);
      this.detailRecords = [];
    },
    startQueryForList() {
      let errs = this.checkParametersForList();
      if (errs.length > 0) {
        this.parametersErrorForList(errs);
        return;
      }
      this.queryParametersForList.pageIndex = 1;
      this.tempQuery.pageIndex = 1;
      this.tempQuery = JSON.parse(JSON.stringify(this.queryParametersForList));
      this.queryForList();
    },
    startDatePickerFormat(time) {
      this.queryParametersForList.startDate = time;
    },
    endDatePickerFormat(time) {
      this.queryParametersForList.endDate = time;
    },
    queryForList() {
      this.loading = true;
      this.endQuery = false;
      backendapiService.transferlist(this.tempQuery).then(res => {
        if (res.data.statusCode != 200) {
          window.setTimeout(() => (this.loading = false), 1000);
          return;
        }
        this.endQuery = true;
        this.listRecords = res.data.data.records;
        if (res.data.data.records.length == 0) {
          this.ResponseWithNullRecord = true;
        } else {
          this.ResponseWithNullRecord = false;
        }
        this.listRecords.forEach(ele => {
          ele.codeText = this.lang.getAccountCode(ele.code);
        });
        this.listRecords.forEach(ele => {
          ele.status = this.lang.getTransferStatus(ele.status);
        });
        this.pageIndex = res.data.data.pageIndex;
        this.pageSize = res.data.data.pageSize;
        this.pageCount = res.data.data.pageCount;
        this.itemCount = res.data.data.itemCount;

        window.setTimeout(() => (this.loading = false), 1000);
      });
    },
    startQueryForDetail() {
      let errs = this.checkParametersForDetail();
      if (errs.length > 0) {
        this.parametersErrorForDetail(errs);
        return;
      }
      this.queryForDetail();
    },
    queryForDetail() {
      this.SEQloading = true;
      backendapiService
        .transferdetail(this.queryParametersForDetail)
        .then(res => {
          if (res.data.statusCode != 200) {
            this.errorTransferCode = true;
            return;
          } else {
            this.errorTransferCode = false;
            this.detailRecords = res.data.data.records;
            this.detailRecords.forEach(ele => {
              ele.codeText = this.lang.getAccountCode(ele.code);
            });
            this.detailRecords.forEach(ele => {
              ele.status = this.lang.getTransferStatus(ele.status);
            });
            window.setTimeout(() => (this.SEQloading = true), 1000);
          }
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

      // this.queryParametersForList.pageIndex = e.pageIndex;
      this.tempQuery.pageIndex = e.pageIndex;
      this.queryParametersForList = JSON.parse(JSON.stringify(this.tempQuery));
      this.queryForList();
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    }
  }
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
}
.recordBox {
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
  padding: 20px;
  text-align: center;
  font-weight: 200;
  margin: 20px 0;
}
.TransferList {
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
.textBox_Size {
  padding: 10px;
}

.exportTable {
  margin-top: 30px;
}

.el-tabs--border-card {
  border: 1px solid #4c4c4c;
  background-color: rgba(46, 46, 46, 0.7);
}
.tabsBox {
  margin-top: 30px;
}

.innerItem {
  width: 45% !important;
  margin: 10px 5px;
}
.searchBtn {
  margin-top: 20px;
  padding: 15px 50px;
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

.dateInfo {
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  letter-spacing: 1.5px;
}
@media screen and (max-width: 414px) {
  .LoginLogList {
    padding: 15px;
  }
  .table-row {
    padding: 10px;
  }
  .TransferList {
    padding: 10px;
  }
  .innerItem {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
