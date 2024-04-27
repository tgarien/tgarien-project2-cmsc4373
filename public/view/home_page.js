import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./protected_view.js";
import { onSubmitCreateForm } from "../controller/home_controller.js";
import { DEV } from "../model/constants.js";
import { getInventoryItemList } from "../controller/firestore_controller.js";

export async function homePageView(){
    if(!currentUser){
        root.innerHTML = await protectedView();
        return;
    }

    const response = await fetch('/view/templates/home_page_template.html',
        {cache: 'no-store'});
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4','p-4')

    const form = divWrapper.querySelector('form');
    form.onsubmit = onSubmitCreateForm;

    root.innerHTML = '';
    root.appendChild(divWrapper);

    /// read all existing titles
    let inventoryItemList;
    try {
        inventoryItemList = await getInventoryItemList(currentUser.uid);
    } catch (e) {
        if (DEV) console.log('failed to get title list', e);
        alert('Failed to get title list: ' + JSON.stringify(e));
        return;
    }

    if(inventoryItemList.length == 0){
        homeRoot.innerHTML = '<h2>No Inventory Items have been added!</h2>';
        return;
    }

    const container = divWrapper.querySelector('#inventory-container');
    inventoryItemList.forEach(title => {
        container.appendChild(buildCard(title));
    });


}

export function buildCard(inventoryItem) {
    const div = document.createElement('div');
    div.classList.add('card', 'd-inline-block');
    div.style = "width: 25rem;";
    div.innerHTML = `
        <div id="${inventoryItem.docId}" class="card-body">
            <span class="fs-3 card-title">${inventoryItem.title}</span><br>
            <span>
                <button name="minus" class="btn btn-outline-danger">-</button>
                ${inventoryItem.quantity}
                <button name="plus" class="btn btn-outline-primary">+</button>
                <button name="update" class="ms-3 btn btn-outline-primary">Update</button>
                <button name="cancel" class="btn btn-outline-secondary">Cancel</button>
            </span>
        </div>
    `;
    const Buttons = div.querySelectorAll('button');
    
    return div;
}