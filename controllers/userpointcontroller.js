// userpointcontroller.js
// Import Userpoint Model
Userpoint = require('../models/userpoint');

//Handle index actions
exports.index = function (req, res) {
    Userpoint.get(function( err, userspoint) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: " Users Point retrieved successfully",
            data: userspoint
        });
    });
};

//Handle create Point actions
exports.new = async function (req, res) {
    var userpoint = new Userpoint();
    userpoint.location = {
        type: "Point",
        coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
    };
    //userpoint.isAssigned = req.body.isAssigned;
    userpoint.userdocumentid = req.body.userdocumentid;
    userpoint.mobile = req.body.mobile;
    //userpoint.vehicletype = req.body.vehicletype;
    userpoint.username = req.body.username;
    // save the location and check for errors
    await userpoint.save(function (err) {
         if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }
        return res.json({
            message: 'New user point created!',
            data: userpoint
        });
    });
};

exports.deletelocations = async function (req, res) {
    await Userpoint.deleteMany({mobile: req.params.mobile}, function( err, userspoint) {
        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }
        return res.json({
            status: "success",
            message: " Users Point retrieved successfully",
            data: userspoint
        });
    });
}

exports.getlocation = async function (req, res) {
	//console.log(req.params.mobile);
  await Userpoint.find({mobile:req.params.mobile}, function( err, userspoint) {
        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }
        return res.json({
            status: "success",
            message: " Users Point retrieved successfully",
            data: userspoint
        });
    });
}

exports.getalllocation = async function (req, res) {
	await Userpoint.find({userdocumentid: req.params.userdocumentid,
		creationdate: {
			'$gte': `2021-05-12T00:00:00.000Z`,
        '$lt': `2021-05-12T23:59:59.999Z`
			//$gte: start,
      //$lt: end
		}
	}
	, function( err, userspoint) {
		if (err) {
				return res.json({
						status: "error",
						message: err,
				});
		}
		return res.json({
				status: "success",
				message: " Users Point retrieved successfully",
				data: userspoint
		});
	});
}

exports.getalllocationWithDateRange = async function (req, res) {
	await Userpoint.find({userdocumentid: req.params.userdocumentid,
		creationdate: {
			'$gte': `${req.params.startdate}T00:00:00.000Z`,
      '$lt': `${req.params.enddate}T23:59:59.999Z`
		}
	}
	, function( err, userspoint) {
		if (err) {
				return res.json({
						status: "error",
						message: err,
				});
		}
		return res.json({
				status: "success",
				message: " Users Point retrieved successfully",
				data: userspoint
		});
	});
}

exports.getlastlocation = async function (req, res) {
	await Userpoint.aggregate([
		{
				$group:{
						_id:"$userdocumentid",
						creationDate:{$last:"$creationdate"},
						username:{$last:"$username"},
						mobile:{$last:"$mobile"},
						location:{$last:"$location"},
						userdocumentid:{$last:"$userdocumentid"}
				}
		}
	],function( err, userspoint) {
			if (err) {
					return res.json({
							status: "error",
							message: err,
					});
			}
			return res.json({
					status: "success",
					message: " Users Point retrieved successfully",
					data: userspoint
			});
	});
}

exports.near = async function(req, res) {
    await Userpoint.find({
        location: {
         $near: {
          $maxDistance: 20000,
          $geometry: {
           type: "Point",
           coordinates: [parseFloat(req.query.lat), parseFloat(req.query.lng)]
           //coordinates: [31.6137755, 74.92266]
          }
         }
        }
       }).find((error, results) => {

        if (error) {
            console.log(error);
            //response.statusCode = 404;
            return res.status(400).json({

                status: "error",
                message: error,
            });
        };
        return res.json({
            status: "success",
            message: " Users Point retrieved successfully",
            data: results
        });
        //console.log(JSON.stringify(results, 0, 1));
    });
};

