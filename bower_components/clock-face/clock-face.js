(function() {
    "use strict";

    var proto = Object.create(HTMLElement.prototype);
    proto.createdCallback = function() {
        var that = this;
        this.readAttributes();

        this.innerHTML =
            "<div class='clock-face-container'>" +
            "<div class='clock-face-hour'></div>" +
            "<div class='clock-face-minute'></div>" +
            "<div class='clock-face-second'></div>" +
            "</div>";

        this.hourElement = this.querySelector(".clock-face-hour");
        this.minuteElement = this.querySelector(".clock-face-minute");
        this.secondElement = this.querySelector(".clock-face-second");

        this.updateClock();
        if (!this.hour && !this.minute && !this.second) {
            this.interval = setInterval(function() {
                that.updateClock();
            }, 1000);
        }
    };
    proto.readAttributes = function() {
        this.hour = this.getAttribute('hour');
        this.minute = this.getAttribute("minute");
        this.second = this.getAttribute("second");
    };
    proto.calcTime = function(offset) {

        // create Date object for current location
        var d = new Date();

        // convert to msec
        // add local time zone offset 
        // get UTC time in msec
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        // create new Date object for different city
        // using supplied offset
        var nd = new Date(utc + (3600000 * offset));

        // return time as a string
        return nd;
    };
    proto.timeZone = '5.5';
    proto.updateClock = function() {
        var tmZn = this.timeZone,
            now = (tmZn && this.calcTime(tmZn)) || new Date(),
            hour = this.hour || now.getHours(),
            minute = this.minute || now.getMinutes(),
            second = this.second || now.getSeconds(),
            secondAngle = second * 6,
            minuteAngle = minute * 6 + secondAngle / 60,
            hourAngle = ((hour % 12) / 12) * 360 + 90 + minute / 12,
            hourRule = "rotate(" + hourAngle + "deg)",
            minuteRule = "rotate(" + minuteAngle + "deg)",
            secondRule = "rotate(" + secondAngle + "deg)";

        this.hourElement.style.msTransform = hourRule;
        this.hourElement.style.webkitTransform = hourRule;
        this.hourElement.style.transform = hourRule;
        this.minuteElement.style.msTransform = minuteRule;
        this.minuteElement.style.webkitTransform = minuteRule;
        this.minuteElement.style.transform = minuteRule;
        this.secondElement.style.msTransform = secondRule;
        this.secondElement.style.webkitTransform = secondRule;
        this.secondElement.style.transform = secondRule;
    };
    proto.attributeChangedCallback = function(attrName, oldVal, newVal) {
        if (/hour|minute|second/.test(attrName)) {
            this.readAttributes();
            this.updateClock();
        }
    };

    document.registerElement("clock-face", {
        prototype: proto
    });
}());