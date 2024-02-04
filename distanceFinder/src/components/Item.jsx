import PropTypes from 'prop-types';
function Item(props) {
    return(
        <tr>
            <td>{props.distanceData.district}</td>
            <td>{props.distanceData.distance}</td>
        </tr>
    );
}

Item.propTypes = {
    distanceData: PropTypes.object
}

export default Item;