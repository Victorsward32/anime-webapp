import React, { useEffect, useRef, useState } from "react";
import "../../scss/components/videoCard.scss";
import useFetch from "../../hooks/useFetchData";

const VideoCard = ({ paramId, dummyImage }) => {
  const [page, setPage] = useState(1);
  const bottomRef = useRef(); // Points to the bottom element
  
  // Get episodes from API
  const {
    data: episodeData,
    loading: episodesLoading,
    error: episodeError,
    hasNextPage
  } = useFetch(
    `https://api.jikan.moe/v4/anime/${paramId}/videos/episodes`,
    { page, autoPaginate: true, uniqueById: true },
    [page]
  );

  // Store descriptions for each episode
  const [descriptions, setDescriptions] = useState({});
  
  // Queue of episodes waiting for descriptions
  const [queue, setQueue] = useState([]);
  
  // Are we currently fetching a description?
  const [isFetching, setIsFetching] = useState(false);

  // Add episode to queue if not already there
  const addToQueue = (episodeNumber) => {
    const hasDescription = descriptions[episodeNumber];
    const inQueue = queue.includes(episodeNumber);
    
    if (!hasDescription && !inQueue) {
      setQueue(prevQueue => [...prevQueue, episodeNumber]);
    }
  };

  // Fetch description for one episode
  const fetchDescription = async (episodeNumber) => {
    setIsFetching(true);
    
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${paramId}/episodes/${episodeNumber}`
      );
      
      // Handle rate limit (429 error)
      if (response.status === 429) {
        // Put episode back at front of queue
        setQueue(prevQueue => [episodeNumber, ...prevQueue]);
        console.log(queue)
        // Wait 10 seconds before allowing next fetch
        setTimeout(() => setIsFetching(false), 10000);
        return;
      }

      const data = await response.json();
      const synopsis = data?.data?.synopsis || "No description available";
      
      // Save description
      setDescriptions(prev => ({
        ...prev,
        [episodeNumber]: synopsis
      }));
      
    } catch (error) {
      // Save error message
      setDescriptions(prev => ({
        ...prev,
        [episodeNumber]: "Failed to load description"
      }));
    }
    
    // Wait 5 seconds before next fetch (rate limiting)
    setTimeout(() => setIsFetching(false), 5000);
  };

  // Process queue - fetch next description
  useEffect(() => {
    if (queue.length > 0 && !isFetching) {
      const nextEpisodeNumber = queue[0];
      console.log("nextEpisodeNumber",nextEpisodeNumber)
      setQueue(prevQueue => prevQueue.slice(1)); // Remove first item
      fetchDescription(nextEpisodeNumber);
    }
  }, [queue, isFetching, paramId]);

  // Add new episodes to queue when they load
  useEffect(() => {
    if (episodeData) {
      episodeData.forEach(episode => {
        // Use episode number instead of mal_id
        if (episode.episode) {
          addToQueue(episode.episode);
        }
      });
    }
  }, [episodeData]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        const notLoading = !episodesLoading;
        const morePages = hasNextPage;
        
        if (isVisible && notLoading && morePages) {
          setPage(prevPage => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [episodesLoading, hasNextPage]);

  // Loading state for first page
  if (episodesLoading && page === 1) {
    return <p>Loading episodes...</p>;
  }
  
  // Error state
  if (episodeError) {
    return <p>Error: {episodeError.message || "Could not load episodes"}</p>;
  }

  return (
    <section data-component="VideoCard">
      {/* Render all episodes */}
      {episodeData && episodeData.map((episode) => {
        // Determine description status
        let descriptionStatus = "";
        
        if (descriptions[episode.mal_id]) {
          descriptionStatus = descriptions[episode.mal_id];
        } else if (queue.includes(episode.mal_id)) {
          descriptionStatus = "Waiting in queue...";
        } else if (isFetching && queue.length === 0) {
          descriptionStatus = "Loading description...";
        } else {
          descriptionStatus = "Description pending...";
        }
        
        return (
          <div key={episode.mal_id} className="video-card">
            <img
              className="leftImage"
              src={episode?.images?.jpg?.image_url || dummyImage}
              alt={episode?.title || "Episode"}
            />
            <div className="rightContainer">
              <span>{episode?.title || "Untitled Episode"}</span>
              <p>{descriptionStatus}</p>
            </div>
          </div>
        );
      })}
      
      {/* Loading indicator for pagination */}
      {episodesLoading && page > 1 && (
        <div className="loading-more">
          <p>Loading more episodes...</p>
        </div>
      )}
      
      {/* End of content message */}
      {!hasNextPage && episodeData && episodeData.length > 0 && (
        <div className="end-message">
          <p>✅ All episodes loaded!</p>
        </div>
      )}
      
      {/* Invisible trigger for infinite scroll */}
      <div ref={bottomRef} style={{ height: "1px" }}></div>
    </section>
  );
};

export default VideoCard;