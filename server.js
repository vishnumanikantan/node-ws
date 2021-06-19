const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const Books = require("./models/Books");

// var books = [{name: "Book1", author: "Author1", pages: 300}];

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connect to mongoose
mongoose.connect('mongodb://localhost/booksdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
    console.log("Mongoose connected");
}).catch(err=>{
    console.log(err);
});

const addBook = (bookData)=>{
    return new Promise((resolve, reject)=>{
        let newBook = new Books(bookData);
        newBook.save().then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}

const getBooks = ()=>{
    return new Promise((resolve,reject)=>{
        Books.find().then((results)=>{
            resolve(results);
        }).catch(err=>{
            reject(err);
        });
    })
}

const updateBook = (id, updateDoc)=>{
    return new Promise((resolve,reject)=>{
        Books.updateOne({_id: id},updateDoc,{new:true},(err,result)=>{
            if(err)
                reject(err);
            resolve(result);
        })
    })
}

app.get("/books", async (req,res)=>{ // sending book data
    let results;
    try {
        results = await getBooks();
        return res.json({success: true, results});
    } catch (error) {
        return res.json({success: false, error});
    }
});

app.post("/books", async (req,res)=>{
    let bookData = req.body.bookData;
    bookData.timeStamp = Date.now();
    // books.push(bookData);
    let result;
    try {
        result = await addBook(bookData);
        return res.json({success: true, message: "BOOK_CREATED", result});
    } catch (error) {
        res.statusCode = 500;
        return res.json({success: false, error});
    }
    
});

app.put("/books/:id", async (req, res)=>{
    let bookId = req.params.id;
    let updateDoc = req.body.updateDoc;
    let results;
    try {
        results = await updateBook(bookId, updateDoc);
        return res.json({success: true, message: "BOOK_UPDATED", results});
    } catch (error) {
        res.statusCode = 500;
        return res.json({success: false, error});
    }
})




app.listen(3000, ()=>{
    console.log("Server started at port 3000");
});