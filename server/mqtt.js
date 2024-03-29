var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com')
var mqtt_message_handler = require('./mqtt_message_handler')
var TOPIC = 'iot-j-comp-play-topic-random-182194191947';
var TOPIC2 = 'iot-j-comp-play-topic-random-18219419194769';

client.on('connect', function () {
	client.subscribe(TOPIC, function (err) {
		client.subscribe("iot-j-comp-play-topic-random-18219417194769")
		if (err) {
			throw err;
		}
	})
})

client.on('message', function(topic, message) {
	if(topic == TOPIC || topic == "iot-j-comp-play-topic-random-18219417194769")
		mqtt_message_handler(client, topic, message);
});


client.TOPIC = TOPIC;
client.TOPIC2 = TOPIC2;

module.exports = client