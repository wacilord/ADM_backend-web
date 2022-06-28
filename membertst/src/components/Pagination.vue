
<template>
  <div class="Pagination">
    <!-- <el-button plain :disabled="closeDisabled" @click="turnPageOne" class="pageBtn">第一页</el-button> -->
    <el-button plain @click="prev" class="pageBtn">上一页</el-button>
    <div class="pageBox">
      <span class="currentPage">{{ pageIndex }}</span>
      <span>/</span>
      <span class="totalPage">{{ pageCount }}</span>
    </div>
    <el-button plain @click="next" class="pageBtn">下一页</el-button>
    <!-- <el-button plain :disabled="openDisabled" @click="turnPageFinal" class="pageBtn">最末页</el-button> -->
  </div>
</template>

<script>
export default {
  name: "Pagination",
  data() {
    return {
      closeDisabled: false,
      openDisabled: true,
      selectedIndex: 1,
      histoyIndex_old: 1,
      histoyIndex_new: 1,
      stopNextClick: false,
      stopPreClick: true
    };
  },
  props: ["pageSize", "pageIndex", "pageCount", "itemCount", "endQuery"],
  mounted() {
    // if (sessionStorage.getItem("reload") !== null) {
    //   this.selectedIndex = parseInt(sessionStorage.getItem("reRolad"));
    // }
    this.setPage(this.pageIndex);
    // console.log("掛載分頁DOM");
  },
  methods: {
    prev() {
      // 上一页按钮
      if (!this.endQuery) return;
      if (this.selectedIndex > 1) this.selectedIndex--;
      this.$emit("clickPage", { pageIndex: this.selectedIndex, p: 1 });
    },
    next() {
      // 下一页按钮
      if (!this.endQuery) return;
      if (this.selectedIndex < this.pageCount) this.selectedIndex++;
      this.$emit("clickPage", { pageIndex: this.selectedIndex });
    },
    setPage(n) {
      this.selectedIndex = n;
    }
  },
  watch: {
    pageIndex: function(n, o) {
      // this.selectedIndex = n;
      // console.log(n);
      // console.log("WATCH~");
      this.setPage(n);
    }
  }
};
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  font-family: arial, "Microsoft JhengHei", "微軟正黑體", sans-serif !important;
}
.Pagination {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
.pageBox {
  padding: 10px 20px;
  background-color: rgba(131, 131, 131, 0.58);
  color: #fff;
}
.pageBtn {
  margin: 0;
  border-radius: 0px;
  border-color: #2e2e2e !important;
  background-color: #434343 !important;
  color: #00ffbf !important;
}
.Pagination .pageBtn:nth-child(1) {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.Pagination .pageBtn:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
@media screen and (max-width: 414px) {
  .pageBtn {
    padding: 5px;
  }
  .Pagination .pageBtn:nth-child(1) {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .Pagination .pageBtn:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .pageBox {
    padding: 10px;
  }
  .Pagination {
    justify-content: center;
  }
}
</style>
