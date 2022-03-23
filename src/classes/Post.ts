export type Privacity = 'private' | 'public';

const generateId = function idGenerator(userId: string):string {
    const id = `${Math.random().toString(36).substring(8)}-${Math.random().toString(36).substring(8)}-${Math.random().toString(36).substring(8)}`;
    return id;
}

export default class Post {
    id: string = generateId(this.userId);
    
    constructor(public userId: string, public postHeader: string, public postContent: string, public postPrivacity: Privacity) {}

    setPostHeader(newPostHeader: string) {
        this.postHeader = newPostHeader;
    }
    setPostContent(newPostContent: string) {
        this.postContent = newPostContent;
    }
    setPrivacity(newPrivacity: Privacity) {
        this.postPrivacity = newPrivacity;
    }
}