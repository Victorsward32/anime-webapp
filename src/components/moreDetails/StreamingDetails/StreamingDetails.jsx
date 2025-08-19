import StreamingCard from '../../cards/StreamingCard.jsx'
import "../../../scss/components/streamingDetails.scss"
import { Streaminglogo } from '../../../utils/constants/TextConstants.jsx'

const StreamingDetails = ({ paramId, data }) => (
  <div data-component='StreamingDetails'>
    {data?.map((item, index) => (
      <div className='card' key={index}>
        <StreamingCard
          isCircle={true}
          name={item?.name}
        //   image={
        //     Streaminglogo[
        //       Object.keys(Streaminglogo).find(key =>
        //         item?.name?.toLowerCase().replace(/\s+/g, "").includes(key.toLowerCase())
        //       )
        //     ] || Streaminglogo.Netflix
        //   }
        image={Streaminglogo[item?.name?.replace(/\s+/g, "")]||Streaminglogo.Crunchyroll}
        />
      </div>
    ))}
  </div>
);

export default StreamingDetails;
