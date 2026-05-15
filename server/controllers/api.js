const districts_states = require("../models/districtsStates");
const geoSpatial_district_states = require("../models/geoDistrictStates");


async function apiGet (req,res,next){
    return(res.json({"message" : "Hello form Backend!!"}));
}

async function apiPost (req,res,next){
    let districtWithDistance = [];
    let latitudeFrom,longitudeFrom,latitudeTo,longitudeTo;
    let latitudeFromRad,longitudeFromRad,latitudeToRad,longitudeToRad;
    let selState = req.body.stateF;
    let selDistrict = req.body.districtF;

    let allDistExceptOne = await districts_states.find({state:selState, district:{$nin : [selDistrict]}});
    let oneDist = await districts_states.find({state:selState,district : selDistrict});

    latitudeFrom = oneDist[0].lat;
    longitudeFrom = oneDist[0].lon;

    let allDistrictWithDistance=[];

    allDistExceptOne.forEach((distLatLon)=>{
        latitudeTo = distLatLon.lat;
        longitudeTo = distLatLon.lon;
        // degrees to radians.
        longitudeFromRad =  longitudeFrom * Math.PI / 180;
        longitudeToRad = longitudeTo * Math.PI / 180;
        latitudeFromRad = latitudeFrom * Math.PI / 180;
        latitudeToRad = latitudeTo * Math.PI / 180;
        
        // Haversine formula 
        let dlon = longitudeToRad - longitudeFromRad; 
        let dlat = latitudeToRad - latitudeFromRad;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(latitudeFromRad) * Math.cos(latitudeToRad)
                 * Math.pow(Math.sin(dlon / 2),2);
        
        let c = 2 * Math.asin(Math.sqrt(a));
        
        // Radius of earth in kilometers.
        let r = 6371;
        
        let res = Math.round(c * r * 1000)/1000;
        allDistrictWithDistance.push({district:distLatLon.district, distance:res});
        districtWithDistance = [];
    });

    allDistrictWithDistance.sort(sortFunction);
    return(res.json({allDistrictWithDistance}));
}

function sortFunction(a, b) {
    if (a.distance === b.distance) {
        return 0;
    }
    else {
        return (a.distance < b.distance) ? -1 : 1;
    }
}

async function apiProximity(req,res,next){
    
    let proximityLoc = geoSpatial_district_states.find({
        location:{
            $near:{
                $geometry:{ type:"Point", coordinates:[72.832678,19.054135]},
                $minDistance:"100000",
                $maxDistance: "500000"
            }
        }
    });
    
    proximityLoc.then(val => {
        console.log(val);
    });
}

module.exports = {apiGet , apiPost};