import { InventoryItem } from "../model/InventoryItem.js";
import { currentUser } from "./firebase_auth.js";
import { addInventoryItem } from "./firestore_controller.js";
import { DEV } from "../model/constants.js";
import { buildCard, inventoryItemList } from "../view/home_page.js";

export async function onSubmitCreateForm(e){
    e.preventDefault();
    const title = (e.target.title.value).toLowerCase();
    const uid = currentUser.uid;
    const quantity = 1; //maybe this needs to be in constructor?
    const timestamp = Date.now();
    const inventoryItem = new InventoryItem({title, uid, quantity, timestamp});

    const buttonLabel = e.submitter.innerHTML;
    e.submitter.disabled = true;
    e.submitter.innerHTML = 'Wait...';

    let docId;
    try {
        docId = await addInventoryItem(inventoryItem);
        inventoryItem.set_docId(docId);
    }catch(e){
        if(DEV) console.log('failed to create: ', e);
        alert('Failed to create:' + JSON.stringify(e));
        
        e.submitter.innerHTML = buttonLabel;
        e.submitter.disabled = false;
        return;
    }
    
    e.submitter.innerHTML = buttonLabel;
    e.submitter.disabled = false;

    const container = document.getElementById('inventory-container');
    container.prepend(buildCard(inventoryItem));
    e.target.title.value = '';

}

export function onClickMinus(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID); //make a copy of OG value for cancel?
    item.quantity--;
    console.log(item);
}

export function onClickPlus(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID);
    item.quantity++;
    console.log(item);
}

export function onClickCancel(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID);
    console.log(item);
}

export function onClickUpdate(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID);
    console.log(item);
}