const districts_states = require("../models/districtsStates");
const geoSpatial_district_states = require("../models/geoDistrictStates");


async function apiGet (req,res,next){
    return(res.json({"message" : "Hello form Backend!!"}));
}

async function apiMaxDistance (req,res,next){
    
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
    let max = -1;
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
            if(res > max){ max = res; }
        });
    return(res.json({"maxDist" : max}));
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
    if(req.body.sliderFlag == true){
        let data = {
            ...req.body,
            latitudeFrom,
            longitudeFrom
        };
        allDistrictWithDistance = apiProximity(data);
    }else{        
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
    }

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

async function apiProximity(data){
    let lsDistState = [];
    let allDistrictWithDistance = [];
    if(data.sliderFlag){
        let proximityLoc = await geoSpatial_district_states.find({
            location:{
                $near:{
                    $geometry:{ type:"Point", coordinates:[data.longitudeFrom,data.latitudeFrom]},
                    $minDistance:"100000",
                    $maxDistance: "500000"
                }
            }
        });
        lsDistState = proximityLoc;
        
    }

    lsDistState.forEach((distLatLon)=>{
            latitudeTo = distLatLon.location.coordinates[1];
            longitudeTo = distLatLon.location.coordinates[0];
            // degrees to radians.
            longitudeFromRad =  data.longitudeFrom * Math.PI / 180;
            longitudeToRad = longitudeTo * Math.PI / 180;
            latitudeFromRad = data.latitudeFrom * Math.PI / 180;
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
        });
    
        allDistrictWithDistance.sort(sortFunction);
    
    return allDistrictWithDistance;
}

module.exports = {apiGet , apiPost, apiMaxDistance};