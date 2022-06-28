
<template>
  <div class="JackpotPlayer">
    <el-input
      placeholder="搜寻帐号"
      prefix-icon="el-icon-search"
      v-model.trim="searchID"
      class="inputSize"
    >
    </el-input>

    <el-table
      :data="renderList"
      border
      style="width: 100%"
      class="exportTable"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column
        fixed
        prop="gameTurn"
        label="单号"
        min-width="150"
      ></el-table-column>

      <el-table-column
        label="中奖时间"
        prop="gameTime"
        min-width="100"
      ></el-table-column>

      <el-table-column
        label="币别"
        min-width="100"
        prop="currency"
      ></el-table-column>

      <el-table-column label="阶层" min-width="150">
        <template slot-scope="prop">
          <div>
            {{ filterLevel(prop.row.agentTree) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="帐号" min-width="150">
        <template slot-scope="prop">
          <div>
            {{ prop.row.accountID }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="游戏名称" min-width="150">
        <template slot-scope="prop">
          <div>
            {{ prop.row.gameName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="中奖彩池" min-width="100">
        <template slot-scope="prop">
          <div>
            {{ prop.row.jackpotPoolType }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="中奖点数" min-width="150">
        <template slot-scope="prop">
          <div style="text-align: right">
            {{ getfloat(prop.row.jackpot2) }}
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
  name: "JackpotPlayer",
  data() {
    return {
      modalParent: null,
      modalSelf: null,
      accountLV: null,
      loading: false,
      queryPlayerParameters: {},
      jpList: [],
      searchID: "",
      renderList: [],
    };
  },
  watch: {
    searchID(val) {
      if (val == "") {
        let temp = JSON.parse(JSON.stringify(this.jpList));
        this.renderList = temp;
        return;
      }

      window.setTimeout(() => {
        let temp = JSON.parse(JSON.stringify(this.jpList));

        temp = temp.filter((res) => {
          return res.accountID.match(val);
        });

        this.renderList = temp;
      }, 500);
    },
  },
  methods: {
    init(grand, player, querySource) {
      this.modalParent = grand;
      this.modalSelf = player;
      this.queryPlayerParameters = querySource;
      this.accountLV = sessionStorage.getItem("level");

      this.queryPlayer();
    },
    getfloat(val) {
      return passwordstrength.intFormat(val);
    },
    queryPlayer() {
      this.loading = true;
      backendapiService
        .jackpotplayerreport(this.queryPlayerParameters)
        .then((res) => {
          if (res.data.statusCode != 200) {
            this.alertError("查询失败");
            return;
          }

          this.jpList = res.data.data.jackpotRecord;
          this.renderList = res.data.data.jackpotRecord;

          this.jpList.forEach((ele) => {
            if (ele.jackpotPoolType == "Mini") ele.jackpotPoolType = "宝蟾小奖";
            if (ele.jackpotPoolType == "Minor")
              ele.jackpotPoolType = "锦鲤中奖";
            if (ele.jackpotPoolType == "Major")
              ele.jackpotPoolType = "祥狮大奖";
            if (ele.jackpotPoolType == "Grand")
              ele.jackpotPoolType = "金龙巨奖";
          });

          this.renderList.forEach((ele) => {
            if (ele.jackpotPoolType == "Mini") ele.jackpotPoolType = "宝蟾小奖";
            if (ele.jackpotPoolType == "Minor")
              ele.jackpotPoolType = "锦鲤中奖";
            if (ele.jackpotPoolType == "Major")
              ele.jackpotPoolType = "祥狮大奖";
            if (ele.jackpotPoolType == "Grand")
              ele.jackpotPoolType = "金龙巨奖";
          });

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
</style>
