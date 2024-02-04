import { useState,useEffect } from "react";
import Items from './Items';
import axios from 'axios';
import '../assets/DistrictList.css';
import PropTypes from 'prop-types';

function DistrictList(props) {

    const [SelDisValue,setSelDisValue] = useState("Select");
    const [Result,setResult] = useState({});
    const [ResultCheck,setResultCheck] = useState(false);

    const states = props.statesDis;
    

    function handleChange(event){
        let valueSelected = event.target.value;
        setSelDisValue(valueSelected);
    }

    async function handleSubmit(){
        if(props.selectedValue != "Select" && SelDisValue != "Select"){

            await axios.post('http://localhost:3000/api',{stateF:props.selectedValue, districtF:SelDisValue})
            .then((response)=>{
                setResult(response.data);
            })
            .catch((error)=>{
                console.log(error);
            })
            setResultCheck(true);
        }else{
            setResultCheck(false);
        }
    }

    useEffect(()=>{
        setSelDisValue("Select");
        setResultCheck(false);
    },[props.selectedValue])

    return(
        <div>
        <div id="Dlist" >
            <h1>Selected District: {(props.selectedValue == "Select")? "Not Selected" : (SelDisValue == "Select")? "Not Selected" : SelDisValue}</h1>
            <label id="districtLabel" htmlFor="district">Select District:</label>
    
            <select id="district" onChange={handleChange}>
            <option id="0" value="Select">Select</option>
                {(props.selectedValue == "Select")? null:
                states.map((element)=>{
                    const {state,districts} = element;
                    if(state == props.selectedValue){
                        return(
                            districts.map((district,index)=>{
                                return(<option key={index+1} id={index+1} value={district}>{district}</option>)
                            })
                        );
                    }
                })
                }
            </select>

            <button className="buttonStyle" id="subButt" onClick={handleSubmit} > SUBMIT </button>
        </div>
        <div>
            {(ResultCheck)? <Items districtwithdistances={Result} selDistrict={SelDisValue} /> : null }
        </div>
        </div>
    );
}

DistrictList.propTypes = {
    statesDis: PropTypes.array,
    selectedValue: PropTypes.string
}

export default DistrictList