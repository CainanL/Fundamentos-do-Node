const { json, request, response } = require('express');
const express = require('express');
const {v4: uuidv4} = require('uuid');

const app = express();
app.use(express.json())

const customers = [];

function verifyIfExistAccount(request, response, next){

    const {cpf} = request.headers;

    const customer = customers.find(customer => customer.cpf = cpf);
    if(!customer) return response.status(404).json({error: 'Customer not found'});

    request.customer = customer;

    return next();
}

function getBalance(statemant){
    const balance = statemant.reduce((acumulador, operation)=>{
        if(operation === 'credit'){
            return acumulador + operation.amount;
        }else{
            return acumulador - operation.amount;
        }
    }, 0)
    return balance;
}

app.post('/account', (request, response)=>{
    const {cpf, name} = request.body;

    const costumerAlreadExists = customers.some(customer => customer.cpf == cpf);
    if(costumerAlreadExists) return response.status(400).json({error: 'CustomerAlreadExists'});

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statiment: []
    })

    return response.status(201).send();
})

app.get('/statement', verifyIfExistAccount, (request, response)=>{

    const {customer} = request;

    return response.json(customer.statiment);

})

app.post('/deposit', verifyIfExistAccount, (request, response)=>{
    const {description, amount} = request.body;

    const {customer} = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    }

    customer.statiment.push(statementOperation);
    return response.status(201).send();
})

app.post('/withdraw', verifyIfExistAccount, (request, response)=>{
    const {amount} = request.body;
    const {customer}  = request;

    const balance = getBalance(customers, amount);

    if(balance < amount) return response.status(400).json({error: 'insuficient found'});

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
    }

    customer.statiment.push(statementOperation);

    return response.status(201).send();
    
})

app.get('/statement/date', verifyIfExistAccount, (request, response)=>{

    const {customer} = request;
    const {date} = request.query;
    console.log(customer)

    const dateFormat = new Date(date + "00:00");

    const statement = customer.statiment.filter(statement => statement.created_at.toDateString() === new Date(dateFormat.toDateString()));

    return response.json(customer.statiment);

})

app.put('/account', verifyIfExistAccount, (request, response)=>{
    const {name} = request.body;
    const {customer} = request;
    
    customer.name = name;

    return response.status(201).send();

})

app.delete('/account', verifyIfExistAccount, (request, response)=>{
    const {customer} = request;

    customers.splice(customer, 1);
    return response.status(204).json(customers);
})

app.listen(3333, ()=>{
    console.log('App runing');
})