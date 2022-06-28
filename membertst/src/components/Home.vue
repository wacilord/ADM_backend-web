<template>
  <div class="Home">
    <el-row :gutter="20" style="margin:0;" class="rowSize">
      <el-col :xs="24" :sm="8" :md="8">
        <div class="infoBox">
          <i class="fas fa-donate bgIcon"></i>
          <span class="boxTitle">本日会员投注额</span>
          <span>{{ queryRecord.totalBets | commaFormat }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8">
        <div class="infoBox">
          <i class="fas fa-theater-masks bgIcon"></i>
          <span class="boxTitle">本日会员盈利</span>
          <span>{{ queryRecord.totalNetWin | commaFormat}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8">
        <div class="infoBox">
          <i class="fas fa-users bgIcon"></i>
          <span class="boxTitle">同时在线会员</span>
          <span>{{ queryRecord.onlineCount }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24">
        <div class="chartBox">
          <div class="card__title">
            <p>本日会员累计投注额</p>
          </div>
          <div class="chartSize">
            <div id="line" ref="line_wrap"></div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24">
        <div class="chartBox">
          <div class="card__title">
            <p>本日会员盈利统计表</p>
          </div>
          <div class="chartSize">
            <div id="bar" ref="bar_wrap"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import { backendapiService } from "../service/backendapiService.js";
import { mapGetters } from "vuex";


export default {
  name: "Home",
  data() {
    return {
      queryRecord: [],
      lineToday: [],
      lineYesterday: [],
      barRecord: [],
      drawLineChart_DataToday: [],
      drawLineChart_DataYesterday: [],
      drawBarChart_Data: [],
      queryParameters: {
        token: "",
      },
    };
  },
  computed: {
    ...mapGetters(["token"]),
    setValue() {
      return this.queryRecord;
    },
  },
  mounted() {
    if (
      sessionStorage["accountID"] == null &&
      sessionStorage["token"] == null
    ) {
      this.$router.push({ path: "/Login" });
      return;
    }

    if (sessionStorage.getItem("accountType") == 0) {
      if (!this.authUtil.isAuth(this, "summary")) {
        return;
      }
    }
    this.$store.state.showNav = 0;
    this.queryParameters.token = this.$store.getters.token;
    this.query();
  },
  methods: {
    drawLineChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = echarts.init(this.$refs.line_wrap);
      // 绘制图表
      myChart1.setOption({
        tooltip: {
          trigger: "axis",
        },
        // 线图颜色
        color: ["#34688F", "#F15838"],
        legend: {
          data: ["昨日", "今日"],
          textStyle: {
            //图例文字的样式
            color: "rgba(160, 160, 160, 0.8)",
            fontSize: 14,
          },
        },
        grid: {
          left: "3%",
          bottom: "3%",
          width: "100%",
          containLabel: true,
        },
        toolbox: {
          show: false,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "",
          ],
          axisLine: {
            lineStyle: {
              color: "#00ffbf",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#00ffbf",
            },
          },
        },
        series: [
          {
            name: "昨日",
            type: "line",
            stack: "昨日数据",
            data: this.drawLineChart_DataYesterday,
          },
          {
            name: "今日",
            type: "line",
            stack: "今日数据",
            data: this.drawLineChart_DataToday,
          },
        ],
      });
    },

    drawBarChart() {
      let myChart2 = echarts.init(this.$refs.bar_wrap);
      var xAxisData = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ];
      var data1 = this.drawBarChart_Data;

      myChart2.setOption({
        legend: {
          show: false,
        },
        toolbox: {
          show: false,
        },
        color: ["#00665d"],
        tooltip: {},
        xAxis: {
          data: xAxisData,
          silent: false,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#00ffbf",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#00ffbf",
            },
          },
        },
        series: [
          {
            name: "本日盈利",
            type: "bar",
            data: data1,
            animationDelay: function (idx) {
              return idx * 10;
            },
          },
        ],
        animationEasing: "elasticOut",
        animationDelayUpdate: function (idx) {
          return idx * 5;
        },
      });
    },
    query() {
      backendapiService.summary(this.queryParameters).then((res) => {
        if (res.data.statusCode === 200) {
          this.queryRecord = res.data.data;
          this.lineToday = res.data.data.betsList2;
          this.lineYesterday = res.data.data.betsList1;
          this.barRecord = res.data.data.resultList;

          this.drawLineChart_DataToday = this.numArrary(this.lineToday);
          this.drawLineChart_DataYesterday = this.numArrary(this.lineYesterday);
          this.drawBarChart_Data = this.numArrary(this.barRecord);

          this.drawLineChart();
          this.drawBarChart();
        }
      });
    },
    numArrary(num) {
      let temp = [];
      num.forEach((element) => {
        temp.push(element.point);
      });
      return temp;
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Home {
  color: #fff;
  padding: 50px;
  min-height: 100vh;
}
#line,
#bar {
  width: 991px;
  height: 450px;
  padding: 10px;
}
.rowSize {
  width: 100%;
  margin: 0 auto !important;
}
.infoBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
  padding: 30px 0;
  position: relative;
  overflow: hidden;
}
.boxTitle {
  padding: 5px 0;
  font-size: 20px;
  font-weight: 700;
}
.bgIcon {
  color: rgba(255, 255, 255, 0.1);
  font-size: 120px;
  position: absolute;
  right: -20px;
}
.chartBox {
  -ms-scrollbar-track-color: #1c1c1c;
  margin-top: 50px;
  border: 1px solid #4c4c4c;
  border-radius: 5px;
  background-color: rgba(46, 46, 46, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

@media screen and (max-width: 768px) {
  .infoBox {
    margin: 10px 0;
  }
  .Home {
    padding: 10px;
  }
  .chartSize {
    justify-content: flex-start;
  }
}
</style>
