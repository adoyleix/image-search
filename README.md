# image-search

Simple Image Search TS-React webapp using the Unsplash API.

App can be built with `npm start` in `image-search` folder

Requires Unsplash API key, a public one is provided for Heroku Use.

Images are displayed in pages of responsive columns, 5 across, 4 down.
Scrolling to the bottom triggers the next page to load in automatically.
Images are able to be clicked on to provided an enhanced view of the image, along with the image's description and link to the source at the bottom.

Front/Landing page loads 10 random images from the Unsplash API, not able to use the Overlay at this time.

Current known issue: After closing out of an image's overlay you can't re-enter the same image's overlay. 
No other known issues.