import '../assets/items.css'
import Item from "./Item";
import PropTypes from 'prop-types';

function Items(props){
    const district_distance = props.districtwithdistances.allDistrictWithDistance;
    return(
        <div className='tableContainer' >
            <h4>Check the table Below</h4>
            <table>
                <caption>
                    Districts with their distances form <strong>{props.selDistrict}</strong>
                </caption>
                <thead>
                    <tr>
                        <th>District</th>
                        <th>Distance(in kms)</th>
                    </tr>
                </thead>
                <tbody>
                    {district_distance.map((element,index)=>{return(<Item key={index} distanceData={element} />)})}
                </tbody>
            </table>
        </div>
    );
}

Items.propTypes = {
    districtwithdistances: PropTypes.object,
    selDistrict: PropTypes.string
}

export default Items;