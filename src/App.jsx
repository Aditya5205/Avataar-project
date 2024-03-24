import Navbar from "./components/Navbar/Navbar.jsx";
import Carousel from "./components/Carousel/Carousel.jsx";
import { slides } from "./assets/Carousel/carouselData.json";
import "../src/App.css";

function App() {
  const NAVBAR_ITEMS = [
    "Home",
    "Electronics",
    "Books",
    "Music",
    "Movies",
    "Clothes",
    "Games",
    "Furniture",
    "Travel",
    "Botanical",
    "Shop",
  ];

  return (
    <>
      <Navbar data={NAVBAR_ITEMS} />
      <div className="carousel-component-container">
        <Carousel visibleItemsCount={3}>
          {slides.map((item, i) => (
            <img
              className="images"
              src={item.src}
              alt={item.alt}
              key={i}
              id={`img-${i}`}
            />
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default App;
