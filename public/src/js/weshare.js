//init weixin share
;var weshare = {
    config: {
        title: '好一点’你的实用人生导师',
        desc: '专家60秒语音解答你的人生小困惑',
        link:   'http://wx.xqzs.cn/comeon/',
        imgUrl: 'http://oss.xqzs.cn/resources/psy/logo.jpg'
    },
    getShareUrl:function (vueUrl,isBack) {
        var reUrl=  "http://wx.xqzs.cn/comeon/?#/";
        if(isBack){
            reUrl +=  "asker/listen?reurl=" + encodeURIComponent(vueUrl)
        }else{
            reUrl= reUrl+ vueUrl;
        }
        return  reUrl;
    },
    init: function (wx,config, success, cancel,type) {
        this.config = $.extend(this.config,config);
        if (success && typeof success == 'function') {
        }else{
            success = function () {}
        }
        if (cancel && typeof cancel == 'function') {
        }else{
            cancel = function () {}
        }
        this.ShareTimeline(wx, success, cancel,type);
        this.ShareAppMesage(wx, success, cancel);
        this.ShareQQ(wx, success, cancel);
        this.ShareWeiBo(wx, success, cancel);
        this.ShareQZone(wx,success,cancel);
    },
    //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
    ShareTimeline: function (wx, success, cancel,type) {
        var that = this;
        var title= that.config.desc;
        if(type&&type=="title"){
            title =that.config.title;
        }
        console.log("wesharejs")
        console.log(title)
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: that.config.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: that.config.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                cancel();
            }
        });
    },
    ShareAppMesage: function (wx, success, cancel) {
        var that = this;
        wx.onMenuShareAppMessage({
            title: that.config.title, // 分享标题
            desc: that.config.desc, // 分享描述
            link: that.config.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: that.config.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
                success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                cancel();
            }
        });
    },
    ShareQQ: function (wx, success, cancel) {
        var that = this;
        wx.onMenuShareQQ({
            title: that.config.title, // 分享标题
            desc: that.config.desc, // 分享描述
            link: that.config.link, // 分享链接
            imgUrl: that.config.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                cancel();
            }
        });
    },
    ShareWeiBo: function (wx, success, cancel) {
        var that = this;
        wx.onMenuShareWeibo({
            title: that.config.title, // 分享标题
            desc: that.config.desc, // 分享描述
            link: that.config.link, // 分享链接
            imgUrl: that.config.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                cancel();
            }
        });
    },
    ShareQZone: function (wx, success, cancel) {
        var that = this;
        wx.onMenuShareQZone({
            title: that.config.title, // 分享标题
            desc: that.config.desc, // 分享描述
            link: that.config.link, // 分享链接
            imgUrl: that.config.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                success();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                cancel();
            }
        });
    }
};