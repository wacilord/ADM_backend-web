
<template>
  <div class="MyDespatchData">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="pageGuide">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/UserInfo' }">我的资料</el-breadcrumb-item>
      <el-breadcrumb-item>我的调度</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="app-myCard">
      <el-row class="rowSize">
        <el-row class="row-list card__header">
          <span class="card__title">我的调度</span>
        </el-row>
        <el-row class="card_txt">
          <p>所有报表均可在此汇出</p>
          <p>目前调度功能仅保留10笔，如有特殊需求请联系客服</p>
        </el-row>
      </el-row>
    </el-container>
    <el-table :data="tableData" border style="width: 100%" class="exportTable">
      <el-table-column prop="name" label="说明" min-width="150"></el-table-column>
      <el-table-column prop="date" label="请求时间" min-width="200"></el-table-column>
      <el-table-column fixed="right" label="文件下载" min-width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "MyDespatchData",
  mounted() {
    this.$store.state.showNav = true;
  },
  data() {
    return {
      tableData: [
        {
          name: "游戏记录",
          date: "2019-10-29 14:42:00"
        }
      ]
    };
  },
  methods: {
    handleClick(row) {
      // console.log(row);
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
.MyDespatchData {
  padding: 30px;
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
.card_txt {
  padding: 15px;
  text-align: justify;
  letter-spacing: 2px;
  line-height: 30px;
}
.exportTable {
  margin-top: 30px;
}
@media screen and (max-width: 414px) {
  .MyDespatchData {
    padding: 15px;
  }
}
</style>
