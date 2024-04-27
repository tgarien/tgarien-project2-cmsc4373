import { 
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js"

const INVENTORY_COLLECTION = 'inventory';

import { app } from "./firebase_core.js"
import { InventoryItem } from "../model/InventoryItem.js";

const db = getFirestore(app);

export async function addInventoryItem(inventoryItem){
    const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), inventoryItem.toFirestore());
    return docRef.id;
}

export async function getInventoryItemList(uid){
    let itemList = [];
    const q = query(collection(db, INVENTORY_COLLECTION),
        where('uid', '==', uid),
        orderBy('title', 'asc'));
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const t = new InventoryItem(doc.data(), doc.id);
        itemList.push(t);
    });
    return itemList;
}