import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import UserInfo from '@/components/UserInfo'
import MyDespatchData from '../components/MyDespatchData.vue'
import LoginLogList from '../components/LoginLogList.vue'
import MemberList from '../components/MemberList.vue'
import AgentList from '../components/AgentList.vue'
import WinLost from '../components/WinLost.vue'
import ReconciliationStatement from '../components/ReconciliationStatement.vue'
import GameReport from '../components/GameReport.vue'
import PlayerDailyTradeList from '../components/PlayerDailyTradeList.vue'
import SubAccountList from '../components/SubAccountList.vue'
import TransferList from '../components/TransferList.vue'
import PlayerDetail from '../components/PlayerDetail.vue'
import GameDetail from '../components/GameDetail.vue'
import AddAgent from '../components/AddAgent.vue'
import AddSubAccount from '../components/AddSubAccount.vue'
import DetailPlayerList from '../components/DetailPlayerList.vue'
import DetailSubAccount from '../components/DetailSubAccount.vue'
import DetailAgent from '../components/DetailAgent.vue'
import Hello from '../components/Hello.vue'
import FirstPassword from '../components/FirstPassword.vue'
import AddManager from '../components/AddManager.vue'
import ManagerList from '../components/ManagerList.vue'
import AccountWinLost from '../components/AccountWinLost.vue'
import DetailManager from '../components/DetailManager.vue'
import AddAgentByMerchant from '../components/AddAgentByMerchant.vue'
import AgentListByManagerID from '../components/AgentListByManagerID.vue'
import DetailAgentByMerchant from '../components/DetailAgentByMerchant.vue'
import JackpotAgentReport from '../components/JackpotAgentReport.vue'
import Summarycomreport from '../components/Summarycomreport.vue'



Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history',//去除網址列#號
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/UserInfo',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/MyDespatchData',
      name: 'MyDespatchData',
      component: MyDespatchData
    },
    {
      path: '/LoginLogList',
      name: 'LoginLogList',
      component: LoginLogList
    },
    {
      path: '/MemberList',
      name: 'MemberList',
      component: MemberList
    },
    {
      path: '/AgentList',
      name: 'AgentList',
      component: AgentList
    },
    {
      path: '/WinLost',
      name: 'WinLost',
      component: WinLost
    },
    {
      path: '/ReconciliationStatement',
      name: 'ReconciliationStatement',
      component: ReconciliationStatement
    },
    {
      path: '/GameReport',
      name: 'GameReport',
      component: GameReport
    },
    {
      path: '/PlayerDailyTradeList',
      name: 'PlayerDailyTradeList',
      component: PlayerDailyTradeList
    },
    {
      path: '/SubAccountList',
      name: 'SubAccountList',
      component: SubAccountList
    },
    {
      path: '/TransferList',
      name: 'TransferList',
      component: TransferList
    },
    {
      path: '/PlayerDetail',
      name: 'PlayerDetail',
      component: PlayerDetail
    },
    {
      path: '/GameDetail',
      name: 'GameDetail',
      component: GameDetail
    },
    {
      path: '/AddAgent',
      name: 'AddAgent',
      component: AddAgent
    },
    {
      path: '/AddSubAccount',
      name: 'AddSubAccount',
      component: AddSubAccount
    },
    {
      path: '/DetailPlayerList',
      name: 'DetailPlayerList',
      component: DetailPlayerList
    },
    {
      path: '/DetailSubAccount',
      name: 'DetailSubAccount',
      component: DetailSubAccount
    },
    {
      path: '/DetailAgent',
      name: 'DetailAgent',
      component: DetailAgent
    },
    {
      path: '/FirstPassword',
      name: 'FirstPassword',
      component: FirstPassword
    },
    {
      path: '/AddManager',
      name: 'AddManager',
      component: AddManager
    },
    {
      path: '/ManagerList',
      name: 'ManagerList',
      component: ManagerList
    },
    {
      path: '/AccountWinLost',
      name: 'AccountWinLost',
      component: AccountWinLost
    },
    {
      path: '/DetailManager',
      name: 'DetailManager',
      component: DetailManager
    },
    {
      path: '/AddAgentByMerchant',
      name: 'AddAgentByMerchant',
      component: AddAgentByMerchant
    },
    {
      path: '/AgentListByManagerID',
      name: 'AgentListByManagerID',
      component: AgentListByManagerID
    },
    {
      path: '/DetailAgentByMerchant',
      name: 'DetailAgentByMerchant',
      component: DetailAgentByMerchant
    },
    {
      path: '/JackpotAgentReport',
      name: 'JackpotAgentReport',
      component: JackpotAgentReport
    },
    {
      path: '/Summarycomreport',
      name: 'Summarycomreport',
      component: Summarycomreport
    },
  ]
})
