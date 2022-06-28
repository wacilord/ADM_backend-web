import axios from "axios";

class SelectLineService {
  isFinish = false;
  location = "";
  finishJob = null;
  totalRequest = 0;
  errorRequest = 0;
  lineInfoData = {};
  defaultLine = {};

  /**
   * 初始化
   */
  init() {
    this.isFinish = false;
    this.location = "";
    this.finishJob = null;
    this.totalRequest = 0;
    this.errorRequest = 0;
    this.lineInfoData = {};
    this.defaultLine = {};
  }
  /**
   * 設定結束後要做的事
   * @param {*} fn
   */
  setFinishJob(fn) {
    this.finishJob = fn;
  }
  /**
   * 設定選線檔路徑
   * @param {*} location
   */
  setConfigLocation(location) {
    this.location = location;
  }
  /**
   * 開始選線
   */
  startSelectLine() {
    this.getLineInfo();
  }
  /**
   * 取得選線資料檔
   */
  getLineInfo() {
    axios
      .get(this.location + "?" + Math.random(), {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 5000,
      })
      .then(res => {
        let lineInfo = res.data;
        this.lineInfoData = lineInfo;
        this.totalRequest = lineInfo.lines.length;
        this.defaultLine = lineInfo.lines[0];
        
        lineInfo.lines.forEach(lineData => {
          if (lineData.isOpen != undefined && lineData.isOpen == false) return;
          let fileLocation =
            lineData.location +
            "/" +
            lineInfo.info.lineFile +
            "?" +
            Math.random();
          this.downloadFile(fileLocation, lineInfo.info, lineData);
        });
      });
  }
  /**
   * 下載檔案
   * @param {*} fileLocation
   * @param {*} data
   */
  downloadFile(fileLocation, info, data) {
    axios({
      url: fileLocation,
      method: "GET",
      responseType: "blob" // important
    }).then(res => {
      if (!this.isFinish) {
        this.isFinish = true;
        if (this.finishJob) {
          // console.log("finishJob", info);
          this.finishJob(info, data);
        }
      }
    }).catch(reason => {
      // console.log("request", this.errorRequest, this.totalRequest)
      this.errorRequest += 1;
      if (this.errorRequest == this.totalRequest) {
        this.finishJob(this.lineInfoData, this.defaultLine);
      }
    });
  }
}

export default SelectLineService;
