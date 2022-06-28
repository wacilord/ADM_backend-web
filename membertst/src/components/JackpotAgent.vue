
<template>
  <div class="JackpotAgent">
    <el-table
      :data="jpList"
      border
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
            @click="requestPlayer(prop.row.accountID)"
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
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { passwordstrength } from "../password/passwordStrength.js";

export default {
  name: "JackpotAgent",
  data() {
    return {
      modalParent: null,
      modalSelf: null,
      accountLV: null,
      loading: false,
      queryAgentParameters: {},
      jpList: [],
    };
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
    queryAgent() {
      this.loading = true;
      backendapiService
        .jackpotagentreport(this.queryAgentParameters)
        .then((res) => {
          if (res.data.statusCode != 200) {
            this.alertError("查询失败");
            return;
          }

          this.jpList = res.data.data.jackpotRecord;

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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.playerBox {
  cursor: pointer;
  border-bottom: 2px solid #00ffbf;
}
</style>
