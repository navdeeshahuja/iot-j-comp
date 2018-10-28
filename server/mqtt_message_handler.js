var distances_data = [{}, {}, {}];
const PI_POSITIONS = [[100, 200], [50, 50], [75, 250]];
var trilateration = require('trilateration');
var kalman_filter = require('kalman_2d').kalman;
var kalman_filter = new kalman_filter(100);
kalman_filter.TimeStamp_milliseconds = new Date().getTime();

trilateration.addBeacon(0, trilateration.vector(PI_POSITIONS[0][0], PI_POSITIONS[0][1]));
trilateration.addBeacon(1, trilateration.vector(PI_POSITIONS[1][0], PI_POSITIONS[1][1]));
trilateration.addBeacon(2, trilateration.vector(PI_POSITIONS[2][0], PI_POSITIONS[2][1]));


module.exports = function(mqtt_client, topic, message){


	var json = JSON.parse(message.toString());
	if(!json.raspberry_id)
	{
		
		return;
	}

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

		if(!isNaN(pos.x) && !isNaN(pos.y))
		{
			kalman_filter.Process(pos.x, pos.y, 1, new Date().getTime());
			if(!isNaN(kalman_filter.x_filtered) && !isNaN(kalman_filter.y_filtered))
			{
				var json_to_publish = {
					x: kalman_filter.x_filtered,
					y: kalman_filter.y_filtered,
					unit: "cm"
				}
				mqtt_client.publish(mqtt_client.TOPIC2, JSON.stringify(json_to_publish));

				console.log(json_to_publish)
			}
			else
			{
				console.log("trilateration done 22");
			}
		}
		else
		{
			console.log("trilateration done");
		}

	}


}