<template>
  <div class="JackpotAgentReport">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>天九福彩(新)查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">天九福彩(新)查询</span>
        </el-row>

        <div class="searchForm">
          <el-date-picker
            class="dateInput"
            v-model="queryParameters.startDate"
            type="date"
            placeholder="选择开始时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerStartDate"
            @change="startDatePickerFormat"
          ></el-date-picker>

          <el-date-picker
            class="dateInput"
            v-model="queryParameters.endDate"
            type="date"
            placeholder="选择结束时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
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
        <el-tab-pane label="我的 _福彩" name="self">
          <el-table
            :data="selfList"
            border
            style="width: 100%"
            class="exportTable"
          >
            <el-table-column
              label="币别"
              min-width="100"
              prop="currency"
            ></el-table-column>
            <el-table-column label="宝蟾小奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.mini) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="锦鲤中奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.minor) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="祥狮大奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.major) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="金龙巨奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.grand) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ************************************************************************************** -->
        <!-- 经理 -->
        <el-tab-pane
          label="经理 _福彩"
          v-show="isShowManagerTab"
          name="manager"
        >
          <el-table
            :data="jpList"
            border
            style="width: 100%"
            class="exportTable"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column fixed label="帐号" min-width="150">
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
            <el-table-column label="宝蟾小奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.mini) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="锦鲤中奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.minor) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="祥狮大奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.major) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="金龙巨奖" min-width="150">
              <template slot-scope="prop">
                <div style="text-align: right">
                  {{ getfloat(prop.row.grand) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ************************************************************************************** -->
        <!-- 代理 -->
        <el-tab-pane label="代理 _福彩" v-show="isShowAgentTab" name="agent">
          <app-AgentReport ref="modalForAgent"></app-AgentReport>
        </el-tab-pane>
        <!-- ************************************************************************************** -->
        <!-- 会员 -->
        <el-tab-pane label="会员 _福彩" v-show="isShowPlayerTab" name="player">
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
import JackpotAgent from "@/components/JackpotAgent";
import JackpotPlayer from "@/components/JackpotPlayer";

export default {
  name: "JackpotAgentReport",
  data() {
    return {
      loginID: "",
      jpList: [],
      selfList: [],
      queried: false,
      activeName: "self",
      loading: true,
      isShowManagerTab: false,
      isShowAgentTab: false,
      isShowPlayerTab: false,
      queryParameters: {
        accountID: "",
        startDate: "",
        endDate: "",
      },
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
    };
  },
  components: {
    "app-AgentReport": JackpotAgent,
    "app-PlayerReport": JackpotPlayer,
  },
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "jackpotreport")) {
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
    // console.log(this.accountLV);
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

      if (this.accountLV == 1) {
        this.hideAgent();
        this.hidePlayer();
        // this.isShowManagerTab = true;
        // this.activeName = "manager";
      } else if (this.accountLV == 2) {
        this.hideManager();
        //  this.hideAgent();
        this.hidePlayer();
        // this.isShowAgentTab = true;
        // this.activeName = "agent";
      } else {
        this.hideManager();
        this.hideAgent();
        // this.isShowPlayerTab = true;
      }
      this.queryJP();
    },
    queryJP() {
      // this.activeName = "manager";
      this.queried = true;

      // 自己
      backendapiService.jackpotagentreport(this.queryParameters).then((res) => {
        if (res.data.statusCode != 200) {
          this.alertError("查询失败");
          return;
        }
        this.selfList = res.data.data.jackpotRecord;
      });

      if (this.accountLV == 2) {
        let temp = {
          accountID: "",
          startDate: "",
          endDate: "",
        };
        temp.accountID = this.loginID;
        temp.startDate = this.queryParameters.startDate;
        temp.endDate = this.queryParameters.endDate;
        // this.showAgent();
        this.$refs.modalForAgent.init(this, this.$refs.modalForAgent, temp);
        return;
      }

      if (this.accountLV == 3) {
        let temp = {
          accountID: "",
          startDate: "",
          endDate: "",
        };
        temp.accountID = this.loginID;
        temp.startDate = this.queryParameters.startDate;
        temp.endDate = this.queryParameters.endDate;
        // this.showPlayer();
        this.$refs.modalForPlayer.init(this, this.$refs.modalForPlayer, temp);
        return;
      }

      // 下一层
      let temp = {
        accountID: "",
        startDate: "",
        endDate: "",
      };
      temp.accountID = this.loginID;
      temp.startDate = this.queryParameters.startDate;
      temp.endDate = this.queryParameters.endDate;
      backendapiService.jackpotagentreport(temp).then((res) => {
        if (res.data.statusCode != 200) {
          this.alertError("查询失败");
          return;
        }
        this.jpList = res.data.data.jackpotRecord;
        window.setTimeout(() => (this.loading = false), 1000);
      });
    },

    requestAgent(selectID) {
      let temp = {
        accountID: "",
        startDate: "",
        endDate: "",
      };
      temp.accountID = selectID;
      temp.startDate = this.queryParameters.startDate;
      temp.endDate = this.queryParameters.endDate;

      this.showAgent();
      this.$refs.modalForAgent.init(this, this.$refs.modalForAgent, temp);
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
        return true;
      }
      return false;
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
.JackpotAgentReport {
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

@media screen and (max-width: 768px) {
  .searchForm {
    flex-direction: column;
  }

  .dateInput {
    width: 100%;
  }
}
</style>