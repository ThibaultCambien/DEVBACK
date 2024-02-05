const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');


const uri = "mongodb+srv://Thibault:123@cluster.gnvfxsb.mongodb.net/?retryWrites=true&w=majority"
const app = express()
app.use(bodyParser.json());
const port = 3000;

app.use((req,res,next) =>{
    console.log(`Requete reçues : ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
})
const client = new MongoClient(uri);

client.connect(err => {
    if (err){
        console.log("Erreur à la connection à la base de données")
    } else {
        console.log("Connexion réussie")
    }
});

app.post('/utilisateurs',(request,response)=>{
    const {nom,prenom,age,ville} = request.body;

    if(!nom || !prenom || !age || !ville ){
        return response.status(400).json({erreur : "Veuillez fournir un nom, prenom, age et une ville"})
    }

    const nouvelUtilisateur = {nom, prenom, age, ville};
    const collection = client.db("MyDb").collection("utilisateurs");
    try {
        const result = collection.insertOne(nouvelUtilisateur);
        console.log("utilisateur ajouté avec succès");
        response.status(201).json(nouvelUtilisateur)
    }
    catch (error){
        console.error("Erreur lors de l'ajout de l'utilisateur")
        response.status(500).json({erreur : "Erreur lors de l'ajout de l'utilisateurs"});

    }
});

app.get('/utilisateurs',(request,response)=>{
    const collection = client.db("MyDb").collection("utilisateurs");
    collection.find().toArray((err,utilisateurs)=>{
        if (err){
            console.error('Erreur lors de la recherche des utilisateurs : ',error);
            response.status(500).send("Erreur interne du serveur")

        }
        else {
            response.json(utilisateurs);
        }
    });
});

app.listen(port, ()=>{
    console.log(`Serveur en cours d'excution sur le port : ${port}`)
})

