<template >
    <div style="height: 100%" class="ask_my_income_list wbg">

        <div v-title class='hide_title'>余额明细</div>
        <v-showLoad v-if="showLoad"></v-showLoad>
        <v-scroll :on-refresh="onRefresh" :isNotRefresh="true" :on-infinite="onInfinite" :isPageEnd="isPageEnd"
                  :bottomHeight="0"
                  :isShowMoreText="isShowMoreText">
            <ul>
                <li class="moneyOut_item" v-for="item in list">
                    <div class="time">
                        <span>{{getDateTime(item.addTime)}}</span>
                    </div>
                    <div class="item_type">{{item.type}}</div>
                    <div class="item_right" :class="{moneyOut_color:item.amount<0}">
                        <span v-if="item.status==0">审核中</span>
                        <template v-if=" item.amount>0">+￥</template><template v-if=" item.amount<0">-￥</template>{{Math.abs(item.amount)}}
                    </div>
                </li>
            </ul>
        </v-scroll>


    </div>
</template>

<script type="es6">

    import showLoad from '../../include/showLoad.vue';
    import scroll from '../../include/scroll.vue';
    import Bus from '../../bus.js';

    export default {
        data() {
            return {
                page: 1,
                row: 15,
                isPageEnd: false,
                isShowMoreText:true,
                showLoad:false,
                list:[]
            }
        },

        components: {
            'v-showLoad': showLoad,
            'v-scroll': scroll
        },
        activated: function () {
            if(!xqzs.user.isUserLogin()){
                return ;
            }
            this.isPageEnd=false;
            this.page=1;
            this.list=[];
            this.isShowMoreText=false;
            this.getList();
            xqzs.wx.setConfig(this, function () {weshare.init(wx)});
        },
        methods:{
            formatPrice:function (price) {
                return xqzs.string.formatPrice(price)
            },
            formatTime:function (time) {
                return xqzs.dateTime.formatDateTime(time);
            },
            getList: function (done) {

                let vm= this;
               // let url =web.API_PATH + 'come/user/query/income/page/_userId_/'+vm.page+'/'+vm.row;
                let url =  'user/withdraw/detail' + '/_userId_/' + vm.row+ '/' + vm.page;
                this.rankUrl = url + "?";
                if (web.guest) {
                    this.rankUrl = this.rankUrl + "guest=true"
                }
                if (vm.isLoading || vm.isPageEnd) {
                    if (done && typeof(done) === 'function') {
                        done()
                    }
                    return;
                }

                if (vm.page == 1) {
                    vm.showLoad = true;
                }

                vm.isLoading = true;
                xqzs.api.get(vm,vm.rankUrl,function (response) {
                    if(done&&typeof(done)==='function'){
                        done()
                    }
                    vm.showLoad = false;
                    vm.isLoading = false;

                    if(response.data.status!=1&&vm.page==1){
                        vm.list = [];
                        vm.isPageEnd = true;
                        vm.isShowMoreText = false;

                        return;
                    }
                    let arr = response.data.data;
                    if (arr.length < vm.row) {
                        vm.isPageEnd = true;
                        vm.isShowMoreText = false
                    }




                    if (vm.page == 1) {
                        vm.list = arr;
                    } else {
                        vm.list = vm.list.concat(arr);
                    }
                    if (arr.length == 0) return;
                    vm.page = vm.page + 1;
                },function (error) {
                    vm.isLoading = false;
                    vm.showLoad = false;
                })
            },
            onInfinite(done) {
                this.getList(done);

            },
            getDateTime:function (t) {
                return xqzs.dateTime.formatDateTime(t);
            },
        }


    }
</script>
<style>
    .ask_my_income_list .moneyOut_item{
        height:0.98rem;
        line-height: 0.98rem;
        border-bottom: 0.02rem solid rgba(238,238,238,1);
        padding:0 0.30rem;
        display: flex;
    }
    .time{
        color:#999;
        font-size: 0.22rem;
        width:40%;
    }
    .item_right{
        font-size: 0.30rem;
        color:#FE7A03;
        width:40%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .moneyOut_color{
        color:#999;
    }
    .item_right span{
        font-size: 0.26rem;
        color:rgba(69,75,84,1);
        margin-right: 0.25rem;
        width:40%;
        float: left;
    }
    .item_type{
        margin: 0 auto;
        text-align: center;
        color:#999;
        font-size: 0.26rem;
        width:20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
