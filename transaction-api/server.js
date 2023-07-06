const express = require("express");
const app = express();
const port = 4000;
const transactions = require("./transactions");


app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json());

function getNextIdFromCollection(collection) {
  if(collection.length === 0) return 1; 
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}
app.get("/", (req, res) => {
  res.send("Welcome to Budget Tracker transactions API!");
});

app.get("/transactions", (req, res) => {
  res.send(transactions);
});

app.get("/transactions/:id", (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const transaction = transactions.find((transaction) => transaction.id === transactionId);
  if(transaction){
    res.send(transaction);
  } else {
    res.status(404).send({message: "No such transaction"});
  }
});

app.post("/transactions", (req, res) => {
  const newTransaction = {
    ...req.body,
    id: getNextIdFromCollection(transactions)
  };
  console.log("newTransaction", newTransaction);
  transactions.push(newTransaction);
  res.status(201).send(newTransaction);
});

app.patch("/transactions/:id", (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const transactionUpdate = req.body;
  const transacionIndex = transactions.findIndex(transaction => transaction.id === transactionId);
  const updatedTransaction = {...transactions[transacionIndex], ...transactionUpdate};
  if (transacionIndex !== -1) {
    transactions[transacionIndex] = updatedTransaction;
    res.send(updatedTransaction);  
  } else {
    res.status(404).send({ message: "Job not found" });
  }
});

app.delete("/transactions/:id", (req, res) =>{
  const transactionId = parseInt(req.params.id, 10);
  const transactionIndex = transactions.findIndex(transaction => transaction.id == transactionId);
  if (transactionIndex !== -1) {
    transactions.splice(transactionIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send({ message: "Transaction not found"});

  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});