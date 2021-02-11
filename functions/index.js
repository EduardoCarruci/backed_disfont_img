const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
var serviceAccount = require("./permissions.json");
app.use(cors({ origin: true }));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-api-9a206..firebaseio.com"
});

const db = admin.firestore();



// OBTENER TODAS LAS CATEGORIAS REGISTRADAS
app.get('/api/categorias', (req, res) => {
    (async () => {
        try {
            let query = db.collection('categorias');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        nombre: doc.data().nombre,
                        urlFoto: doc.data().urlFoto,
                    };
                    response.push(selectedItem);
                }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
// OBTENER TODAS LAS PROVEEDORES REGISTRADAS
app.get('/api/proveedor', (req, res) => {
    (async () => {
        try {
            let query = db.collection('proveedor');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        nombre: doc.data().nombre,

                    };
                    response.push(selectedItem);
                }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/proveedor/:id', (req, res) => {
    (async () => {
        try {
            let response = [];
            const query = db.collection('usuario_fotos').doc(req.params.id).collection("productos");


            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        imagen: doc.data().imagen,
                        idProducto: doc.data().idProducto,
                        idCategoria: doc.data().idCategoria,
                        estilo: doc.data().estilo,


                    };
                    response.push(selectedItem);
                }
            });
            return res.status(200).send(response);


        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/proveedor/:proveedorID/producto/:productoID', (req, res) => {
    (async () => {
        try {

            const query = db.collection('usuario_fotos').doc(req.params.proveedorID)
                .collection("productos").doc(req.params.productoID);
            console.log(req.params.proveedorID);
            console.log(req.params.productoID);

            let item = await query.get();
            let respuesta = item.data();
            return res.status(200).send(respuesta);



        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});






exports.app = functions.https.onRequest(app);