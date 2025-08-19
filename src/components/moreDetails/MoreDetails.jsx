import React from 'react'
import '../../scss/components/moreDetails.scss'
import Producers from './producerDetails/Producers'
import StreamingDetails from './StreamingDetails/StreamingDetails'
import RecentlyViewed from './recentlyViewedDetails/RecentlyViewed'

const MoreDetails = ({ paramId, data }) => {
  return (
    <div data-components='MoreDetails'>
    <div className='left-container'>
        <div className='inner-container'>
        <label className="section-title">streaming</label>
        <StreamingDetails paramId={paramId} data={data?.streaming}/>
        </div>
        <div className='inner-container'>
        <label className="section-title">Recently Viewed</label>
        <RecentlyViewed/>
        </div>
    </div>
    <div className='right-container'>
        <label className="section-title">producers</label>
        <Producers paramId={paramId} data={data?.producers}/>
        
    </div>

    </div>
  )
}

export default MoreDetails