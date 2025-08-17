import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import image from "../../assets/images/dummyAnime.jpg";
import useFetch from "../../hooks/useFetchData";
import VideoCard from "../../components/cards/VideoCard";
import StreamingCard from "../../components/cards/StreamingCard";
import '../../scss/pages/animeDetails.scss'

const AnimeDetails = () => {
  const params = useParams();
  const loadingRef = useRef(null);
  
  // State for controlling sequential API calls to avoid 429 errors
  const [apiCallOrder, setApiCallOrder] = useState({
    anime: true,    // Start with anime details first
    staff: false,   // Enable after anime loads
    character: false, // Enable after staff loads
    episodes: false,  // Enable after character loads
    videos: false     // Enable after episodes starts loading
  });
  
  // State for episodes pagination
  const [episodesPage, setEpisodesPage] = useState(1);
  
  // Sequential API calls to respect rate limits
  // 1. Main anime data - loads immediately
  const { data: itemData, loading: itemLoading, error: itemError } = useFetch(
    apiCallOrder.anime ? `https://api.jikan.moe/v4/anime/${params.id}/full` : null,
    { autoPaginate: false },
    {} // Initial data as empty object
  );

  // 2. Staff data - loads after anime data
  const { data: rawStaffData, loading: staffLoading, error: staffError } = useFetch(
    apiCallOrder.staff ? `https://api.jikan.moe/v4/anime/${params.id}/staff` : null,
    { autoPaginate: false },
    { data: [] }
  );

  // 3. Character data - loads after staff data
  const { data: rawCharacterData, loading: characterLoading, error: characterError } = useFetch(
    apiCallOrder.character ? `https://api.jikan.moe/v4/anime/${params.id}/characters` : null,
    { autoPaginate: false },
    { data: [] }
  );

  // 4. Episodes data - loads after character data, with pagination
  const { data: rawEpisodesData, loading: episodesLoading, error: episodesError, hasNextPage } = useFetch(
    apiCallOrder.episodes ? `https://api.jikan.moe/v4/anime/${params.id}/episodes` : null,
    { 
      page: episodesPage, 
      autoPaginate: true,
      uniqueById: true
    },
    []
  );

  // 5. Episode videos/promos - loads after episodes start loading
  const { data: rawEpisodeImageData, loading: imageLoading, error: imageError } = useFetch(
    apiCallOrder.videos ? `https://api.jikan.moe/v4/anime/${params.id}/videos` : null,
    { autoPaginate: false },
    { data: { promo: [] } }
  );

  // Sequential API call controller - prevents 429 errors
  useEffect(() => {
    // Start with anime data (already enabled by default)
    
    // Enable staff API call after anime data loads
    if (!itemLoading && itemData?.data && !apiCallOrder.staff) {
      console.log("✅ Anime loaded, enabling staff API call...");
      setTimeout(() => {
        setApiCallOrder(prev => ({ ...prev, staff: true }));
      }, 400); // Extra delay to be safe
    }
    
    // Enable character API call after staff data loads
    if (!staffLoading && rawStaffData?.data && !apiCallOrder.character) {
      console.log("✅ Staff loaded, enabling character API call...");
      setTimeout(() => {
        setApiCallOrder(prev => ({ ...prev, character: true }));
      }, 400);
    }
    
    // Enable episodes API call after character data loads
    if (!characterLoading && rawCharacterData?.data && !apiCallOrder.episodes) {
      console.log("✅ Characters loaded, enabling episodes API call...");
      setTimeout(() => {
        setApiCallOrder(prev => ({ ...prev, episodes: true }));
      }, 400);
    }
    
    // Enable videos API call after episodes start loading
    if (apiCallOrder.episodes && !apiCallOrder.videos) {
      console.log("✅ Episodes started, enabling videos API call...");
      setTimeout(() => {
        setApiCallOrder(prev => ({ ...prev, videos: true }));
      }, 800); // Longer delay for videos as it's less critical
    }
    
  }, [itemLoading, itemData, staffLoading, rawStaffData, characterLoading, rawCharacterData, apiCallOrder]);

  // Transform data to maintain your existing dot notation structure
  const staffData = rawStaffData?.data || [];
  const characterData = rawCharacterData?.data || [];
  const episodesData = rawEpisodesData || [];
  const episodeImagedata = rawEpisodeImageData?.data?.promo || [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadingRef.current || !hasNextPage || !apiCallOrder.episodes) return;

    const loadingObserver = new IntersectionObserver(
      (entries) => {
        const loadingEntry = entries[0];
        
        if (loadingEntry.isIntersecting && hasNextPage && !episodesLoading) {
          console.log("📡 Loading more episodes...");
          setEpisodesPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );

    loadingObserver.observe(loadingRef.current);

    return () => {
      if (loadingRef.current) {
        loadingObserver.unobserve(loadingRef.current);
      }
    };
  }, [hasNextPage, episodesLoading, apiCallOrder.episodes]);

  // Show loading state for main anime data
  if (itemLoading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Loading anime details...</h2>
        <p>Please wait, respecting API rate limits...</p>
      </div>
    );
  }

  // Show error state if main anime data fails to load
  if (itemError) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Error loading anime</h2>
        <p>{itemError.message}</p>
        {itemError.message.includes('429') && (
          <p style={{ color: 'orange' }}>
            Too many requests - please wait a moment and refresh the page
          </p>
        )}
      </div>
    );
  }

  return (
    <div data-component="AnimeDetails">
      <section
        className="banner"
        style={{
          backgroundImage: `url(${
            itemData?.data?.trailer?.images?.maximum_image_url ||
            itemData?.data?.images?.webp?.large_image_url ||
            itemData?.data?.images?.jpg?.large_image_url ||
            image
          })`,
        }}
      >
        <div className="itemsContainer">
          <img
            className="item-image"
            src={itemData?.data?.images?.webp?.image_url ||
                 itemData?.data?.images?.jpg?.image_url ||
                 image}
            alt={itemData?.data?.title || 'Anime'}
          />
          <div className="item-Details-container">
            <span className="item-title">{itemData?.data?.title || 'Unknown Anime'}</span>
            <p className="item-description">{itemData?.data?.synopsis || 'No description available.'}</p>
            <div className="table-container">
              <div className="attribute-container">
                <div className="attribute">
                  <span>Year</span>
                  <span>{itemData?.data?.year || 'Unknown'}</span>
                </div>
                <div className="attribute">
                  <span>Rank</span>
                  <span>{itemData?.data?.rank || 'Unranked'}</span>
                </div>
              </div>
              <div className="attribute-container">
                <div className="attribute">
                  <span>Status</span>
                  <span>{itemData?.data?.status || 'Unknown'}</span>
                </div>
                <div className="attribute">
                  <span>Score</span>
                  <span>{itemData?.data?.score || 'N/A'}</span>
                </div>
              </div>
              <div className="attribute-container">
                <div className="attribute">
                  <span>Rating</span>
                  <span>{itemData?.data?.rating || 'Not Rated'}</span>
                </div>
                <div className="attribute">
                  <span>Genre</span>
                  <span>
                    {itemData?.data?.genres?.length > 0 
                      ? itemData.data.genres.map((item) => item.name + " ")
                      : 'Unknown'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="banner_overlay"></div>
      </section>

      <section className="episodes-container">
        <label className="section-title">Episodes</label>
        <div className="video-container">
          <div
            className="left-contiainer"
            style={{
              backgroundImage: `url(${
                itemData?.data?.trailer?.images?.maximum_image_url ||
                itemData?.data?.images?.webp?.large_image_url ||
                itemData?.data?.images?.jpg?.large_image_url ||
                image
              })`,
            }}
          />
          <div className="right-container">
            {/* Show loading state when waiting for episodes API to be enabled */}
            {!apiCallOrder.episodes && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading characters first, then episodes...</p>
                <small style={{ color: '#666' }}>Respecting API rate limits</small>
              </div>
            )}
            
            {/* Show loading state for first episodes load */}
            {apiCallOrder.episodes && episodesData.length === 0 && episodesLoading && (
              <div style={{ padding: '20px', textAlign: 'center' }}>Loading episodes...</div>
            )}
            
            {/* Show error state for episodes */}
            {episodesError && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                Error loading episodes: {episodesError.message}
                {episodesError.message.includes('429') && (
                  <p style={{ color: 'orange' }}>Rate limit exceeded - episodes will load automatically</p>
                )}
              </div>
            )}
            
            {/* Render episodes - keeping your exact logic */}
            {episodesData.map((item, index) => {
              // Your original episode image matching logic
              var episodeImage = episodeImagedata.find((epImage, epIndex) => { 
                if(epImage?.title === item?.title) {
                  console.log("found match");
                  return true;
                } 
                return false;
              });

              return (
                <VideoCard 
                  key={item.mal_id || index}
                  image={episodeImage?.trailer?.images?.maximum_image_url || 
                         itemData?.data?.trailer?.images?.maximum_image_url ||
                         itemData?.data?.images?.webp?.large_image_url ||
                         image} 
                  title={item?.title || `Episode ${index + 1}`}
                  description={item?.title || `Episode ${index + 1}`} 
                />
              );
            })}
            
            {/* Loading indicator for infinite scroll */}
            {hasNextPage && apiCallOrder.episodes && (
              <div ref={loadingRef} style={{ padding: '20px', textAlign: 'center' }}>
                {episodesLoading ? 'Loading more episodes...' : 'Loading...'}
              </div>
            )}
            
            {/* Show message when all episodes are loaded */}
            {!hasNextPage && episodesData.length > 0 && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                ✅ All episodes loaded!
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="streaming-container">
        <label className="section-title">Character</label>
        <div className="character-section">
          {/* Show loading state when waiting for character API to be enabled */}
          {!apiCallOrder.character && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Loading staff first, then characters...</p>
              <small style={{ color: '#666' }}>Respecting API rate limits</small>
            </div>
          )}
          
          {/* Show loading state for characters */}
          {apiCallOrder.character && characterLoading && (
            <div style={{ padding: '20px', textAlign: 'center' }}>Loading characters...</div>
          )}
          
          {/* Show error state for characters */}
          {characterError && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
              Error loading characters: {characterError.message}
            </div>
          )}
          
          {/* Render characters - keeping your exact structure */}
          {characterData.map((item, index) => {
            return (
              <div className="card-container" key={item?.character?.mal_id || index}>
                <StreamingCard
                  name={item?.character?.name || 'Unknown Character'}
                  image={item?.character?.images?.jpg?.image_url ||
                         item?.character?.images?.webp?.image_url ||
                         image}
                  isCircle={true}
                />
              </div>
            );
          })}
        </div>

        <label className="section-title">Cast</label>
        <div className="character-section">
          {/* Show loading state when waiting for staff API to be enabled */}
          {!apiCallOrder.staff && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Loading anime details first, then staff...</p>
              <small style={{ color: '#666' }}>Respecting API rate limits</small>
            </div>
          )}
          
          {/* Show loading state for staff */}
          {apiCallOrder.staff && staffLoading && (
            <div style={{ padding: '20px', textAlign: 'center' }}>Loading staff...</div>
          )}
          
          {/* Show error state for staff */}
          {staffError && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
              Error loading staff: {staffError.message}
            </div>
          )}
          
          {/* Render staff - keeping your exact structure */}
          {staffData.map((item, index) => {
            return (
              <div className="card-container" key={item?.person?.mal_id || index}>
                <StreamingCard
                  name={item?.person?.name || 'Unknown Person'}
                  image={item?.person?.images?.jpg?.image_url ||
                         item?.person?.images?.webp?.image_url ||
                         image}
                  isCircle={false}
                  role={item.positions?.[0] || 'Unknown Role'}
                />
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: '#000', color: '#fff', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
          <div>API Status:</div>
          <div>Anime: {itemLoading ? '⏳' : itemData?.data ? '✅' : '❌'}</div>
          <div>Staff: {apiCallOrder.staff ? (staffLoading ? '⏳' : staffData.length > 0 ? '✅' : '❌') : '⏸️'}</div>
          <div>Characters: {apiCallOrder.character ? (characterLoading ? '⏳' : characterData.length > 0 ? '✅' : '❌') : '⏸️'}</div>
          <div>Episodes: {apiCallOrder.episodes ? (episodesLoading ? '⏳' : episodesData.length > 0 ? '✅' : '❌') : '⏸️'}</div>
          <div>Videos: {apiCallOrder.videos ? (imageLoading ? '⏳' : episodeImagedata.length > 0 ? '✅' : '❌') : '⏸️'}</div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetails;
