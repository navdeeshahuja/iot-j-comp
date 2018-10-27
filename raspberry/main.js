var noble = require('noble');
var mqtt_client = require('./mqtt');

var addressToTrack = "74:da:ea:b2:39:8a";
var raspberry_id = process.env.RID;

noble.on('discover', function(peripheral){
	if(peripheral.address == addressToTrack){
		var rssi = peripheral.rssi;
		var distance  = calculateDistance(rssi)*100;
		var json = {
			raspberry_id: raspberry_id,
			distance: distance,
			unit: "cm"
		}
		console.log("publishing to mqtt")
		mqtt_client.publish(mqtt_client.TOPIC, JSON.stringify(json));
	}
});

function calculateDistance(rssi) {

	var txPower = -59

	if (rssi == 0) {
		return -1.0; 
	}

	var ratio = rssi*1.0/txPower;
	if (ratio < 1.0) {
		return Math.pow(ratio,10);
	}
	else {
		var distance =	(0.89976)*Math.pow(ratio,7.7095) + 0.111;		
		return distance;
	}
}

noble.startScanning([], true)
