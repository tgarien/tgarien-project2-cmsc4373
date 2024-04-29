import { InventoryItem } from "../model/InventoryItem.js";
import { currentUser } from "./firebase_auth.js";
import { addInventoryItem, deleteInventoryItem, updateInventoryItem } from "./firestore_controller.js";
import { DEV } from "../model/constants.js";
import { buildCard, inventoryItemList, inventoryListView, oldInventoryItemValues, removeFromInventoryList, reorderinventoryList } from "../view/home_page.js";

export async function onSubmitCreateForm(e){
    e.preventDefault();
    const title = (e.target.title.value).toLowerCase();
    const uid = currentUser.uid;
    const quantity = 1; //maybe this needs to be in constructor?
    const timestamp = Date.now();
    const inventoryItem = new InventoryItem({title, uid, quantity, timestamp});

    if(inventoryItemList.find(t=>t.title === title)){
        alert('item already exists, please increase quantity instead.')
        return;  
    } 

    const buttonLabel = e.submitter.innerHTML;
    e.submitter.disabled = true;
    e.submitter.innerHTML = 'Wait...';

    let docId;
    try {
        docId = await addInventoryItem(inventoryItem);
        inventoryItem.set_docId(docId);
        inventoryItemList.splice(0,0,inventoryItem);
        oldInventoryItemValues.splice(0,0,new InventoryItem({title, uid, quantity, timestamp},docId));
        e.target.title.value = ''; 
    }catch(e){
        if(DEV) console.log('failed to create: ', e);
        alert('Failed to create:' + JSON.stringify(e));
        
        e.submitter.innerHTML = buttonLabel;
        e.submitter.disabled = false;
        return;
    }
    
    e.submitter.innerHTML = buttonLabel;
    e.submitter.disabled = false;
    reorderinventoryList();
    inventoryListView();

    // const container = document.getElementById('inventory-container');
    // container.prepend(buildCard(inventoryItem));
    // //this should just call inventory listview()
    // e.target.title.value = '';

}

export function onClickMinus(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID); //make a copy of OG value for cancel?
    
    if(item.quantity == 0){
        alert('Cannot reduce Item Count below zero')
    }else{
        item.quantity--;
    }
    inventoryListView();
}

export function onClickPlus(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID);
    item.quantity++;
    inventoryListView();
}

export function onClickCancel(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID);
    var olditem = oldInventoryItemValues.find(t=>t.docId === inventoryitemID);

    item.quantity = olditem.quantity;
    //revert to saved value
    inventoryListView();
    console.log(item);
}

export async function onClickUpdate(e){
    var inventoryitemID = e.target.parentElement.parentElement.id;
    var item = inventoryItemList.find(t=>t.docId === inventoryitemID);
    var olditem = oldInventoryItemValues.find(t=>t.docId === inventoryitemID);

    if(item.quantity == 0){
        if(confirm('Are you sure you want to delete this item?')){
            console.log('deleted');
            try{
                await deleteInventoryItem(item.docId);
                removeFromInventoryList(item);
            }catch (e){
                if (DEV) console.log('Failed to delete: ', e);
                alert('Failed to delete Item' + JSON.stringify(e));
            }
        }else{
            if (DEV) console.log('cancelled');
            return;
        }
        
    }else{
        
        try{
            await updateInventoryItem(item.docId,{
                quantity: item.quantity,
            });
            olditem.quantity = item.quantity;
            alert('Quantity updated!')
        }catch(e){
            if (DEV) console.log('update error', e);
            alert('Update error: ' + JSON.stringify(e));
            return;
        }
        // update item in olditem array
        //save to firebase
    }
    inventoryListView();
}