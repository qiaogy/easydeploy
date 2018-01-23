/**
 * Created by qiao on 18-1-10.
 */
function MyWebsocket(path) {
    this.sk = new WebSocket('ws://' + window.location.host + path);
    this.sk.onclose = function (p1) { console.log('WebSocket Error: '+ p1) };
    this.sk.onerror = function (p1) { console.log('WebSocket Close: '+ p1) };

    this.defaul_callback = function () {};
    this.stream_map = {};
    this.sk.onmessage = function (code) {
        var ret = JSON.parse(code.data);
        if (typeof(ret.stream) === 'undefined'){
            this.defaul_callback()
        } else {
            this.stream_map[ret.stream](ret);
        }


    }.bind(this);


    this.close = function () {
        this.sk.close()
    };

    this.daly_send = function (data, stream) {
        if (this.sk.readyState === 1){
            if (stream){
                var dic = JSON.parse(data);
                var temp = {stream: stream, payload: dic};
            }else {
                temp = data
            }
            this.sk.send(JSON.stringify(temp))
        }else {
            var that = this;
            window.setTimeout(function () {
                that.daly_send(data, stream)
            }, 1000)
        }
    }
}

(function (jq) {
    jq.extend({
        'MySocket': MyWebsocket
    })
})($);


