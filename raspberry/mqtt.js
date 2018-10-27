var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com')

var TOPIC = 'iot-j-comp-play-topic-random-182194191947';

client.on('connect', function () {
	client.subscribe(TOPIC, function (err) {
		if (err) {
			throw err;
		}
	})
})

client.TOPIC = TOPIC;

module.exports = client