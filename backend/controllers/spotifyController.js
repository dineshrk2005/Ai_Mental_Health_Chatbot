const axios = require('axios');
let spotifyTokens = {
    accessToken: null,
    expiresAt: null
};

exports.getSpotifyToken = async () => {
    if (spotifyTokens.accessToken && Date.now() < spotifyTokens.expiresAt) {
        return spotifyTokens.accessToken;
    }

    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        spotifyTokens.accessToken = response.data.access_token;
        spotifyTokens.expiresAt = Date.now() + (response.data.expires_in * 1000) - 60000;
        return spotifyTokens.accessToken;
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
        throw new Error('Failed to authenticate with Spotify');
    }
};

exports.searchTracks = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter q is required' });
        }
        
        const token = await this.getSpotifyToken();
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        res.json(response.data.tracks.items);
    } catch (error) {
        console.error('Error searching Spotify tracks:', error);
        res.status(500).json({ error: 'Failed to search tracks' });
    }
};
