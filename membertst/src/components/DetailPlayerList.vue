
<template>
  <div class="DetailPlayerList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/MemberList' }">会员清单</el-breadcrumb-item>
      <el-breadcrumb-item>会员明细( {{ queryParameters.accountID }} )</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title1">会员明细</span>
        </el-row>
      </el-row>
    </el-container>

    <div>
      <el-card class="UserInfoPage">
        <el-row :gutter="24" class="rowSize">
          <!-- Row1 使用者头像ICON -->
          <el-col :md="24">
            <div class="infoBox">
              <i class="fas fa-user-circle"></i>
              <div class="accountCard">
                <span>{{ queryParameters.accountID }}</span>
                <span
                  :class="{'stateOnline':isOnline,'stateOffline':!isOnline}"
                >{{ isOnline?"在线":"离线"}}</span>
              </div>
            </div>
          </el-col>
          <!-- Row2  -->
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <div class="leftBox">
                <span class="boxTitle">帐户创建日期</span>
              </div>
              <div class="rightBox">
                <span class="text_size">{{ userinfoRecords.createDateTime | dateTimeFormat }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <div class="leftBox">
                <span class="boxTitle">加入至今</span>
              </div>
              <div class="rightBox">
                <span class="text_size">{{ userinfoRecords.createTotalDay }} 天</span>
              </div>
            </div>
          </el-col>
          <!-- Row3  -->
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <div class="leftBox">
                <span class="boxTitle">组织层级</span>
              </div>
              <div class="rightBox">
                <span class="text_size">{{ getOrgTreeString }}</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <div class="infoBox infoBox_Ln">
              <div class="leftBox">
                <span class="boxTitle">最近上线</span>
              </div>
              <div class="rightBox">
                <span class="text_size">{{ userinfoRecords.lastOnlineTime | dateTimeFormat }}</span>
              </div>
            </div>
          </el-col>
          <!-- Row4 会员资料 -->
          <el-col :xs="24" :sm="12" :md="12">
            <div class="infoBox">
              <div class="smCard">
                <h3 class="boxTitle">总点数</h3>
                <span>{{ userinfoRecords.point | commaFormat}}</span>
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
                <span>{{ userinfoRecords.historyBets | commaFormat}}</span>
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
    </div>

    <el-row :gutter="20" style="margin:0;" class="rowSize">
      <el-col :xs="24" :sm="24" class="colSize">
        <div class="chartBox">
          <div class="card__title">
            <p>每日盈利统计</p>
          </div>
          <div class="chartSize">
            <div id="bar1" ref="bar1_wrap"></div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" class="colSize">
        <div class="chartBox chartBox2 chartBoxMargin">
          <div class="card__title">
            <p>游戏类别盈利</p>
          </div>
          <div class="chartSize">
            <div id="bar2" ref="bar2_wrap"></div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" class="colSize">
        <div class="chartBox chartBox2">
          <div class="card__title">
            <p>投注比例统计</p>
          </div>
          <div class="chartSize">
            <div id="pie" ref="pie_wrap"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { backendapiService } from "../service/backendapiService.js";

import echarts from "echarts";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import { codeTransferName } from "../lang/searchCode";
import { mapGetters } from "vuex";

export default {
  name: "DetailPlayerList",
  mounted() {
    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "playerlist")) {
        return;
      }
    }
    this.$store.state.showNav = 0;
    this.queryParameters.accountID = this.getQueryUser[0].userId;
    this.queryParameters.playerGuid = this.getQueryUser[0].guid;

    // this.queryParameters.accountID = this.$route.params.accountID;

    let tempGameType = JSON.parse(sessionStorage.getItem("dbGameType"));
    tempGameType.sort();
    tempGameType.forEach((element, index) => {
      this.getGameType.push({
        gameTypeId: element,
        gameTypeName: codeTransferName.transGameTypeName(element)
      });
    });
    this.startQueryForList();
  },
  data() {
    return {
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
      resBarType: []
    };
  },
  computed: {
    ...mapGetters(["getQueryUser"]),
    getOrgTreeString() {
      if (!this.orgTree) {
        return "";
      }
      return this.orgTree.join(" > ");
    }
  },
  methods: {
    startQueryForList() {
      this.query();
    },
    query() {
      backendapiService.playerdetail(this.queryParameters).then(res => {
        if (res.data.statusCode == 200) {
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
        }
      });
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
.DetailPlayerList {
  padding: 30px;
  min-height: 100vh;
  color: aliceblue;
}
.row-list {
  display: flex;
  justify-content: center;
}
.card__title1 {
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

.card__title {
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

.colSize {
  padding: 0 !important;
}

#bar1 {
  width: 991px;
  height: 450px;
  padding: 10px;
}
#bar2 {
  width: 500px;
  height: 480px;
}
#pie {
  width: 640px;
  height: 480px;
}

.leftBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 120px;
  text-align: center;
}
.rightBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 120px);
}

.infoBoxText {
  font-size: 14px;
  letter-spacing: 2px;
  color: #ccc;
  text-align: center;
}
@media screen and (max-width: 1046px) {
  .rightBox {
    height: 100px;
  }
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
  .leftBox {
    justify-content: center;
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
  .DetailPlayerList {
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
