/**
 * Created by lanjiangweb on 2017/6/23.
 */
const listen= resolve => require(['../../component/asker/listen.vue'], resolve)
module.exports = {
    path: vueRoutesBaseUrl+'/asker/listen',
    component: listen,
    meta: { keepAlive: true }

}