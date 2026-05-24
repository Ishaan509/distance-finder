import { useState, useEffect } from "react";
import Items from "./Items";
import axios from "axios";
import "../assets/DistrictList.css";
import PropTypes from "prop-types";

function DistrictList(props) {
  const [SelDisValue, setSelDisValue] = useState("Select");
  const [Result, setResult] = useState({});
  const [ResultCheck, setResultCheck] = useState(false);
  const [sliderEnabled, setSliderEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderMax, setSliderMax] = useState(100);

  const states = props.statesDis;
  let selectedState = props.selectedValue;
//   console.log("State: " + selectedState);

  function handleChange(event) {
    let valueSelected = event.target.value;
    setSelDisValue(valueSelected);
  }

  async function handleCheckboxChange(event) {
    let flag = event.target.checked;
    const payload = {
        stateF: selectedState,
        districtF: SelDisValue,
      };

    if(flag){
        await axios
          .post(import.meta.env.VITE_BACKEND_URL + "/api/distFetch", payload)
          .then((response) => {            
            setSliderMax(response.data.maxDist);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    
    setSliderEnabled(flag);
  }

  function handleSliderChange(event) {
    setSliderValue(Number(event.target.value));
  }

  async function handleSubmit() {
    if (selectedState != "Select" && SelDisValue != "Select") {
      const payload = {
        stateF: selectedState,
        districtF: SelDisValue,
        sliderFlag: sliderEnabled,
        ...(sliderEnabled && { sliderValue }),
      };

      await axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api", payload)
        .then((response) => {
          setResult(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setResultCheck(true);
    } else {
      setResultCheck(false);
    }
  }

  useEffect(() => {
    setSelDisValue("Select");
    setResultCheck(false);
  }, [selectedState]);

  return (
    <div>
      <div id="Dlist">
        <h1>
          Selected District:{" "}
          {selectedState == "Select"
            ? "Not Selected"
            : SelDisValue == "Select"
              ? "Not Selected"
              : SelDisValue}
        </h1>
        <label id="districtLabel" htmlFor="district">
          Select District:
        </label>

        <select id="district" onChange={handleChange}>
          <option id="0" value="Select">
            Select
          </option>
          {selectedState == "Select"
            ? null
            : states.map((element) => {
                const { state, districts } = element;
                if (state == selectedState) {
                  return districts.map((district, index) => {
                    return (
                      <option key={index + 1} id={index + 1} value={district}>
                        {district}
                      </option>
                    );
                  });
                }
              })}
        </select>

        {/* Checkbox to toggle slider */}
        <div className="sliderToggle">
          <label htmlFor="sliderCheckbox">
            <input
              type="checkbox"
              id="sliderCheckbox"
              disabled={
                selectedState == "Select" || SelDisValue == "Select"
                  ? true
                  : false
              }
              checked={sliderEnabled}
              onChange={handleCheckboxChange}
            />
            Enable Range(click this checkbox to search in a specific range)
          </label>
        </div>

        {/* Slider — shown only when checkbox is checked */}
        {sliderEnabled && (
          <div className="sliderContainer">
            <label htmlFor="rangeSlider">Range Value: {sliderValue}</label>
            <input
              type="range"
              id="rangeSlider"
              min={0}
              max={sliderMax}
              value={sliderValue}
              onChange={handleSliderChange}
              list="sliderMarkers"
            />
            {/* <datalist id="sliderMarkers">
              <option value="50"></option>
            </datalist> */}
          </div>
        )}

        <button className="buttonStyle" id="subButt" onClick={handleSubmit}>
          SUBMIT
        </button>
      </div>
      <div>
        {ResultCheck ? (
          <Items districtwithdistances={Result} selDistrict={SelDisValue} />
        ) : null}
      </div>
    </div>
  );
}

DistrictList.propTypes = {
  statesDis: PropTypes.array,
  selectedValue: PropTypes.string,
};

export default DistrictList;
