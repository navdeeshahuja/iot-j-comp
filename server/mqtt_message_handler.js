var distances_data = [{}, {}, {}];
const PI_POSITIONS = [[0, 0], [0, 0], [0, 0]];
var trilateration = require('trilateration');


trilateration.addBeacon(0, trilateration.vector(PI_POSITIONS[0][0], PI_POSITIONS[0][1]));
trilateration.addBeacon(1, trilateration.vector(PI_POSITIONS[1][0], PI_POSITIONS[1][1]));
trilateration.addBeacon(2, trilateration.vector(PI_POSITIONS[2][0], PI_POSITIONS[2][1]));


module.exports = function(mqtt_client, message){

	var json = JSON.parse(message.toString());
	var raspberry_id = parseInt(json.raspberry_id);
	var distance = json.distance;
	var unit = json.unit;

	distances_data[raspberry_id-1] = {
		distance: distance,
		new: true
	}

	if(distances_data[0].new && distances_data[1].new && distances_data[2].new)
	{
		trilateration.setDistance(0, distances_data[0].distance);
		trilateration.setDistance(1, distances_data[1].distance);
		trilateration.setDistance(2, distances_data[2].distance);

		distances_data[0].new = false;
		distances_data[1].new = false;
		distances_data[2].new = false;

		var pos = trilateration.calculatePosition();

		mqtt_client.publish(mqtt_client.TOPIC2, JSON.stringify({
			x: pos.x,
			y: pos.y,
			unit: "cm"
		}));

	}


}