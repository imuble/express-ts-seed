
class ModelCache<T> {

    private deleteQueue: string[];
    private cache: { [index: string]: T };
    private maximumEntries: number;
    private deleteBulk: number;

    constructor(maximumEntries: number = 1000, deleteBulk: number = 25) {
        this.cache = {};
        this.maximumEntries = maximumEntries;
        this.deleteBulk = deleteBulk;
    }

    get(id: string): T | undefined {
        return this.cache[id];
        
    }
    put(id: string, model: T) {
        const exists = (this.get(id)) ? true : false;
        if (exists) {
            this.deleteQueue.splice(this.deleteQueue.indexOf(id), 1);
            this.deleteQueue.push(id);
        }
        this.cache[id] = model;
        if (this.deleteQueue.length > this.maximumEntries) {
            const idsToDelete = this.deleteQueue.splice(0, this.deleteBulk);
            idsToDelete.forEach((id: string) => { delete this.cache[id] });
        }
    }
}

export default ModelCache;