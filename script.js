// Replace with your YouTube API key
const API_KEY = 'AIzaSyB9mc-NlKuI2M6-3f8ZsvxiqDhOXM57fTM';

// Playlist ID (for fetching playlist videos)
const PLAYLIST_ID = 'PLw8v7d4wvt8dpaLOWrH8dlBWO9sR3bjTW'; // Replace with your playlist ID

// Channel ID (for fetching latest videos)
const CHANNEL_ID = 'UCfugaRa2sBh9QTl1Zd7r-JA';  // Replace with your channel ID

const MAX_RESULTS = 4;  // Number of videos to fetch for latest videos

let nextPageToken = '';  // Variable to store the next page token for pagination

// Function to fetch playlist videos with pagination
function fetchPlaylistVideos() {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}&pageToken=${nextPageToken}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const videos = data.items;
        nextPageToken = data.nextPageToken;  // Store the next page token

        const container = document.getElementById('vocabulary-container');
        
        // Display videos in a container
        videos.forEach(video => {
            const title = video.snippet.title;
            const videoId = video.snippet.resourceId.videoId;
            const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
            const thumbnailUrl = video.snippet.thumbnails.medium.url; // Get the thumbnail URL

            // Create a container for each video (title + thumbnail)
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-item');

            // Create and append the thumbnail image
            const thumbnail = document.createElement('img');
            thumbnail.src = thumbnailUrl;
            thumbnail.alt = title;
            thumbnail.classList.add('video-thumbnail');
            videoContainer.appendChild(thumbnail);

            // Create and append the video title
            const videoTitle = document.createElement('a');
            videoTitle.href = videoLink;
            videoTitle.target = "_blank";
            videoTitle.classList.add('video-title');
            videoTitle.textContent = title;
            videoContainer.appendChild(videoTitle);

            // Append the video item to the container
            container.appendChild(videoContainer);
        });
    })
    .catch(error => console.error('Error fetching videos:', error));
}

// Function to fetch the latest videos from the channel
function fetchLatestVideos() {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&order=date&part=snippet&type=video&maxResults=${MAX_RESULTS}`)
        .then(response => response.json())
        .then(data => {
            const videos = data.items;
            displayVideos(videos);
            videos.forEach(video => {
                const videoId = video.id.videoId;
                const title = video.snippet.title;
                const description = video.snippet.description;
                const thumbnailUrl = video.snippet.thumbnails.medium.url;
                const uploadDate = video.snippet.publishedAt;

                // Generate schema markup for each video
                generateSchemaMarkup(title, description, thumbnailUrl, uploadDate, videoId);
            });
        })
        .catch(error => console.error('Error fetching videos:', error));
}

// Display fetched videos in a horizontal scrollable container
function displayVideos(videos) {
    const container = document.querySelector('.latest-videos .video-container');
    container.innerHTML = '';  // Clear existing content

    videos.forEach(video => {
        const title = video.snippet.title;
        const videoId = video.id.videoId;
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
        const thumbnailUrl = video.snippet.thumbnails.medium.url;

        // Create video card
        const videoCard = document.createElement('div');
        videoCard.classList.add('video');

        videoCard.innerHTML = `
            <a href="${videoLink}" target="_blank">
                <img src="${thumbnailUrl}" alt="${title}">
            </a>
            <p class="video-title">${title}</p>
        `;

        container.appendChild(videoCard);
    });

    // Initialize the slider for horizontal scrolling
    initializeSlider();
}

// Initialize horizontal scrollable container (slider)
function initializeSlider() {
    const container = document.querySelector('.video-container');
    const totalWidth = container.scrollWidth;
    container.style.width = totalWidth + 'px';
}

// Generate schema markup for each video
function generateSchemaMarkup(title, description, thumbnailUrl, uploadDate, videoId) {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": title,
        "description": description,
        "thumbnailUrl": thumbnailUrl,
        "uploadDate": uploadDate.split("T")[0],  // Get date in YYYY-MM-DD format
        "contentUrl": `https://www.youtube.com/watch?v=${videoId}`,
        "embedUrl": `https://www.youtube.com/embed/${videoId}`,
        "publisher": {
            "@type": "Organization",
            "name": "Maths Addicts",  // Replace with your organization's name
            "logo": {
                "@type": "ImageObject",
                "url": "https://example.com/logo.png"  // Replace with your logo URL
            }
        }
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(scriptTag);  // Append the schema to the head of the document
}

// Call the function to fetch videos when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchPlaylistVideos();  // Fetch videos from playlist
    fetchLatestVideos();  // Fetch latest videos from channel
});












// Function to add a new sticky note dynamically
document.querySelector('.add-note-btn').addEventListener('click', function() {
    const newNote = document.createElement('div');
    newNote.classList.add('sticky-note');
    newNote.setAttribute('contenteditable', 'true');
    newNote.style.backgroundColor = getRandomColor();  // Random background color
  
    // Adding a delete button to the new note
    const header = document.createElement('div');
    header.classList.add('sticky-header');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.innerText = 'X';
    deleteButton.addEventListener('click', () => newNote.remove());
    header.appendChild(deleteButton);
  
    // Adding body to the new note
    const body = document.createElement('div');
    body.classList.add('sticky-body');
    const p = document.createElement('p');
    p.innerText = 'Write your message here...';
    body.appendChild(p);
  
    newNote.appendChild(header);
    newNote.appendChild(body);
  
    document.querySelector('.sticky-notes-container').appendChild(newNote);
  });
  
  // Function to generate random colors for sticky notes
  function getRandomColor() {
    const colors = ['#FFEB3B', '#4CAF50', '#FF9800', '#00BCD4', '#9C27B0', '#3F51B5', '#E91E63'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  