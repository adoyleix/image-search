Create a simple responsive website using React.js. The website should display images from a
search term using an image search API of your choice (Getty Images, Unsplash, and Pixabay
are some examples). The site should include one text entry field, a button to request results,
and a results area to display the images in a responsive gallery style of your choice. When
tapping on an image, it should display in a responsive overlay.

Implement a middleware layer in Node.js that obscures any direct interaction with the image API
and prepares data for consumption by the frontend. Please do not use a library or SDK that
encapsulates interaction with the chosen API, as we would like to see you demonstrate how you
would design interaction with an API that is not public.

Finally, design the frontend to use an “endless scroll effect.” Regardless of how the third party
image API is designed, design your middleware layer to be paginated, with subsequent result
pages loaded from your middleware layer as the user scrolls down.

We recommend using Typescript for both the frontend and middleware layer. Make sure to take
into account some error handling, and keep your code clean and organized.

Create a README that documents the assumptions and decisions that you have made in
designing the architecture of your site.

Please host the site on Heroku or another platform of your choice, and send us a Github link or
a zip file of the code when you’re done.