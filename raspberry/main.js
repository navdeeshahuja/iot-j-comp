var noble = require('noble');

//replace with your hardware address
var addressToTrack = "74:da:ea:b2:39:8a";
var raspberry_id = process.env.RID;

noble.on('discover', function(peripheral){
	if(peripheral.address == addressToTrack){
		var rssi = peripheral.rssi;
		var distance  = calculateDistance(rssi)*100;
		console.log(distance);
	}
});

function calculateDistance(rssi) {

	var txPower = -59 //hard coded power value. Usually ranges between -59 to -65

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
