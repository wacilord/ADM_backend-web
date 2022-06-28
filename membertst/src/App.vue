<template>
  <div id="app">
    <app-navbar v-if="showNav == 0"></app-navbar>
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppNavbar from "@/components/AppNavbar";

export default {
  name: "App",
  components: {
    "app-navbar": AppNavbar
  },
  computed: {
    ...mapState(["showNav"])
  },
  mounted() {
    if (
      sessionStorage["accountID"] == null &&
      sessionStorage["token"] == null
    ) {
      this.$router.push({ path: "/Login" });
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box !important;
  user-select: text;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
  /* 消除手機端高光藍底 */
}

.chartSize::-webkit-scrollbar {
  width: 10px !important;
  height: 5px !important;
}

.chartSize::-m-scrollbar {
  width: 10px !important;
  height: 5px !important;
}
.chartSize::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.2);
}

html,
body {
  width: 100vw !important;
  /* background-image: url("../static/bodyBackgroundImage/bg.png"); */
  font-family: arial, "Microsoft JhengHei", "微軟正黑體", sans-serif !important;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-color: #242424;
}
a,
a:visited {
  text-decoration: none;
  color: black;
  -webkit-tap-highlight-color: transparent;
  /* 消除手機端高光藍底 */
}

ul,
li {
  list-style: none;
}
/* AppNavbar  CSS-setting */
.el-submenu__title:hover {
  background-color: rgba(0, 102, 93, 0.4) !important;
}
/* UserInfo CSS-setting */
.el-dialog__header {
  background-color: #434343;
}
.el-dialog__title {
  color: #00ffbf !important;
  font-weight: 700;
}
.el-dialog {
  border-radius: 5px !important;
  border: 2px solid #4c4c4c !important;
  background-color: #303030e8 !important;
}
.el-select .el-input__inner:focus {
  border-color: transparent !important;
}
.el-input__inner {
  box-shadow: none !important;
}
.el-input__inner {
  background-color: #242424 !important;
  border-color: #4c4c4c !important;
  color: #ccc !important;
}
.el-input__inner:hover {
  background-color: #a0f8a23a !important;
  border: 3px double #04a033 !important;
  color: white;
}
.el-input__inner:focus {
  border-color: #5fc260 !important;
  box-shadow: 0 0 3px #5fc260 !important;
}
.el-select-dropdown__list {
  background-color: #242424;
}
.el-select-dropdown {
  border: none !important;
}
.el-select:focus {
  border-color: #5fc260 !important;
  box-shadow: 0 0 3px #5fc260 !important;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #5fc260 !important;
}

/* date time picker CSS-setting */
.el-picker-panel {
  background-color: #242424 !important;
  border-color: #00665d !important;
  border: 2px solid #00665d !important;
}
.el-picker-panel__footer {
  background-color: #242424 !important;
  border: none !important;
}
.el-date-picker__time-header {
  border: none !important;
}
.el-date-table td {
  text-align: center !important;
}
.el-date-table td.today span {
  color: #00ffbf !important;
}
.el-date-table td.available:hover {
  color: #00ffbf !important;
}
.el-button--text,
.el-date-picker__header-label,
.el-picker-panel__icon-btn {
  color: #00bdad !important;
}
.el-date-table th {
  border-bottom: solid 1px #00665d !important;
}
.el-button--text:hover,
.el-date-picker__header-label:hover,
.el-picker-panel__icon-btn:hover {
  color: #00ffbf !important;
}
.el-picker-panel__link-btn:last-child,
.el-picker-panel__link-btn:last-child:hover {
  /* 时间选择器确定按钮 */
  background: linear-gradient(#20b2aa, 30%, #00665d) !important;
  border: 1px solid black !important;
  color: aliceblue !important;
}
.el-date-table td.current:not(.disabled) span {
  background-color: #00665d !important;
}
.el-time-spinner__item.active:not(.disabled) {
  /* 选中的时间样式 */
  color: #f5f7fa !important;
  background-color: #00665d !important;
  margin-top: -8px !important;
}
.el-time-spinner__item:hover:not(.disabled):not(.active) {
  background: #00665e44 !important;
}
.el-time-panel {
  background-color: #242424 !important;
  border: 2px solid #00665d !important;
}
.el-time-panel__footer {
  border: none !important;
}
.cancel {
  color: rgba(245, 247, 250, 0.562) !important;
}
.el-time-panel__btn.confirm {
  color: #00ffbf !important;
}
/* checkbox CSS-setting */
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #00665d !important;
  border-color: #00665d !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00ffbf !important;
}
/* textarea CSS-setting */
.el-textarea__inner {
  background-color: #242424 !important;
  border-color: #4c4c4c !important;
  color: #ccc !important;
}
.el-textarea__inner:focus {
  border-color: #5fc260 !important;
  box-shadow: 0 0 3px #5fc260 !important;
}
.el-textarea__inner:hover {
  background-color: #a0f8a23a !important;
  border: 3px double #04a033 !important;
  color: white !important;
}

/* 时间选择器  年月类型 */
.el-date-picker__header--bordered {
  border-color: #00665d !important;
}
.el-month-table td.today .cell {
  color: #00ffbf !important;
}
.el-month-table td .cell:hover {
  color: white !important;
  background-color: #00665d !important;
}
.el-year-table td .cell:hover,
.el-year-table td.current:not(.disabled) .cell {
  color: #00ffbf !important;
}

.el-year-table td.disabled .cell,
.el-month-table td.disabled .cell {
  background-color: transparent !important;
  color: #606266 !important;
}

.el-year-table td.today .cell {
  color: #00ffbf !important;
}

/* input CSS-setting 禁用类型 */
.el-input.is-disabled .el-input__inner {
  background-color: #00665d !important;
  color: white !important;
  border: 2px dotted #242424 !important;
}

/* 面包屑组件 CSS */
.el-breadcrumb__inner.is-link {
  color: #00ffbfa8 !important;
  margin: 20px 0 !important;
}
.el-breadcrumb__inner.is-link:hover {
  color: #00ffbf !important;
}
.el-breadcrumb__inner {
  color: #c0c4cc !important;
}

/* table CSS-setting */
table {
  color: white !important;
  background-color: #242424 !important;
}

td {
  /* table 表格 */
  text-align: center !important;
}

tr {
  background-color: #24645e3b !important;
}
.el-table th,
.el-table tr {
  background-color: rgba(36, 100, 94, 0.22);
}

.el-table__body tr.hover-row > td {
  background-color: #003834;
  color: #00ffbf;
  text-shadow: 0 0 5px white;
}

thead th {
  /* table 表头 */
  text-align: center !important;
  background-color: #00665d !important;
  color: white !important;
}

.el-table th {
  display: table-cell !important;
}

/* 带消息的messageBox */
.cancelBtn,
.cancelBtn:hover {
  background: linear-gradient(#5a5a5a, 70%, #444444) !important;
  border: 1px solid rgb(0, 0, 0) !important;
  color: aliceblue !important;
  font-weight: 700 !important;
}
.sureBtn,
.sureBtn:hover,
.sureBtn:focus {
  background: linear-gradient(#20b2aa, 30%, #00665d) !important;
  background: -ms-linear-gradient(#20b2aa, #00665d);
  border: 1px solid rgb(0, 0, 0) !important;
  color: aliceblue !important;
  font-weight: 700;
}
.el-message-box {
  background-color: #242424 !important;
  border-color: #434343 !important;
}
.el-message-box__title {
  color: white !important;
}
.el-message-box__content {
  color: white !important;
}

.el-table__empty-block {
  background-color: rgba(0, 102, 90, 0.62);
  background-color: #00665ea1 !important;
}
.el-table__empty-text {
  color: #00665d !important;
  font-size: 18px;
  font-weight: 900;
}

/* tabs */

.el-tabs--border-card > .el-tabs__header {
  background-color: #434343 !important;
  border-bottom: 1px solid #434343 !important;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #00665d !important;
  color: #fff !important;
  border: none !important;
}
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #00ffbf !important;
  background-color: #00665e75 !important;
}

.el-checkbox__label {
  color: rgba(255, 255, 255, 0.726) !important;
}

.el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: none !important;
}

.el-dialog__headerbtn .el-dialog__close {
  display: none !important;
}
.el-table__fixed {
  height: 100% !important;
}

.el-date-table td.disabled div {
  background-color: #242424;
  color: rgb(71, 71, 71);
}

.el-loading-spinner .el-loading-text,
.el-loading-spinner i {
  color: #00ffbf !important;
}

/* 各component CSS */
.editIcon:hover {
  box-shadow: 0 0 8px rgba(180, 255, 249, 0.884) !important;
  text-shadow: 0 0 3px rgba(243, 205, 5, 0.884) !important;
  background-color: rgba(0, 255, 191, 0.3) !important;
  color: aliceblue !important;
  font-size: 18px;
}

.el-form-item__label {
  color: #ccc !important;
}

.el-dialog--center {
  width: 35% !important;
}

.el-form-item__content {
  line-height: 25px !important;
}

.dailyTradeInput {
  display: flex;
}
.dailyTradeInput .el-form-item__content {
  width: 80% !important;
}
.dailyDate .el-form-item__content {
  display: flex;
}

.el-tag.el-tag--info {
  background-color: #00665d;
  border-color: #00ffbf;
  color: #00ffbf;
}
.tempSize .el-input__inner {
  width: 100% !important;
}
.el-tag.el-tag--info .el-tag__close {
  color: #00ffbf;
}
.el-select .el-tag__close.el-icon-close {
  background-color: #012c29;
}
.el-tag.el-tag--info .el-tag__close:hover {
  background-color: #2d5351;
}

/* 时间选择器只到小时 */
.el-time-spinner__wrapper {
  width: 100%;
}

.el-select-dropdown__empty {
  color: #00ffbf;
  background-color: #3f3f3f;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #00665d;
  background: #00665d;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #00ffbf;
}

.el-select-dropdown__item.selected {
  color: #00ffbf;
  background-color: #00665d;
}

.el-select-dropdown__item.hover {
  background-color: #005853d5;
  color: #fff;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #009c6d41;
}

@media screen and (max-width: 991px) {
  .el-dialog--center {
    width: 60% !important;
  }
}

@media screen and (max-width: 768px) {
  .dailyTradeInput .el-form-item__content {
    width: 100% !important;
  }
  .dailyTradeInput {
    display: inline-block;
    width: 100%;
  }
  .dailyDate .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .dailyDate .el-form-item__content {
    display: inline-block;
    width: 100%;
  }
}
@media screen and (max-width: 414px) {
  .el-form-item__content {
    margin: 0 !important;
  }
  .el-form-item {
    display: flex !important;
    flex-direction: column !important;
  }
  .el-form-item__label {
    text-align: left !important;
  }
  .el-form-item__content {
    width: 100% !important;
  }
  .el-card__body {
    padding: 5px !important;
  }
  .el-breadcrumb__item {
    padding: 5px 0 !important;
  }
  .el-dialog--center {
    width: 85% !important;
  }
}
</style>
