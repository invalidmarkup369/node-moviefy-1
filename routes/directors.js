const express = require("express");
const router = express.Router();
const Director = require("../dbModels/director.js");
const Movie = require("../dbModels/movie.js");

//All Directors Route
router.get("/", async function(req,res){
  let searchOptions = {}
  if(req.query.name != null && req.query.name !== ""){
    searchOptions.name = new RegExp(req.query.name,"i")
  }
  try{
    const directors = await Director.find(searchOptions);
    res.render("directors/index",{
      directors: directors,
      searchOptions:req.query
    });
  } catch {
    res.redirect("/");
  }
});

//New Director Route
router.get("/new",function(req,res){
  res.render("directors/new",{director: new Director()});
});

//Create Director Route
router.post("/",async function(req,res){
  const director = new Director({
    name:req.body.name
  })
  try{
    const newDirector = await director.save();
    res.redirect(`directors/${newDirector.id}`);
  } catch {
      let locals ={errorMsg:"Error creating Director"};
        res.render("directors/new",{
        director:director,
        locals
      })
  }

});

router.get("/:id",async (req,res) => {
  try {
    const director = await Director.findById(req.params.id);
    const movies = await Movie.find({ director: director.id}).limit(9).exec();
    res.render("directors/show",{
      director: director,
      moviesByDirector: movies
    })
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit",async (req,res) => {
try{
  const director = await Director.findById(req.params.id);
  res.render("directors/edit",{director: director});
} catch{
  res.redirect("/directors");
}

});

router.put("/:id", async (req,res) => {
  let director;
  try{
    director = await Director.findById(req.params.id);
    director.name = req.body.name;
    await director.save();
    res.redirect(`/directors/${director.id}`);

  } catch {
    if(director == null){
      res.redirect("/")
    } else {
      let locals ={errorMsg:"Error updating Director"};
        res.render("directors/edit",{
        director:director,
        locals
      })
    }
  }
});

router.delete("/:id" , async (req,res) =>{
  let director;
  try{
    director = await Director.findById(req.params.id);
    await director.remove();
    res.redirect("/directors");
} catch {
    if(director == null){
      res.redirect("/")
    } else {
      res.redirect(`/directors/${director.id}`)
    }
  }
});

module.exports = router;
