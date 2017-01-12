require('./style.less');

const {linechartTime, seriesTime} = require('./timelinechart');
const {linechartFft, seriesFft} = require('./fftlinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');

jQuery.datetimepicker.setLocale('zh');
jQuery(function() {
    jQuery('#beginTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ) {
            this.setOptions({
                maxDate:jQuery('#endTime').val()?jQuery('#endTime').val():false
            });
        },
        timepicker: true,
        theme: 'dark'
    });
    jQuery('#endTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ) {
            this.setOptions({
                minDate:jQuery('#beginTime').val()?jQuery('#beginTime').val():false
            });
        },
        timepicker: true,
        theme: 'dark'
    });
});

let type = '06';
let sensorIds = [];
requestUtil.fetchSensors(type).then(data => {
    initSensorlist(data);
});

function initSensorlist(data) {
    var $ul = $('ul#vibration-dropdown');
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItem(item);
        }
    });
    $ul.on('click', 'li', function (e) {
        selectSensorItem($(e.currentTarget).data());
    });
}

function selectSensorItem(item) {
    var $selectedSensorItem = $('ul#vibration-dropdown li.chuhe-sensor-item-selected');
    var $sensorItem = $(`ul#vibration-dropdown  li#${item.id}`);
    var $chardTitle = $("a#vibration-title");

    $chardTitle.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorItem.addClass("chuhe-sensor-item-selected");
    $selectedSensorItem.removeClass("chuhe-sensor-item-selected");

}

$('input#clickid').on('click', e => {

    let from = new Date(document.getElementById("beginTime").value);
    let to = new Date(document.getElementById("endTime").value);
    let id = $("ul#vibration-dropdown li.chuhe-sensor-item-selected").attr("id");
    sensorIds = id;
    bridgeScene.bridge.showSensors(sensorIds);

    requestUtil.getAnalytics(id, from.toJSON(), to.toJSON()).then((data) => {
        seriesTime.data = data.timeArray;
        linechartTime.setData([seriesTime]);
        linechartTime.setupGrid();
        linechartTime.draw();

        seriesFft.data = data.sensorFft;
        linechartFft.setData([seriesFft]);
        linechartFft.setupGrid();
        linechartFft.draw();

    });

});

