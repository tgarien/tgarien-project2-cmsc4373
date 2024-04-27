export class InventoryItem{
    constructor(data,docId){
        this.title = data.title;
        this.uid = data.uid;
        this.quantity = data.quantity; // perhaps we init this to 1?
        this.timestamp = data.timestamp;
        this.docId = docId;
    }

    set_docId(id){
        this.docId = id;
    }

    toFirestore(){
        return {
            title: this.title,
            uid: this.uid,
            quantity: this.quantity,
            timestamp: this.timestamp,
        }
    }
}