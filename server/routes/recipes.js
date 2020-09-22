const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');

router.get('/all', async(req, res) => {
  try {
    
    const recipes = await Recipe.find().populate('user');

    res.status(200).json(recipes);

  } catch (error) {
    res.status(404).json(error);
  }
});

router.get('/single-recipe/:id', async(req, res) => {
  try {
    const id = req.params.id;

    const recipe = await Recipe.findById(id).populate('user');

    res.status(200).json(recipe);
  } catch (error) {
    res.json(404).json(error);
  }
});

router.post('/:id/new-recipe', async (req, res) => {
  try {
    const userId = req.params.id;

    if(userId == 'undefined') return

    const {title, image, ingredients, description} = req.body;

    const newRecipe = new Recipe({
      title, image, ingredients, description
    });

    const user = await User.findById(userId);

    newRecipe.user = user;

    await newRecipe.save();

    user.recipes.push(newRecipe);

    await user.save();

    res.status(201).json(newRecipe);
  } catch (error) {
    console.log(error);
  }
});

router.put('/update-recipe/:recipeId', async(req, res) => {
  const {recipeId} = req.params;

  const data = {
    title: req.body.title,
    image: req.body.image,
    ingredients: req.body.ingredients,
    description: req.body.description
  }

  const updRecipe = await Recipe.findByIdAndUpdate(recipeId, {$set: data});

  res.json(updRecipe)
});

router.get('/:id/own-recipes', async (req, res) => {
  try {
    const id = req.params.id;

    if(id == 'undefined') return

    const user = await User.findById(id).populate('recipes');

    res.json(user);

  } catch (error) {
    console.log(error);
  }
});

router.delete('/:userId/recipe/:id', async(req, res) => {
  try {
    const {userId, id} = req.params;

    if(userId == 'undefined') return;

    const user = await User.findById(userId);

    await Recipe.findByIdAndDelete(id);

    user.recipes.pull(id);

    await user.save();

    res.status(200).json({msg: 'Recipe sucessfully deleted'});
    
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/recipe/:id/new-comment', async(req, res) => {
  try {
    const {id} = req.params;

    const recipe = await Recipe.findById(id);

    const comment = {
      title: req.body.title,
      message: req.body.message,
      author: req.body.author
    }

    recipe.comments.push(comment);

    await recipe.save();

    res.status(201).json({msg: 'Comment created successfully'});

  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:userId/favorites', async(req, res) => {
  try {
    const {userId} = req.params;

    if(userId == 'undefined') return;

    const user = await User.findById(userId);

    const favorites = user.favorites;

    res.status(200).json(favorites);

  } catch (error) {
    res.json(500).json(error);
  }
});

router.post('/:userId/new-favorite', async (req, res) => {
  try {
    const {userId} = req.params;

    if(userId == 'undefined') return;

    const user = await User.findById(userId);

    const favorite = {
      title: req.body.title,
      image: req.body.image,
      recipeId: req.body.recipeId
    }

    user.favorites.push(favorite);

    await user.save();

    res.status(201).json(favorite);

  } catch (error) {
    
    res.status(500).json(error);

  }
});

module.exports = router;
