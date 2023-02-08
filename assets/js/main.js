'use strict'

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));


const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client);
    setLocalStorage(dbClient);
}

const readClient = () => getLocalStorage();

const updateCliente = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

//
const openModal = () => document.getElementById('modal')
    .classList.add('active')

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '');
}

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active')
    
    
}
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

const saveClient = () => {
    if (isValidFields()){
        const client = {
            nome: document.getElementById('name').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('phone').value,
            cidade: document.getElementById('city').value
        }
        const index = document.getElementById('name').dataset.index;
        if (index == 'new') {
            createClient(client);
        }else{
            updateCliente(index, client);
        }
        clearFields();
        closeModal();
        updateTable();
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
}

const fillFields = (client) => {
    document.getElementById('name').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('phone').value = client.celular;
    document.getElementById('city').value = client.cidade;
    document.getElementById('name').dataset.index = client.index;
} 

const editClient = (index) => {
    const client = readClient()[index];
    client.index = index
    fillFields(client);
    document.querySelector('.modal-header>h2').innerHTML = 'Editar cliente';
    openModal();
}

const editDelete = (event) => {
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editClient(index)
        }else if (action == 'delete') {
            const client = readClient()[index];
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`);
            if (response){
                deleteClient(index);
            updateTable();
            }
        }
    }
}

updateTable();

//Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', () => {
        document.querySelector('.modal-header>h2').innerHTML = 'Novo cliente';
        openModal();
    });

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('save')
    .addEventListener('click', saveClient);

document.getElementById('cancel')
    .addEventListener('click', closeModal);

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)    