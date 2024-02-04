import States_District_Data from '../assets/states-and-districts.json'
import DistrictList from './DistrictList'
import { useState } from 'react';
import '../assets/StatesList.css'
function StatesList() {
    const {states} = States_District_Data;
    const [SelValue,setSelValue] = useState("Select");

    function handleChange(event){
        let valueSelected = event.target.value;
        setSelValue(valueSelected);
    }

    return(
        <div id="statesDistricts" >
            <div id="stateComponent" >
            <h1>Selected State: {(SelValue == "Select")? "Not Selected" : SelValue}</h1>
            <label id="stateLabel" htmlFor="state">Select State:</label>

            <select id="state" onChange={handleChange}>
                <option id="0" value="Select">Select</option>
                {
                    states.map((element,index)=>{
                        let {state} = element;
                        return(<option key={index+1} id={index+1} value={state} >{state}</option>)
                    })
                }
            </select>
            </div>

            <div>
            <DistrictList statesDis={states} selectedValue={SelValue}/>
            </div>

        </div>
    );
}
export default StatesList