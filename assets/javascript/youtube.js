
const APIcall = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyA9-TXa_91iEi2zP33Zkk3Jx3vfEfjUP9w&part=snippet&playlistId=PLUwwFJrNSNnDZZZXTQkf6cH9g2FBo16d1&maxResults=50";

class Youtube{
    constructor(apiKey){
        this.apiKey = APIcall;
    }

    async getPlaylist(){
        const response = await fetch(this.apiKey);
        const videos = await response.json();
        return await videos;
    }

    async prepareInfo(){
        const playlistObject = await this.getPlaylist();
        const result = [];
    
        for (const item of await playlistObject.items) {
            const title = item.snippet.title;
            const thumbnailUrl = item.snippet.thumbnails.high.url;
            const videoID = item.snippet.resourceId.videoId;
            result.push({ title, thumbnailUrl,videoID });
        }
    
        return result;
    }
}

export default Youtube;