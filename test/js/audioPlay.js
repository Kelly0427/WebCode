(function () {
    function audioPlayTool(audioId) {
        var audio = document.getElementById(audioId);
        if (!audio) return null;

        var self = {
            audioAutoPlay: function () {
                audio.play();
                document.addEventListener("WeixinJSBridgeReady", function () {
                    audio.play();
                }, false);
            },
            // 音乐播放
            autoPlayMusic: function () {
                // 自动播放音乐效果，解决浏览器或者APP自动播放问题
                function musicInBrowserHandler() {
                    self.musicPlay(true);
                    document.body.removeEventListener('touchstart', musicInBrowserHandler);
                    document.body.removeEventListener('click', musicInBrowserHandler);
                    document.body.removeEventListener('mousemove', musicInBrowserHandler);
                }

                document.body.addEventListener('touchstart', musicInBrowserHandler);
                document.body.addEventListener('click', musicInBrowserHandler);
                document.body.addEventListener('mousemove', musicInBrowserHandler);

                // 自动播放音乐效果，解决微信自动播放问题
                function musicInWeixinHandler() {
                    self.musicPlay(true);
                    document.addEventListener("WeixinJSBridgeReady", function () {
                        self.musicPlay(true);
                    }, false);
                    document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
                }

                document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
            },
            musicPlay: function (isPlay) {
                if (isPlay && audio.paused) {
                    audio.play();
                }
                if (!isPlay && !audio.paused) {
                    audio.pause();
                }
            }
        };

        return self;
    }

    window.audioPlayTool = audioPlayTool;
})();