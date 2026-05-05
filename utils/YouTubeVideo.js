class YoutubeVideo{
    constructor(data){

        if (!data) {
            
            throw new Error(`Can not initiate ${this.constructor.name} without data`);
        }

        this.title = data.title || "sem titulo";
        this.chapters = data.chapters || [];
        this.durationInSec = (data.duration < 0 ? 0 : data.duration) || 0;
        this.durationRaw = data.duration_raw || '0:00';
        this.type = 'video';
        this.id = data.id || undefined;
        this.url = `https://www.youtube.com/watch?v=${this.id}`;
        this.music = data.music || [];
    } 

    toJSON() {
        return {
            id: this.id,
            url: this.url,
            durationInSec: this.durationInSec,
            durationRaw: this.durationRaw,
            music: this.music,
            chapters: this.chapters
        };
    }

    toString(){
        return this.url || '';
    }
}
module.exports= YoutubeVideo;