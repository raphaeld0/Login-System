const express = require("express");
const User = require("../models/userModel");
const app = express();
const port = 8080;
const session = require("express-session");

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.set("view engine", "ejs");
app.set("views", "src/views");

// middleware
app.use(express.urlencoded({ extended: true }));

app.use("/styles", express.static("src/views/styles"));
app.use(express.json());

function isAuthenticated(req, res, next) {
    if (req.session && req.session.username) {
        return next(); 
    }
    res.redirect("/view/login"); 
}

// post register
app.post("/view/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Erro: Email já registrado.");
            return res.send(`
                <script>
                    alert("Erro: Email já registrado.");
                    window.location.href = "/view/register";
                </script>
            `);
        }

        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save(); 
        console.log("Usuário registrado com sucesso:", newUser);

        req.session.username = username;
        
        res.redirect("/view/login");
    } catch (error) {
        console.error("Erro ao processar o registro:", error);
        res.status(500).send("Erro ao registrar usuário.");
    }
});

// post do login
app.post("/view/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ve se o email existe na database
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Erro: Email não encontrado.");
            return res.send(`
                <script>
                    alert("Erro: Email não encontrado.");
                    window.location.href = "/view/login";
                </script>
            `);
        }

        // verifica se a senha ta certa baseada no email
        if (user.password !== password) {
            console.log("Erro: Senha incorreta.");
            return res.send(`
                <script>
                    alert("Erro: A senha está incorreta.");
                    window.location.href = "/view/login";
                </script>
            `);
        }

        //guarda o nome de username pro home page dps
        req.session.username = user.username;

        console.log("Login bem-sucedido:", user.username);

        // vai pra homepage
        res.redirect("/view/home");
    } catch (error) {
        console.error("Erro ao processar o login:", error);
        res.status(500).send("Erro ao processar o login.");
    }
});

//get do homepage

app.get("/view/home", isAuthenticated, async (req, res) => {
    try {
        const loggedInUser = { username: req.session.username };

        const users = await User.find();

        res.render("homePage", { username: loggedInUser.username, users });
    } catch (error) {
        console.error("Erro ao carregar a página inicial:", error);
        res.status(500).send("Erro ao carregar a página inicial.");
    }
});


//delete do homepage
app.delete("/view/home", async (req, res) => {
    try {
        const { email } = req.body;//pega o JSON transformado no front

        console.log("Email recebido:", email);

        if (!email) {
            return res.status(400).send("Erro: Email não fornecido.");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("Erro: Usuário não encontrado.");
        }

        await User.deleteOne({ email });

        res.status(200).send("Usuário deletado com sucesso.");
    } catch (error) {
        res.status(500).send("Erro ao deletar o usuário.");
    }
});

// get pra pagina de register
app.get("/view/register", async (req, res) => {
    res.render("registerPage");
});

// get pro login
app.get("/view/login", async (req, res) => {
    res.render("loginPage");
});

app.listen(port, () => {
    console.log(`Servidor rodando em localhost:${port}`);
});