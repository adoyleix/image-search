import React, { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { ImageList } from "@mui/material";
import { ImageListItem } from "@mui/material";
import getPhotos from "./middleware/ApiRequest";
import { getDefaults } from "./middleware/ApiRequest";

var defaults;
var hasDefaultsLoaded = false;
var pageCount = 1;
var rendered: Image[] = [];
var previousSearch = "";
var bottomed = true;
var query = "";

//Class to easily handle all Images
class Image {
  url: string;
  id: string;
  description: string;

  constructor(id: string, url: string, description: string) {
    this.id = id;
    this.url = url;
    this.description = description;
  }
}

//Loads in the images for the landing page, 10 random pictures
async function loadDefaults() {
  defaults = [];
  let imageList = [];
  try {
    await Promise.resolve(getDefaults()).then((value) => (imageList = value)); //API Call for images

    //Format API response into Image Objects 
    for (let i = 0; i < 10; i++) {
      let temp = new Image(
        imageList[i]["id"],
        imageList[i]["urls"]["small"],
        imageList[i]["alt_description"]
      );
      defaults.push(temp); //Push Images to array
    }
  } catch (err) {
    console.error(err);
  }
}

//Loads in searched images when button is pressed
async function searchButton(searchString) {
  rendered = [];
  let imageList = [];
  try {
    await Promise.resolve(getPhotos(searchString, 1)).then( //API Call
      (value) => (imageList = value["photos"]["results"])
    );
  } catch (err) {
    console.error(err);
  }
  for (let i = 0; i < 20; i++) {
    let temp = new Image(
      imageList[i]["id"],
      imageList[i]["urls"]["small"],
      imageList[i]["alt_description"]
    );
    rendered.push(temp);
  }
  pageCount = 2;
}

//Loads in additional pages of results on the Infinite Scroll process
async function searchMore(searchString) {
  let imageList = [];
  try {
    await Promise.resolve(getPhotos(searchString, pageCount)).then(
      (value) => (imageList = value["photos"]["results"])
    );
    for (let i = 0; i < 10; i++) {
      if (!rendered.includes(imageList[i]["id]"])) {
        let temp = new Image(
          imageList[i]["id"],
          imageList[i]["urls"]["small"],
          imageList[i]["alt_description"]
        );
        rendered.push(temp);
      }
    }
    pageCount++;
  } catch (err) {
    console.error(err);
  }
}

//Creates the gallery grid
export function DrawGrid(imageList) {
  const [focusImage, setFocusImage] = useState<Image>(undefined!); //prototype for when an image gets focused
  const [show, setShow] = useState(false);

  useEffect(() => {
    setFocusImage(focusImage);
  }, [focusImage]);

  useEffect(() => {
    setShow(show);
  }, [show]);

  function imageClick(e) { //click handler for individual images
    let imgSrc = e.target.src; //pulls the url from the iamge clicked
    let focusedImage;
    focusedImage = rendered.find(({ url }) => url === imgSrc); //finds the Image object associated with the url
    setFocusImage(focusedImage);
    setShow(true);
  }

  return (
    <div>
      <div>
        <FocusOverlay show={show} img={focusImage} />
      </div>
      <ImageList // Material UI image grid 
        sx={{ width: 0.99, overflow: "hidden" }}
        cols={5}
        rowHeight={"auto"}
      >
        {imageList.map((item) => (
          <ImageListItem key={item.id}>
            <img
              className="image"
              src={item.url}
              alt={item.description}
              loading="lazy"
              onClick={imageClick}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

//The overlay for focused image
export function FocusOverlay(props) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [focus, setFocus] = useState<Image>();

  useEffect(() => {
    setShowOverlay(showOverlay);
  }, [showOverlay]);

  useEffect(() => {
    if (props.img !== focus) { //bugfix of overlay popping up on infinite scroll
      setFocus(props.img);
      setShowOverlay(props.show);
    }
  }, [props]);

  function handleClick() {
    setShowOverlay(false);
  }

  if (showOverlay) {
    return (
      <div id="focusWrapper">
        <Button id="closeButton" onClick={handleClick}>
          X
        </Button>
        <img id="focusedImg" src={props.img.url} alt={props.img.description} />
        <a id="focusedLink" href={props.img.url}>
          {props.img.description}
        </a>
      </div>
    );
  } else {
    return <div></div>;
  }
}

//Primary React Component
export function SearchBar() {
  const [searchString, setSearchString] = useState("");
  const [disableSearch, setDisableSearch] = useState(true);
  const [gridImages, setGridImages] = useState(rendered);

  useEffect(() => {
    if (rendered.length > 0) {
      setGridImages(rendered);
    }
    if (!hasDefaultsLoaded) {
      hasDefaultsLoaded = true;
      thedefaults();
    }
  }, [gridImages]);

  const thedefaults = async () => { //loads in the defaults
    await loadDefaults();
    setGridImages(defaults);
  };

  const handleChange = ({ target }) => { //TextField change handle
    if (target.value.length === 0 || target.value === previousSearch) { //disables button if the search string hasn't changed
      setDisableSearch(true);
    } else {
      setDisableSearch(false);
    }
    setSearchString(target.value);
  };

    //submit button funciton
  const submit = async () => {
    window.scrollTo(0, 0);
    var x = [];
    setGridImages(x);
    rendered = [];
    await searchButton(searchString);
    query = searchString;
    setGridImages(rendered);
    previousSearch = searchString;
    setDisableSearch(true);
    bottomed = false;
  };

    //loads additional pages of images
  const loadMore = async (search) => {
    if (query === previousSearch && rendered.length > 0) {
      await searchMore(search);

      setGridImages([]);
      setGridImages(rendered);
      bottomed = false;
    }
  };

    //infinite scroll handler
  async function handleScroll() {
    if (
      (window.scrollY + window.innerHeight) * 1.05 >=
        document.documentElement.scrollHeight &&
      !bottomed
    ) {
      bottomed = true;
      await loadMore(query);
    }
  }
  window.addEventListener("scroll", handleScroll);

  return (
    <div id="page">
      <div id="header">
        <div id="searchBox">
          <TextField
            id="imgSearch"
            autoComplete="off"
            label="Search for Images"
            variant="standard"
            onChange={handleChange}
            onKeyDown={(e) => (e.key === "Enter" ? submit() : null)}
          />
          <Button
            type="submit"
            variant="contained"
            id="searchButton"
            disabled={disableSearch}
            onClick={() => submit()}
          >
            Search
          </Button>
        </div>
      </div>
      <div id="grid">{DrawGrid(gridImages)}</div>
    </div>
  );
}

function App() {
  return (
    <div id="searchBar">
      <SearchBar />
    </div>
  );
}

export default App;
