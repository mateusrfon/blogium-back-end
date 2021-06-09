import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const posts = [
    {
        id: 1,
        title: 'Hello World',
        coverUrl: 'https://miro.medium.com/max/1024/1*OohqW5DGh9CQS4hLY5FXzA.png',
        contentPreview: 'Esta é a estrutura de um post esperado pelo front-end',
        content: 'Este é o conteúdo do post, o que realmente vai aparecer na página do post...',
        commentCount: 2
    }, {
        id: 2,
        title: 'Teste',
        coverUrl: 'https://miro.medium.com/max/1024/1*OohqW5DGh9CQS4hLY5FXzA.png',
        contentPreview: 'Esta é a estrutura de um post esperado pelo front-end',
        content: 'Este é o conteúdo do post, o que realmente vai aparecer na página do post...',
        commentCount: 0
    }
];

const comments = [
    {
        id: 1,
        postId: 1,
        author: 'João',
        content: 'Muito bom esse post! Tá de parabéns'
      }, {
        id: 2,
        postId: 1,
        author: 'Maria',
        content: 'Como faz pra dar palmas?'
      }
];

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
    comments.push(comment);
    res.send(comment);
});

//START
app.listen(4001, () => {
    console.log("On business baby.");
});