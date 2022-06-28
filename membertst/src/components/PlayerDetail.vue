
<template>
  <div class="PlayerDetail">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>依会员ID查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">依会员ID查询</span>
        </el-row>
        <el-row class="textBox_Size">
          <el-form
            :inline="true"
            :model="queryParameters"
            class="demo-form-inline"
            @submit.native.prevent
          >
            <el-form-item label="会员帐号">
              <el-input v-model="queryParameters.accountID" placeholder="请输入会员帐号" maxlength="40"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="sureBtn" @click="startQueryForList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </el-row>
    </el-container>

    <el-table
      v-if="hasQuery"
      :data="accountList"
      border
      style="width: 100%"
      class="exportTable"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column fixed prop="accountID" label="帐号" min-width="150"></el-table-column>
      <el-table-column prop="agentTree" label="阶层" min-width="300">
        <template slot-scope="prop">{{ filterLevel(prop.row.agentTree) }}</template>
      </el-table-column>
      <el-table-column label="管理" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="query(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="showDetail">
      <el-card class="UserInfoPage">
        <el-row :gutter="24" class="rowSize">
          <!-- Row1 使用者头像ICON -->
          <el-col :md="24">
            <div class="infoBox">
              <i class="fas fa-user-circle"></i>
              <div class="accountCard">
                <span>{{ userinfoRecords.accountID }}</span>
                <span
                  :class="{'stateOnline':isOnline,'stateOffline':!isOnline}"
                >{{ isOnline?"在线":"离线"}}</span>
              </div>
            </div>
          </el-col>
          <!-- Row2  -->
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <span class="boxTitle">帐户创建日期</span>
              <span class="text_size">{{ userinfoRecords.createDateTime | dateTimeFormat }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <span class="boxTitle">加入至今</span>
              <span class="text_size">{{ userinfoRecords.createTotalDay }} 天</span>
            </div>
          </el-col>
          <!-- Row3  -->
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <span class="boxTitle">组织层级</span>
              <span class="text_size">{{ getOrgTreeString }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <span class="boxTitle">最近上线</span>
              <span class="text_size">{{ userinfoRecords.lastOnlineTime }}</span>
            </div>
          </el-col>
          <!-- Row4 会员资料 -->
          <el-col :xs="24" :sm="12" :md="12">
            <div class="infoBox">
              <div class="smCard">
                <h3 class="boxTitle">总点数</h3>
                <span>{{ userinfoRecords.point | commaFormat }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <div class="infoBox infoBox_Ln">
              <div class="smCard">
                <h3 class="boxTitle">钱包更新日期</h3>
                <span>{{ userinfoRecords.pointUpdateTime | dateTimeFormat }}</span>
              </div>
            </div>
          </el-col>
          <!-- Row5 会员资料 -->
          <el-col :xs="24" :sm="12" :md="12">
            <div class="infoBox infoBox_Ln">
              <div class="smCard">
                <h3 class="boxTitle">历史总投注额</h3>
                <span>{{ userinfoRecords.historyBets | commaFormat }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <div class="infoBox infoBox_Ln">
              <div class="smCard">
                <h3 class="boxTitle">历史总盈利</h3>
                <span>{{ userinfoRecords.historyNetWin | commaFormat }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <div class="infoBoxText">
              <span>( 历史记录仅保存近6个月 )</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-row :gutter="20" style="margin:0;" class="rowSize">
        <el-col :xs="24" :sm="24" class="colSize2">
          <div class="chartBox">
            <div class="card__title2">
              <p>每日盈利统计</p>
            </div>
            <div class="chartSize">
              <div id="bar1" ref="bar1_wrap"></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" class="colSize2">
          <div class="chartBox chartBox2 chartBoxMargin">
            <div class="card__title2">
              <p>游戏类别盈利</p>
            </div>
            <div class="chartSize">
              <div id="bar2" ref="bar2_wrap"></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" class="colSize2">
          <div class="chartBox chartBox2">
            <div class="card__title2">
              <p>投注比例统计</p>
            </div>
            <div class="chartSize">
              <div id="pie" ref="pie_wrap"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";
import { codeTransferName } from "../lang/searchCode";
import echarts from "echarts";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

export default {
  name: "PlayerDetail",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "playerdetail")) {
        return;
      }
    }
    this.$store.state.showNav = 0;

    let tempGameType = JSON.parse(sessionStorage.getItem("dbGameType"));
    tempGameType.sort();
    tempGameType.forEach((element, index) => {
      this.getGameType.push({
        gameTypeId: element,
        gameTypeName: codeTransferName.transGameTypeName(element)
      });
    });
  },
  data() {
    return {
      itemCount: 0,
      queryParameters: {
        accountID: "",
        playerGuid: ""
      },
      isOnline: true,
      userinfoRecords: [],
      orgTree: [],
      record_betsInfo: [],
      record_betsResultInfoByDay: [],
      record_betsResultInfoByGame: [],
      barDate: [],
      getGameType: [],
      resBarType: [],
      firstQuery: {
        status: 0,
        pageIndex: 1,
        pageSize: 999999,
        accountID: ""
      },
      accountList: [],
      loading: true,
      hasQuery: false,
      showDetail: false
    };
  },
  computed: {
    getOrgTreeString() {
      if (!this.orgTree) {
        return "";
      }

      return this.orgTree.join(" > ");
    }
  },
  methods: {
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
    startQueryForList() {
      this.showDetail = false;
      let errs = this.checkParametersForList();
      if (errs.length > 0) {
        this.parametersErrorForList(errs);
        return;
      }
      // 方法一:先给列表(阶层关系确认)
      // 方法2:for回圈

      let id = this.queryParameters.accountID;
      this.firstQuery.accountID = id;
      this.loading = true;
      backendapiService.playerlist(this.firstQuery).then(res => {
        if (res.data.statusCode !== 200) {
          this.hasQuery = false;
          return;
        }

        if (res.data.statusCode === 200) {
          this.hasQuery = true;
          this.accountList = res.data.data.records;
        }

        setTimeout(() => {
          this.loading = false;
        }, 500);
      });

      //

      // this.query();
    },
    checkParametersForList() {
      var errs = [];
      if (this.queryParameters.accountID == "") {
        errs.push("请输入查询会员ID");
      }
      return errs;
    },
    parametersErrorForList(errs) {
      let errMsg = errs.join("<br>");
      this.alertError(errMsg);
      this.userinfoRecords = [];
      this.itemCount = 0;
      this.showDetail = false;
    },
    alertError(txt) {
      this.$notify.error({
        title: "T9 错误",
        dangerouslyUseHTMLString: true,
        message: txt
      });
    },
    query(row) {
      // console.log(this.queryParameters);
      this.hasQuery = false;
      this.queryParameters.playerGuid = row.playerGuid;
      backendapiService.playerdetail(this.queryParameters).then(res => {
        if (res.data.statusCode == 200) {
          this.itemCount = 1;
          this.showDetail = true;
          this.userinfoRecords = res.data.data.userInfo;
          this.orgTree = res.data.data.userInfo.orgTree;
          this.isOnline = res.data.data.userInfo.online;
          this.resBarType = res.data.data.resultInfoByGame;

          this.record_betsInfo = this.pieFormate(res.data.data.betsInfo);

          this.record_betsResultInfoByDay = res.data.data.resultInfoByDay;

          this.record_betsResultInfoByDay = this.numArrary(
            res.data.data.resultInfoByDay
          );

          this.record_betsResultInfoByGame = this.numArrary(
            res.data.data.resultInfoByGame
          );
          this.barDate = this.dateArrary(res.data.data.resultInfoByDay);

          this.drawBarChart();
          this.drawPieChart();
        } else {
          this.userinfoRecords = [];
          this.itemCount = 0;
          this.showDetail = false;
        }
      });
    },
    getGameLabel(id) {
      let resLabel = "";
      this.getGameType.forEach(res => {
        if (id == res.gameTypeId) {
          resLabel = res.gameTypeName;
        }
      });
      return resLabel;
    },
    pieFormate(data) {
      let tempArray = [];
      data.forEach(ele => {
        tempArray.push({ value: ele.betsPercent, name: ele.gameType });
      });
      tempArray.forEach(element => {
        element.name = this.getGameLabel(element.name);
      });
      return tempArray;
    },
    numArrary(num) {
      let temp = [];
      num.forEach(element => {
        temp.push(element.netWin);
      });
      return temp;
    },
    dateArrary(date) {
      let temp = [];
      date.forEach(element => {
        temp.push(
          element.date
            .split(" ")[0]
            .split("-")
            .join("/")
        );
      });
      return temp;
    },
    drawBarChart() {
      let myChart1 = echarts.init(this.$refs.bar1_wrap);
      let myChart2 = echarts.init(this.$refs.bar2_wrap);

      var xAxisData = this.barDate;
      var data1 = this.record_betsResultInfoByDay;
      var data2 = this.record_betsResultInfoByGame;
      var chartText = [];

      this.resBarType.forEach(ele => {
        let typeName = "";
        typeName = this.getGameLabel(ele.gameType);
        chartText.push(typeName);
      });

      // this.getGameType.forEach(ele => {
      //   chartText.push(ele.gameTypeName);
      // });

      myChart1.setOption({
        toolbox: {
          show: false
        },
        color: ["#00665d"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          bottom: 90
        },
        dataZoom: [
          {
            type: "inside"
          },
          {
            type: "slider",
            backgroundColor: "#FF5809",
            fillerColor: "rgba(167,183,204,0.4)",
            dataBackground: {
              lineStyle: {
                color: "#fff",
                width: 2
              }
            },
            textStyle: {
              color: "#fff"
            }
          }
        ],
        xAxis: {
          data: xAxisData,
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#00ffbf"
            }
          }
        },
        yAxis: {
          splitArea: {
            show: false
          },
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#00ffbf"
            }
          }
        },
        series: [
          {
            type: "bar",
            data: data1,
            // Set `large` for large data amount
            large: true
          }
        ]
      });

      myChart2.setOption({
        grid: {
          left: "0%",
          bottom: "3%",
          width: "100%",
          containLabel: true
        },
        legend: {
          show: false
        },
        toolbox: {
          show: false
        },
        color: ["#00665d"],
        tooltip: {},
        xAxis: {
          data: chartText,
          silent: false,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#00ffbf"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#00ffbf"
            }
          }
        },
        series: [
          {
            name: "bar",
            type: "bar",
            data: data2,
            animationDelay: function(idx) {
              return idx * 10;
            }
          }
        ],
        animationEasing: "elasticOut",
        animationDelayUpdate: function(idx) {
          return idx * 5;
        }
      });
    },
    drawPieChart() {
      let myChart3 = echarts.init(this.$refs.pie_wrap);

      var chartText = [];
      this.getGameType.forEach(ele => {
        chartText.push(ele.gameTypeName);
      });
      // 绘制图表
      myChart3.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#00665D", "#00B3A4", "#00F2DE", "#46FCCE"],
        legend: {
          orient: "vertical",
          left: "left",
          data: chartText,
          textStyle: {
            //图例文字的样式
            color: "rgba(160, 160, 160, 0.8)",
            fontSize: 14
          }
        },
        series: [
          {
            name: "详细数据",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.record_betsInfo,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
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
.PlayerDetail {
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
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
.searchBtn {
  margin-top: 20px;
  padding: 15px 50px;
}
.accountCard {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-left: 15px;
}

.accountCard span:first-child {
  font-size: 22px;
  font-weight: 700;
}
.accountCard span:last-child {
  font-size: 12px;
  font-weight: 300;
  margin-top: 5px;
}

.stateOnline {
  color: #00ffbf;
}
.stateOffline {
  color: #ff9eae;
}
/* _------------------------------ */

.UserInfoPage {
  background-color: rgba(46, 46, 46, 0.7);
  border: 2px solid #4c4c4c;
  border-radius: 5px;
  color: aliceblue;
  margin-top: 30px;
}
.fa-user-circle {
  color: #ff5809;
  font-size: 48px;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.623);
  border: 3px double #4c4c4c;
  border-radius: 50%;
  padding: 5px;
}
.rowSize {
  width: 100%;
  margin: 0 auto !important;
}
.infoBox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
}
.boxTitle {
  color: #8d8d8d;
  padding-right: 15px;
}
.editIcon {
  background-color: rgba(0, 255, 191, 0.3);
  color: aliceblue;
  font-size: 18px;
}
.editIcon:hover {
  box-shadow: 0 0 8px rgba(180, 255, 249, 0.884);
  text-shadow: 0 0 8px rgba(243, 205, 5, 0.884);
}
.inputList {
  margin: 20px 0;
}
.inputList p {
  margin: 10px 0;
  color: aliceblue;
}
.cancelBtn {
  background: linear-gradient(#5a5a5a, 70%, #444444);
  border: 1px solid rgb(0, 0, 0);
  color: aliceblue;
  font-weight: 700;
}
.sureBtn {
  background: linear-gradient(#20b2aa, 30%, #00665d);
  border: 1px solid rgb(0, 0, 0);
  color: aliceblue;
  font-weight: 700;
}
.smCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 65%;
  padding: 20px 0;
  border: 3px double #00665d;
  background-color: #00665e25;
}
.smCard .boxTitle {
  text-align: center;
  padding: 0;
  margin-bottom: 10px;
  color: #00ffbf;
}
.icon-btn {
  cursor: pointer;
  margin: 0 15px;
  color: aliceblue;
}
.text_size {
  text-align: justify;
}

.infoBoxText {
  font-size: 14px;
  letter-spacing: 2px;
  color: #ccc;
  text-align: center;
}

.chartBox {
  margin-top: 50px;
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.chartBox2 {
  margin: 10px;
  margin-top: 30px;
}
.card__title2 {
  font-size: 18px;
  color: #00ffbf;
  line-height: 24px;
  letter-spacing: 5px;
  background-color: #434343;
  padding: 10px;
  width: 100%;
  text-align: center;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  margin-bottom: 20px;
}
.chartSize {
  width: 90%;
  overflow-x: scroll;
  display: flex;
  justify-content: center;
}
#bar1 {
  width: 900px;
  height: 450px;
  padding: 10px;
}
#bar2 {
  width: 500px;
  height: 480px;
}
#pie {
  /* width: 640px; */
  width: 500px;
  height: 480px;
}
.colSize2 {
  padding: 0 !important;
}

@media screen and (max-width: 991px) {
  .smCard {
    width: 85%;
  }
  .infoBox_Ln {
    flex-direction: column;
  }
  .text_size {
    padding: 10px 0;
    line-height: 25px;
  }
}

@media screen and (max-width: 768px) {
  .chartSize {
    justify-content: flex-start;
  }
}

@media screen and (max-width: 414px) {
  .table-row {
    padding: 10px;
  }
  .PlayerDetail {
    padding: 20px;
  }
  .smCard {
    width: 100%;
  }
  .UserInfo {
    padding: 20px;
  }
  .boxTitle {
    padding: 0px;
    margin: 10px 0;
  }
  .chartBox2 {
    margin: 0;
    margin-top: 20px;
  }
}
</style>
