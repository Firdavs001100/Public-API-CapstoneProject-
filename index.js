import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/search", async (req, res) => {
    const name = req.body.searchName;
    try {
        const response = await axios.get(API_URL + `/search.php?s=${name}`);
        const result = response.data;
        const ingredients = [];

        for (let i = 1; i <= 15; i++) {
            const ingredient = result.drinks[0][`strIngredient${i}`];
            if (ingredient) {
                ingredients.push(ingredient);
            }
        }

        res.render("cocktailPage.ejs", {
            drink: result.drinks[0],
            ingredients: ingredients,
        });
    } catch (error) {
        console.error("The request was failed", error.message);
        res.render("index.ejs", {
            error: "Something went wrong! Please try again later.",
        });
    }
});

app.get("/random", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/random.php");
        const result = response.data;

        const ingredients = [];

        for (let i = 1; i <= 15; i++) {
            const ingredient = result.drinks[0][`strIngredient${i}`];
            if (ingredient) {
                ingredients.push(ingredient);
            }
        }

        res.render("cocktailPage.ejs", {
            drink: result.drinks[0],
            ingredients: ingredients,
        });
    } catch (error) {
        console.error("The request was failed", error.message);
        res.render("index.ejs", {
            error: "Something went wrong! Please try again later.",
        });
    }
});


app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});