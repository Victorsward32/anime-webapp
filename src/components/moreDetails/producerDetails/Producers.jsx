import React from 'react'
import "../../../scss/components/producers.scss"
import useFetch from '../../../hooks/useFetchData';

const Producers = ({paramId,data}) => {
  return (
    <div data-component='Producers'>
   {data?.map((item, index) => (
        <span key={ index} className='producer-txt'>
    <span className='inner-span'>🟥</span>{item?.name}</span>
      ))}
    </div>
  )
}

export default Producers