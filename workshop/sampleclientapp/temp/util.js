define(["require", "exports"], function (require, exports) {
    "use strict";
    var Util = (function () {
        function Util() {
        }
        Util.getOptionsFromConnectionString = function (connectionString) {
            var connectionStringArray = connectionString.replace(/\s/g, '').split(';');
            var connectionObject = {};
            var options = {};
            connectionStringArray.forEach(function (item) {
                var items = item.split('=');
                connectionObject[items[0]] = items[1];
            });
            options.host = connectionObject.HostName;
            options.port = 443;
            options.clientId = connectionObject.DeviceId;
            options.username = connectionObject.HostName + '/' + connectionObject.DeviceId + '/DeviceClientType=azure-iot-device%2F1.1.2&api-version=2016-11-14';
            options.password = this.getSaSToken(connectionObject);
            return options;
        };
        Util.getSaSToken = function (connectionObject) {
            var sr = this.encodeUriComponentStrict(connectionObject.HostName + '/devices/' + connectionObject.DeviceId);
            var se = Math.round(new Date().getTime() / 1000) + 24 * 3600;
            var StringToSign = sr + '\n' + se;
            var SharedKey = connectionObject.SharedAccessKey;
            var sig = this.encodeUriComponentStrict(CryptoJS.HmacSHA256(StringToSign, CryptoJS.enc.Base64.parse(SharedKey)).toString(CryptoJS.enc.Base64));
            return 'SharedAccessSignature sr=' + sr + '&sig=' + sig + '&se=' + se;
        };
        Util.encodeUriComponentStrict = function (str) {
            // this stricter version of encodeURIComponent is a recommendation straight out of the MDN docs, see:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
            return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        };
        return Util;
    }());
    exports.Util = Util;
});
