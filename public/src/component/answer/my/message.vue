<template >
    <div style="height: 100%" class="answer_join_voice wbg message_box">

        <div v-title class='hide_title'>访者语音寄语</div>
        <div class="tipc">此至少10秒的语音寄语，将展示给来访者，请录制您对来访者的寄语！</div>



        <div class="audio" :class="{playing:vPlaying,paused:vPaused}"  v-if="!answering&&!finish">
            <div class="audio_btn" @click.stop="playV()" >
                <template v-if="!vPlaying&&!vPaused">点击播放</template>
                <template v-if="vPlaying">正在播放..</template>
                <template v-if="vPaused">播放暂停</template>
                <div class="second">{{voiceLength}}”</div>
            </div>
            <div class="clear"></div>
        </div>




        <div class="applying" v-if="detail&&detail.voiceMessageIdStatus==0" >
             审核中..
        </div>




        <div class="addPlayBox" v-if="preAnswer&&!finish" >

            <!--操作按钮-->

            <div class="action_btn" >

                <div class="item" >
                    <div class="re_start" @click="reStart()">重录</div>
                </div>
                <div class="item" style="flex: 2" >
                </div>


                <div class="item">
                    <div class="send" :class="{cant_send:voiceLength<MIN_VOICE_LENGTH}" @click="send()">完成</div>
                </div>


            </div>
        </div>
        <div class="record_voice_box" v-if="!finish&&detail&&detail.voiceMessageIdStatus!=0">
            <div class="time_in">
                <div>{{answerTime}}"</div>

            </div>
            <div class="time_in_tip">至少录制10秒</div>
            <div class="circle">
                <div class="pie_left_play">
                    <div class="left_play"></div>
                </div>
                <div class="pie_right_play">
                    <div class="right_play"></div>
                </div>

                <div class="pie_left">
                    <div class="left"></div>
                </div>
                <div class="pie_right">
                    <div class="right"></div>
                </div>

                <div class="gg"></div>
                <div class="move">
                    <div class="qq"></div>
                </div>
                <div class="mask"><i class="start"></i></div>

            </div>
            <div class="tip">重录</div>
        </div>

    </div>
</template>

<script type="es6">


    export default {
        data() {
            return {
                answering:false,
                preAnswer:false,
                playing:false,
                answerTime:"00",
                timeOut:null,
                finish:false,
                detail:{},
                vPlaying:false,
                vPaused:false,
                localId:null,
                serviceId:null,
                voiceLength:0,
                MIN_VOICE_LENGTH:10

            }
        },

        methods: {

            timeout:function (play) {
                let _this=this;
                _this.timeOut =    setTimeout(function () {
                    let time = parseInt(_this.answerTime);
                    if(play==true){  //试听
                        if(time>0){
                            time = time -1 ;
                            if(time<10)time="0"+time
                            _this.answerTime = time ;
                            _this.timeout(play);
                        }else{
                            _this.playing=false;
                        }
                    }else{
                        if(time<60){
                            time = time +1 ;
                            _this.voiceLength=time;
                            if(time<10)time="0"+time
                            _this.answerTime = time ;
                            _this.timeout();
                        }else{
                            _this.voiceLength=time;
                            _this.stop();
                        }

                    }

                },1000);
                console.log( _this.answerTime);

            },

            clearTimeOut:function () {
                let _this=this;
                if(_this.timeOut!==null){
                    clearTimeout(_this.timeOut);
                }
            },
            reStart:function () {
                //重新开始录制
                let _this=this;
                this.answerTime="00";
                this.voiceLength=0;
                this.preAnswer=false;
                if(this.playing)xqzs.wx.voice.stopPlay( this.localId);
                this.playing=false;

                this.localId=null;
                myVideo.config({obj:$('.circle')}).init(_this.start,_this.stop,_this.play,_this.play);
                myVideo.initStart();
                myVideo.obj.click();

            },
            send:function () {
                let _this=this;

                if(_this.voiceLength<_this.MIN_VOICE_LENGTH){
                    return ;
                }

                //发送到微信服务器并获取serverId
                xqzs.wx.voice.upload(this.localId,function (serverId) {
                    _this.serverId=serverId;

                    let data ={
                        mediaId:serverId,
                        voiceLength:_this.voiceLength,
                        expertId:cookie.get("expertId"),
                        userId:"_userId_"
                    }
                    _this.$http.post(web.API_PATH + "come/expert/modify/voice", data)
                        .then(function (bt) {
                            if (bt.data && bt.data.status == 1) {
                                _this.finish=true;
                                _this.detail.voiceMessageIdStatus=0
                            }
                        });

                });

                this.clearTimeOut();

            },
            start:function () {
//                开始录制
                let _this=this;
                _this.vPaused=true;
                _this.vPlaying=false;
                xqzs.voice.pause();
                this.clearTimeOut();
                this.answering=true;
                this.timeout()
                console.log("startRecordtimeout")
                xqzs.wx.voice.startRecord();
                xqzs.wx.voice.onRecordEnd(function (localId) {
                    if(localId){
                        _this.localId=localId;
                        xqzs.localdb.set("voice_localId",localId);
                        _this._recordStop();
                    }
                });

            },
            play:function () {//试听
                let _this = this;
                if(this.playing){  //在播放中则暂停
                    if(_this.localId!=null) {
                        _this.clearTimeOut();
                        xqzs.wx.voice.pausePlay(_this.localId);
                        console.log("pausePlay")
                        this.playing = false;
                    }
                }else{
                    if(_this.localId!=null){
                        this.clearTimeOut();
                        xqzs.wx.voice.startPlay(_this.localId);
                        this.playing=true;
                        this.timeout(true);
                        xqzs.wx.voice.onPlayEnd(function () {
                            console.log("onPlayEnd")
                            if(_this.playing)_this.clearTimeOut();
                            _this.playing = false;

                            if(_this.voiceLength<10){
                                _this.answerTime = "0"+_this.voiceLength
                            }else{
                                _this.answerTime = ""+_this.voiceLength
                            }
                        })
                    }
                }
            },
            stop:function () { //停止录制
                let _this = this;

                xqzs.wx.voice.stopRecord(function (localId) {
                    _this.localId = localId;
                    xqzs.localdb.set("voice_localId", localId);
                    _this._recordStop();
                });

            },
            _recordStop:function () {
                let _this = this;
                _this.clearTimeOut();
                _this.answering=false;
                _this.preAnswer=true;
            },
            getTime:function (time) {
                return xqzs.dateTime.getTimeFormatText(time)
            },
            playV:function () {
                 let _this=this;

                xqzs.voice.onEnded=function () {
                    _this.vPaused=false;
                    _this.vPlaying=false;
                };

                if(_this.vPaused){  //暂停中也就是已经获取到且为当前音频
                    _this.vPaused=false;
                    _this.vPlaying=true;
                    xqzs.voice.play();
                    console.log("1")
                }else{
                    if(_this.vPlaying){    //播放中去做暂停操作
                        _this.vPaused=true;
                        _this.vPlaying=false;
                        xqzs.voice.pause();
                        console.log("2")
                    }else{     //重新打开播放
                        let expertId=  cookie.get("expertId");
                        xqzs.voice.getExpertVoice(expertId,function (url) {
                            _this.vPaused=false;
                            _this.vPlaying=true;
                            xqzs.voice.play(url);
                            console.log("3")
                        })
                    }

                }

            },

            getExpertByUserId:function () {
                let _this=this;
                this.$http.get(web.API_PATH + 'come/expert/query/detail/by/userId/_userId_' ).then(function (data) {//es5写法
                    if (data.body.status == 1&&data.body.data!=null) {
                        _this.voiceLength = data.data.data.voiceLength

                    }
                }, function (error) {
                });
            }


        },
        activated: function () {
            let _this=this ;
            let expertId= cookie.get("expertId")
            this.$http.get(web.API_PATH + 'come/expert/query/detail/for/edit/'+expertId + "/_userId_" ).then(function (data) {//es5写法
                if (data.body.status == 1) {
                  if( data.body.data!=null){

                      _this.detail.voiceMessageIdStatus=data.body.data.voiceMessageIdStatus;

                  }


                }
            }, function (error) {

            });
            xqzs.wx.setConfig(_this);
            this.getExpertByUserId();
            myVideo.config({obj:$('.circle')}).init(_this.start,_this.stop,_this.play,_this.play);
        },
        beforeDestroy:function () {
            this.clearTimeOut()
        },

    }
</script>
<style>
    .message_box .audio{text-align: center}
    .message_box .audio .audio_btn {
        display: inline-block;
        float: none;
    }
    .message_box .audio .minute {
        display: inline-block;
        float: none;
    }
    .answer_join_voice .tipc{padding:1.50rem  0.48rem 0.88rem 0.48rem; font-size: 0.36rem; line-height: 1.5; color:#666}
    .answer_join_voice .audio{ margin-left:  0.46rem !important;text-align: center}




    .voice_box { position: fixed;  width: 100%; height: 100%; top:0; padding: 3.00rem 0  }
    .voice_box .bg{background: rgba(0,0,0,0.7); width: 100%; height: 100%; position: fixed; top:0;    z-index: -1;}

    /*播放*/
    .answer_join_voice   .time_go{ position: relative;  height: 1.63rem; width: 1.63rem; margin: 0 auto; margin-top: 0.68rem;}
    .answer_join_voice  .time_go .playing { height: 1.63rem; width: 1.63rem; border-radius: 50%; background: #00b9e8; position: absolute; top:0;left:0; text-align: center; color:#fff; font-size: 0.60rem; line-height: 1.63rem;}
    .answer_join_voice   .play{
        opacity: 0.1;
        transform:scale(1.6,1.6);
    }
    .answer_join_voice   .play2{
        opacity: 0.3;
        transform:scale(1.4,1.4);
    }
    .answer_join_voice   .play3{
        opacity: 0.4;
        transform:scale(1.2,1.2);
    }

    .answer_join_voice  .play_go  .play{
        animation: playing 1s infinite;
        -webkit-animation: playing  1s infinite;
        animation-delay: -0.8s;
        -webkit-animation-delay: -0.8s;
    }
    .answer_join_voice  .play_go .play2{
        animation-delay: -0.6s;
        -webkit-animation-delay: -0.6s;
        animation: playing 1s infinite;
        -webkit-animation: playing 1s infinite;

    }
    .answer_join_voice  .play_go .play3{
        animation-delay: -0.4s;
        -webkit-animation-delay: -0.4s;
        animation: playing 1s infinite;
        -webkit-animation: playing 1s infinite;

    }
    @keyframes  playing {
        0%{
            transform:scale(0.9,0.9);
            opacity: 0.8;
        }
        100%{
            transform:scale(1.7,1.7);
            opacity: 0;
        }
    }






    .answer_join_voice  .times{ padding: 0.07rem 0.85rem; background: #fff}
    .answer_join_voice   .times .bg{ background: #163201; height: 1.00rem;  border-radius: 0.50rem ; }
    .answer_join_voice    .times .bg .in{ padding:  0.05rem; }
    .answer_join_voice    .times .bg .go{ background: #09bb07; height: 0.90rem; min-width:0.90rem;  width: 0; border-radius:0.45rem;      }
    .answer_join_voice  .times .last_time{ text-align: center; color:#666; margin-top: 0.17rem; font-size: 0.52rem;}
    .answer_join_voice  .action_btn{   padding: 1.20rem 0.34rem;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
    }
    .answer_join_voice  .action_btn .item{
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        text-align: center; color:#fff; font-size: 0.26rem;
    }
    .answer_join_voice  .action_btn .item .txt{ margin-top: 0.20rem}
    .answer_join_voice  .audio_btn_in{ background: linear-gradient(to right, rgba(255,158,25,1), rgba(253,114,6,1)); border-radius: 50%; height: 1.40rem; width: 1.40rem;
        -webkit-box-shadow:0 0 0.16rem rgba(255,158,25,1);box-shadow:0 0 0.16rem rgba(255,158,25,1);  position: relative; margin: 0 auto}
    .answer_join_voice .audio_btn_in:active{ background: rgba(105,186,45,0.1)
    }
    .answer_join_voice  .audio_btn_in:before{content: " " ; display: block ; position: absolute; top:50%; left:50% ;}
    .answer_join_voice   .audio_begin:before{ background:url(http://oss.xqzs.cn/resources/psy/audio_btn_begin1.png)  no-repeat; background-size:  0.46rem; width:0.46rem;; height: 0.64rem;  margin-left: -0.23rem; margin-top: -0.32rem;  }
    .answer_join_voice   .audio_end:before{ background:url(http://oss.xqzs.cn/resources/psy/audio_btn_end.png)  no-repeat; background-size:  0.42rem; width:0.42rem;; height: 0.42rem;  margin-left: -0.21rem; margin-top: -0.21rem;  ;   }
    .answer_join_voice   .audio_play:before{ background:url(http://oss.xqzs.cn/resources/psy/audio_btn_play.png)  no-repeat; background-size: 0.45rem; width:0.45rem;; height: 0.52rem;  margin-left: -0.18rem; margin-top: -0.26rem;  }
    .answer_join_voice   .audio_send:before{ background:url(http://oss.xqzs.cn/resources/psy/audio_btn_send.png)  no-repeat; background-size:  0.46rem; width:0.50rem;; height:0.48rem;  margin-left: -0.25rem; margin-top: -0.24rem;   }
    .answer_join_voice   .audio_cant_begin:before{ background:url(http://oss.xqzs.cn/resources/psy/audio_btn_cant_begin.png)  no-repeat; background-size:  0.46rem; width:0.46rem;; height: 0.64rem;  margin-left: -0.23rem; margin-top: -0.32rem;  }
    .applying{ text-align: center; color:#09bb07; margin-top: 1rem}
    .message_box{ width: 100%;
        overflow: hidden;}
    .message_box .addPlayBox{position: absolute;bottom:0.51rem;width:100%;}
</style>