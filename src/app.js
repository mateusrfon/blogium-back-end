import express from "express";
import cors from "cors";
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors());

let posts = [];
let comments = [];

if (fs.existsSync("./server/posts.txt")) {
    posts = JSON.parse(fs.readFileSync('./server/posts.txt'));
};

if (fs.existsSync("./server/comments.txt")) {
    comments = JSON.parse(fs.readFileSync('./server/comments.txt'));
};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.get("/posts/:postId", (req, res) => {
    const id = req.params.postId;
    const post = posts.reduce((acc, e) => e.id === parseInt(id) ? acc = e : acc, {});
    res.send(post);
});

app.post("/posts", (req, res) => {
    const post = { 
        id: posts.length + 1, 
        title: req.body.title,
        coverUrl: req.body.coverUrl,
        contentPreview: (req.body.content.slice(0, 55) + "...").replace("<p>", '').replace("</p>", ''),
        content: req.body.content,
        commentCount: 0
    };
    posts.push(post);
    fs.writeFileSync("./server/posts.txt", JSON.stringify(posts));
    res.send(post);
});

app.get("/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const postComments = comments.filter(e => e.postId === parseInt(id));
    res.send(postComments);
});

app.post("/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const { author, content } = req.body;
    const comment = {
        id: comments.length + 1,
        postId: parseInt(id),
        author,
        content
    };
    posts[parseInt(id) - 1].commentCount = posts[parseInt(id) - 1].commentCount + 1
    comments.push(comment);
    fs.writeFileSync("./server/posts.txt", JSON.stringify(posts));
    fs.writeFileSync("./server/comments.txt", JSON.stringify(comments));
    res.send(comment);
});

app.put("/posts/:id", (req, res) => {
    const postId = req.params.id;
    const { id, title, coverUrl, content, commentCount } = req.body;
    const post = { 
        id,
        title,
        coverUrl,
        contentPreview: (content.slice(0, 55) + "...").replace("<p>", '').replace("</p>", ''),
        content,
        commentCount
    };
    const newPosts = posts.map(e => {
        if (e.id == postId) {
            return post;
        } else {
            return e;
        }
    });
    console.log(newPosts);
    posts = newPosts;
    fs.writeFileSync("./server/posts.txt", JSON.stringify(posts));
    res.send(post);
});

app.delete("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    posts = posts.filter(e => e.id !== id);
    for (let i = id - 1; i < posts.length; i++) {
        posts[i].id = posts[i].id - 1;
    }
    fs.writeFileSync("./server/posts.txt", JSON.stringify(posts));
    res.send('deleted');
});

//START
app.listen(4001, () => {
    console.log("On business baby.");
});