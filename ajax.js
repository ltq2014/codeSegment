/*
 * @Author: liutianqi
 * @Date:   2016-02-08 19:37:39
 * @Last Modified by:   liutianqi
 * @Last Modified time: 2017-02-09 10:41:15
 * @仿照jquery，实现ajax函数
 */
'use strict';
function(window) {

    /*
     * 1. 请求的类型                type    get post
     * 2. 请求地址                  url
     * 3. 是异步的还是同步的         async   false true
     * 4. 请求内容的格式            contentType
     * 5. 传输的数据                data    json对象
     *
     * 6.响应成功处理函数           success   function
     * 7.响应失败的处理函数         error     function
     * 
     */
    window.$.ajax = function(option) {

        //参数检查，前期准备
        //判断option类型，非对象返回false
        if (!option || typeof option === "object") return false;
        //设置请求方法 默认为get方法
        var type = option.type || "get";
        //请求地址 
        var url = option.url || location.pathname;
        //是异步的还是同步的 默认为异步方法
        var async = (option.async === false) ? false: true;
        //请求内容的格式 
        var contentType = option.contentType === "json" ? "json" : "xml";
        //传输的数据 ｛name:'',age:''｝
        var data = option.data || {};
        //拼接字符串 在提交的时候需要转成 name=xjj 这种格式
        var dataStr = '';
        for (var key in data) {
            dataStr += key + '=' + data[key] + '&';
        }
        //去掉最后一个
        dataStr = dataStr && dataStr.slice(0, -1);
        //ajax编程 (暂不考虑ie低版本   )
        var xhr = new XMLHttpRequest();
        //
        xhr.open(type, (type == 'get' ? url + '?' + dataStr : url), async);
        //请求头
        if (type !== "get") {
            xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
        };
        //发送
        xhr.send(type == 'get' ? null : dataStr);
        //事件函数 
        xhr.onreadystatechange = function() {
            //响应完成并且成功
            if (xhr.readyState == 4 && xhr.status === 200) {
                var data = "";
                var contentType = xhr.getResponseHeader('Content-Type');
                //如果服务器返回的是xml
                if (contentType.indexOf('xml') > -1) {
                    data = xhr.responseXML;
                } else if (contentType.indexOf('json') > -1) {
                    //如果为json
                    data = JSON.parse(xhr.responseText);
                }
                //否则的话他就是字符串
                else {
                    data = xhr.responseText;
                }
                //回调 成功处理函数
                option.success && option.success(data);
            } else if (xhr.readyState == 4) {
                //即使请求xhr.status不成功  他也需要的响应完成才认作是一个错误的请求
                options.error && options.error('you request fail !');
            }
        }
    }
}(window)
