require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: 'strain',
    unit: 'MPa',
    value: 'strain',
    interval: 60 * 1000
});
