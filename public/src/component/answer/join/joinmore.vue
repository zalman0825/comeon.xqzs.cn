<template >
    <div class="joinmore_box">
        <div class="select_type" v-show="myask_mask_flag"  @click="hide_myask_mask()">
            <div class="myask_class myask_know_box" @click.stop>
                <h3>解答须知</h3>
                <ul style="overflow: auto;height: 3.48rem;;width:100%;">
                    <li><b>1.</b>提交问题，设置赏金支付后，心情指数将为您匹配专业咨询师开始抢答。
                        <p>（1）设置的赏金越高，匹配的咨询师等级越高，抢答的咨询师越多。</p>
                        <p>（2）问题描述越清楚，咨询师的回答将精准。</p>
                    </li>
                    <li><b>2.</b>你可以选择做佳答案：
                        <p>（1）该回答将产生偷偷听收入；</p>
                        <p>（2）其咨询师将获得全部赏金；</p>
                    </li>
                    <li><b>3.</b>48小时内无人抢答，则全额退款。</li>


                </ul>
                <div class="myask_class_true" @click="hide_myask_mask()">知道了</div>
            </div>
        </div>
        <div v-title class='hide_title'>入驻心理咨询师</div>
        <v-showLoad v-if="showLoad"></v-showLoad>
        <header>
            <div class="headerImg_box">
                <div class="headerImg" @click="changeHeadpic()">
                    <img v-if="faceUrl!=''" :src="faceUrl" style="height: 100%; width: 100%">
                </div>
                <img class="smallImg" src="http://oss.xqzs.cn/resources/psy/joinAddImg.png" alt="">
            </div>
            <p><span>*</span>(设置头像，请选择一个清晰，辨识度高的个人照片作为头像，以便在用户心中建立您的个人品牌。）</p>
        </header>
        <div class="title">
            <span>*</span>
            擅长领域 <i>(最多可选三个)</i>
        </div>
        <div class="title_bottom" @click="selectType()">
            <img v-if="classType.length<=0" class="addClass" src="http://oss.xqzs.cn/resources/psy/addClassTypeBg.png" alt="" @click="selectType()">
            <span class="class_style" v-if="classType" v-for="item in classType">{{item.title}}</span>
        </div>
        <div class="title">
            <span>*</span>
            从业资质 <i>（如果没有资质证书请选择其他）</i>
        </div>
        <div class="title_bottom">
            <span class="bottom_left">{{jobTitle}}</span>
            <span class="bottom_right" @click="goQualification()">编辑</span>
        </div>
        <div class="title">
            <span>*</span>
            自我介绍
        </div>
        <div class="title_bottom">
            <span class="bottom_left">{{introduction}}</span>
            <span class="bottom_right" @click="goPersonal()">编辑</span>
        </div>
        <div class="title">
            <span>*</span>
            一句话签名
        </div>
        <div class="title_bottom">
            <span class="bottom_left">{{sign}}</span>
            <span class="bottom_right" @click="goSign()">编辑</span>
        </div>
        <div class="title">
            <span>*</span>
            60秒语音寄语
        </div>
        <div class="title_bottom">
            <span class="bottom_left">
                 <div class="audio">
                    <div class="audio_btn" @click.stop="play()">
                        <template v-if="!playing&&!paused" >点击播放</template>
                        <template v-if="playing">正在播放..</template>
                        <template v-if="paused">播放暂停</template>
                        <div class="second">{{voiceLength}}”</div>
                    </div>

                    <div class="clear"></div>
                </div>
            </span>
            <span class="bottom_right" @click="goVoice()">编辑</span>
        </div>
        <div class="title">
            <span>*</span>
            解答设置
            <div class="need_know_box" @click="showMask()">
                <img src="http://oss.xqzs.cn/resources/psy/asker/need_know.png" alt="">
                解答须知
            </div>
        </div>
        <div class="title_bottom">
            <div class="set_box setPrice_box">设置提问酬金
                <input type="" class="priceInput" @input="changePrice()" :value="'￥'+price">
            </div>
            <div class="set_box"  @click="selectFreeTime()">设置限时免费听时间
                <input type="" readonly  :value="freeTimeText">
            </div>
        </div>
        <div   class="subBtn_nor  subBtn_per"   @click="sub_more()">提交</div>

        <div id="select_type" class="select_type" v-show="showTypes" @click="select_typeFlag()">
            <div class="dialog_select_type">
                <div class="select_title">选择问题类型</div>
                <div class="select_types">
                    <div class="item" :class="{on:item.isSelect}" v-for="(item,index) in types" @click.stop="select(index)"><span>{{item.title}}</span></div>
                </div>
                <div class="select_yes">
                    <div>取消</div>
                    <div @click="sureClass()">确定</div>
                </div>
            </div>
        </div>



    </div>
</template>

<script type="es6">
    import showLoad from '../../include/showLoad.vue';
    export default {
        data() {
            return {
                classType:[],
                showLoad:false,
                faceUrl:'',
                types:[],
                MAX_COUNT:3,
                showTypes:false,
                sign:'',
                price:10,
                times:[{
                    label: '不免费',
                    value: 0
                }, {
                    label: '30分钟',
                    value: 30
                }, {
                    label: '1小时',
                    value: 60
                },{
                    label: '2小时',
                    disabled: true,
                    value: 120
                }, {
                    label: '3小时',
                    value: 180
                },{
                    label: '4小时',
                    value: 240
                }],
                freeTime:null,
                freeTimeText:'',
                canGoNext:false,
                alioss:null,
                uploadpicinfo:null,
                introduction:'',
                jobTitle:'',
                ids:[],
                expertId:'',
                myask_mask_flag:false,
                voicePath:null,
                expertInfo:null,
                paused:false,
                playing:false,
                isEdit:false,
                user:{}


            }
        },
        activated: function () {
            this.isEdit=this.$route.query.edit;
            this.$http.get(web.API_PATH+'come/expert/query/detail/by/userId/_userId_').then(function (data) {
                if(data.data.status==1&&data.data.data !=null){
                    let  expertId = data.data.data.id;
                    this.expertId = expertId;
                    cookie.set('expertId',expertId,300);
                    this.getGoodAt()
                    this.getClassList()
                    this.getUserInfo();
                }
            })

            this.initOss();
            let sign= (cookie.get("sign"));
            if(sign&&sign!=''){
                this.sign=unescape(sign)
            }

            xqzs.wx.setConfig(this);
        } ,
        methods:  {
            initOss:function () {
                this.uploadpicinfo = {
                    token: xqzs.string.guid(),
                    smallpic: xqzs.constant.PIC_SMALL,
                    middlepic: xqzs.constant.PIC_MIDDLE,
                    removepicurl: web.BASE_PATH + 'api/removepicture',
                    uploadbase64url: web.BASE_PATH + 'api/upfilebase64',
                    aliossgeturl: web.BASE_PATH + 'api/aliyunapi/oss_getsetting'
                };
                this.alioss = new aliyunoss({
                    url:this.uploadpicinfo.aliossgeturl,
                    token:this.uploadpicinfo.token
                });
            },
            getUserInfo:function () {
                let _this = this;
                //用户信息
                _this.showLoad = true;
                this.$http({
                    method: 'GET',
                    type: "json",
                    url: web.API_PATH + 'user/find/by/user/Id/_userId_',
                }).then(function (data) {//es5写法
                    _this.showLoad = false;
                    if (data.data.data !== null) {
                        _this.user = eval(data.data.data);
                        _this.getExpertByUserId();
                    }
                }, function (error) {
                    //error
                });
            },
            getExpertByUserId:function () {
                let _this=this;
                _this.showLoad = true
                _this.$http.get(web.API_PATH + 'come/expert/query/detail/for/edit/'+ _this.expertId+'/_userId_' ).then(function (data) {//es5写法
                    _this.showLoad = false;
                     _this.expertInfo=data.data.data;
                    console.log(data.data.data)
                    if (data.body.status == 1&&data.body.data!=null) {

                        _this.jobTitle = data.data.data.jobTitle||'必填';
                        _this.sign = data.data.data.sign||'必填';
                        _this.introduction = data.data.data.introduction||'必填';
                        _this.freeTime=data.data.data.freeTime;
                            for(let i =0;i<_this.times.length;i++){
                                if(_this.times[i].value== _this.freeTime){
                                    _this.freeTimeText= _this.times[i].label;
                                }
                            }
                      if(data.data.data.price>0)_this.price =data.data.data.price;
                        _this.faceUrl = data.data.data.faceUrl;
                        _this.voicePath=data.data.data.voicePath;
                        _this.voiceLength= data.data.data.voiceLength;
                        if(data.data.data.voiceDetail&& !_this.voicePath){
                            _this.voicePath =data.data.data.voiceDetail.path
                            _this.voiceLength= data.data.data.voiceDetail.length
                        }
                    }
                }, function (error) {
                });
            },
            changeHeadpic:function () {
                let _this=this;
                xqzs.image.showClip(this.uploadpicinfo,this.alioss,function(){
                    _this.showLoad=true;
                },function (json,ix) {
                    _this.showLoad=false;
                    _this.faceUrl=json.data.path;
                    cookie.set('faceUrl',_this.faceUrl)
                    xqzs.image.hideClip()
                });
            },
            selectType: function () {
                let _this=this;
                for (let i = 0,l=_this.types.length; i < l; i++) {
                    for (let j = 0, jl = _this.classType.length; j < jl; j++) {
                        if(_this.types[i].id == _this.classType[j].classId){
                            _this.types[i].isSelect = true;
                            _this.$set(_this.types, i, _this.types[i]);
                        }
                    }
                }
                _this.showTypes=true;

            },
            showMask:function () {
                this.myask_mask_flag = true
            },
            hide_myask_mask:function () {
                this.myask_mask_flag = false
            },
            getGoodAt:function () {
                let _this = this;
                _this.$http.get(web.API_PATH + 'come/expert/good/at/'+ _this.expertId ).then(function (data) {//es5写法
                    if (data.body.status == 1) {
                        _this.classType = data.data.data;
                        console.log( _this.classType)
                        for(let i = 0;i<_this.classType.length;i++){
                             _this.ids.push(_this.classType[i].classId)

                        }
                        console.log(_this.ids)
                    }
                }, function (error) {
                });
            },
            getClassList:function () {
                let _this=this;
                _this.$http.get(web.API_PATH + 'come/listen/question/class/list' ).then(function (data) {//es5写法
                    if (data.body.status == 1) {
                        _this.types= data.body.data;
                    }
                }, function (error) {
                });
            },
            select_typeFlag:function () {
              let _this = this;
              _this.showTypes = false
            },
            select:function (index) {
                let count = 0;
                let types = this.types;
                //
                if (types[index].isSelect) {
                    types[index].isSelect = false
                } else {
                    for (let i = 0; i < types.length; i++) {
                        if (types[i].isSelect) {
                            count++
                        }
                    }

                    if (count >= this.MAX_COUNT) {

                    } else {
                        types[index].isSelect = true
                    }
                }
                this.$set(this.types, index, types[index]);
                //
                console.log(this.classType);

            },
            sureClass:function () {
                var selectClassTypes = [];
                this.ids=[];
                for (let i = 0,l=this.types.length,_ci =0; i < l; i++) {
                    if (this.types[i].isSelect) {
                        selectClassTypes.push(this.types[i]);
                    }
                }
                this.classType = selectClassTypes;
                console.log( this.classType)
                for(let j=0;j<this.classType.length;j++){
                    console.log(this.classType[j].id)
                    this.ids.push(this.classType[j].id)
                }
                let _this = this;
                let msg = {
                    'userId':"_userId_",
                    'questionClassId':_this.ids,
                };
                let url = 'come/expert/register';
                if(_this.isEdit){
                    msg.userId= "_userId_";
                    msg.expertId=cookie.get('expertId');
                    if(_this.isEdit){
                        url = "come/expert/modify/domain";
                    }
                }else{
                    msg.id= _this.user.id;
                }

                _this.$http.post(web.API_PATH + url, msg)
                    .then(
                        (response) => {
                        }
                    );
            },
            changePrice:function () {
                let _this = this;
                let price= $(".priceInput").val()
                price=  price.replace('￥','');
                _this.price=price;
                cookie.set("priceChange",escape(price))
            },
            selectFreeTime:function () {
                let  data= this.times;
                let _this=this;


                let defaultValue = [ _this.freeTime]
                console.log(defaultValue)

                weui.picker(  data, {
                    id:"id"+Math.random(),
                    defaultValue: defaultValue,
                    onChange: function (result) {
                        console.log(result);
                    },
                    onConfirm: function (result) {
                        _this.freeTime = result[0].value;
                        _this.freeTimeText= result[0].label;
                        cookie.set('freeTimeTextChange',_this.freeTimeText)
                    },
                });
            },
            tip:function () {
                xqzs.weui.tip("认证中！")
            },
            goQualification:function () {
                if(this.expertInfo.certificateNoStatus===0&&this.isEdit){
                    this.tip();
                    return ;
                }
                this.$router.push('qualification')
            },
            goPersonal:function () {
                if((this.expertInfo.introductionStatus===0||this.expertInfo.goodatStatus===0||this.expertInfo.experienceStatus===0)&&this.isEdit){
                this.tip();
                return ;
            }
                this.$router.push('personal')
            },
            goSign:function () {
                if(this.expertInfo.signStatus===0&&this.isEdit){
                    this.tip();
                    return ;
                }
                this.$router.push('sign')
            },
            goVoice:function () {
                if(this.expertInfo.voiceMessageIdStatus===0&&this.isEdit){
                    this.tip();
                    return ;
                }
                this.$router.push('voice')
            },
            beforeDestroy:function () {
                xqzs.image.hideClip()
            },

            play:function () {
                let _this=this;

                xqzs.voice.onEnded=function () {
                   _this.paused=false;
                    _this.playing=false;

                };
                if(_this.paused){  //暂停中也就是已经获取到且为当前音频
                    _this.paused=false;
                    _this.playing=true;
                     xqzs.voice.play();
                }else{
                    if(_this.playing){    //播放中去做暂停操作
                        _this.paused=true;
                        _this.playing=false;
                         xqzs.voice.pause();
                    }else{     //重新打开播放
                        xqzs.voice.play(_this.voicePath);
                        _this.playing=true;
                        _this.paused=false;
                    }
                }
            },

            check_step:function (showTip) {

                let _this = this;
                let re=true;
                let tip = '';


                if(_this.classType.length==0){
                    re = false;
                    tip = "请选择擅长领域";
                }else if(_this.freeTimeText==''){
                    re = false;
                    tip = "请设置免费时间";
                }else if(_this.price<10){
                    re = false;
                    tip = "请设置提问酬金(大于等于10)";
                }else if(_this.jobTitle==''||_this.jobTitle=='必填'){
                    re = false;
                    tip = "请编辑从业资质";
                }else if(_this.introduction==''||_this.introduction=='必填'){
                    re = false;
                    tip = "请编辑自我介绍";
                }else if(_this.sign==''||_this.sign=='必填'){
                    re = false;
                    tip = "请编辑个性签名";
                }
                else if(_this.faceUrl==''){
                    re = false;
                    tip = "请上传个人头像";
                }

                if (showTip && !re) {
                    console.log(showTip)
                    xqzs.weui.tip(tip)
                }
                return re;


            },
            sub_more:function () {
                console.log('提交')
                let _this = this;
                if(!_this.check_step(true)){
                    return;
                }
                _this.showLoad=true;
                let msg = {
                    'userId':"_userId_",
                    "faceUrl":_this.faceUrl,
                    'price':_this.price,
                    'freeTime':_this.freeTime,
                    'questionClassId':_this.ids,
                    'finish':'yes'
                };

                let url = "come/expert/register";

                if(_this.isEdit){
                    msg.userId= "_userId_";
                    msg.expertId=cookie.get('expertId');
                    if(_this.isEdit){
                        url = "come/expert/modify";
                    }
                }else{
                    msg.id= _this.user.id;
                }
                console.log(msg);
                _this.$http.post(web.API_PATH + url, msg)
                    .then(
                        (response) => {
                            console.log(response)
                            _this.showLoad = false
                            if(response.data.status==9000006){
                                xqzs.weui.tip("您已经提交过审核",function () {
                                    _this.$router.go(-1)
                                })
                            }else if(response.data.status==1){
                                xqzs.weui.tip("资料提交成功",function () {
                                    if(_this.isEdit){
                                        _this.$router.go(-1)
                                    }else{
                                        _this.$router.replace("./reviewing")
                                    }

                                })

                            }

                        }
                    );

            }

        },
        components: {
            'v-showLoad': showLoad,
        }

    }
</script>
<style>
    .joinmore_box{background: #fff;}
    .joinmore_box header{background: rgba(36,37,61,0.3);height: 4.00rem;padding: 0 0.30rem;color:#fff;font-size: 0.26rem;position: relative}
    .joinmore_box header span{color:rgba(255,0,0,1)}
    .joinmore_box header p{position: absolute;bottom:0.40rem;}
    .joinmore_box header .headerImg_box{width:1.75rem;height:1.75rem;background: #fff;margin:0 auto;position: relative;top:0.50rem;}
    .joinmore_box header .headerImg{width:1.75rem;height:1.75rem;background: url("http://oss.xqzs.cn/resources/psy/joinHeaderImg.png") no-repeat;background-size: 100% 100%;}
    .joinmore_box header .headerImg_box .smallImg{position: absolute;right:-0.34rem;bottom:-0.17rem;width:0.68rem;height:0.68rem;}
    .joinmore_box .title{border-bottom:0.02rem solid rgba(224,224,225,1);color:#454B54;font-size: 0.28rem;line-height: 0.86rem;padding-left:0.62rem;padding-right:0.30rem;position: relative}
    .joinmore_box .title span{color:rgba(255,0,0,1);font-size: 0.26rem;position: absolute;left:0.30rem;height:0.68rem;top:50%;margin-top:-0.34rem;line-height: 0.75rem;}
    .joinmore_box .title i{font-style: normal;color:#999;font-size: 0.22rem;margin-left: 0.22rem;}
    .joinmore_box .title_bottom{border-bottom: 0.16rem solid rgba(245,245,245,1);padding:0.20rem 0.30rem 0.20rem 0.54rem;position: relative}
    .joinmore_box .title_bottom .set_box{background: rgba(245,245,245,1);line-height: 0.80rem;color:#999;font-size: 0.26rem;padding-left: 0.20rem;}
    .joinmore_box .title_bottom .set_box input{margin-left:0.34rem;line-height:0.80rem;color:rgba(253,115,1,1);border:0;outline: none;background: none;font-size: 0.26rem;width:50%;}
    .joinmore_box .title_bottom .setPrice_box{margin-bottom: 0.32rem;}
    .joinmore_box .addClass{width:1.80rem;height:0.72rem;display: block}
    .joinmore_box .bottom_left{font-size: 0.26rem;color:#999;display: inline-block;width:85%;overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;}
    .joinmore_box .bottom_right{font-size: 0.24rem;color:rgba(253,115,1,1);float: right;position: absolute;right:0.30rem;top:0.20rem;}

    .joinmore_box .title_bottom .class_style{font-size: 0.24rem;background: rgba(253,115,1,1);color:#fff;margin-right: 0.20rem;padding: 0.10rem 0.20rem;border-radius: 0.10rem;}
    .joinmore_box .subBtn_nor{background: linear-gradient(rgba(255,158,25,0.5),rgba(253,115,1,0.5)); line-height: 0.88rem;color:rgba(255,255,255,1);font-size: 0.36rem;text-align: center;margin-top: 0.48rem;}
    .joinmore_box .subBtn_per{background: linear-gradient(rgba(255,158,25,1),rgba(253,115,1,1)); }
    .joinmore_box .need_know_box{color:#999;display: inline-block;float: right;font-size: 0.24rem;position: relative;}
    .joinmore_box .need_know_box img{width:0.28rem;height:0.28rem;position: absolute;left:-0.40rem;top:50%;margin-top: -0.14rem;}

    .joinmore_box .myask_know_box{
        padding-top: 0.38rem;
        text-align: left;
        color: rgba(36,37,61,0.7);
        font-size:0.28rem;
        line-height: 0.40rem;
    }
    .joinmore_box .myask_know_box li{
        padding: 0 0.30rem;
        margin-bottom: 0.20rem;
    }
    .joinmore_box .myask_know_box b{
        color: #454B54;
    }
    .joinmore_box .myask_class{
        width:12.20rem;
        text-align: left;
        padding-top: 0.38rem;
        background: #fff;
        color: #999;
        font-size: 0.24rem;
        border-radius: 0.1rem;
        position: absolute;
        top:20%;
        left:50%;
        margin-left: -2.80rem;
        overflow: hidden;
        z-index: 1001;
    }
    .joinmore_box .myask_class h3{
        font-size:0.36rem;
        font-family:PingFangSC-Regular;
        color:#454B54;
        line-height:1;
        margin-bottom: 0.42rem;
        width:100%;
        text-align: center;
    }
    .joinmore_box .myask_class_true{
        font-size: 0.36rem;
        height:1.00rem;
        line-height: 1.00rem;
        color: rgba(253,114,6,1);
        text-align: center;
        border-top: 0.02rem solid #eee;
    }
    .joinmore_box .myask_class_true:active{
        background: #ccc;
    }


</style>