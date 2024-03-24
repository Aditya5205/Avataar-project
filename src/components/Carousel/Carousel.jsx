import { Children, useMemo, useEffect, useRef, useState } from "react";
import "../../styles/Carousel.css";

const Carousel = ({ children, visibleItemsCount = 3 }) => {
  const originalItemsLength = useMemo(
    () => Children.count(children),
    [children]
  );

  const indicatorContainerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(visibleItemsCount);

  const [isTransitionEnabled, setTransitionEnabled] = useState(true);

  const [timeoutInProgress, setTimeoutInProgress] = useState(false);

  useEffect(() => {
    if (
      currentIndex === visibleItemsCount ||
      currentIndex === originalItemsLength
    ) {
      setTransitionEnabled(true);
    }
  }, [currentIndex, visibleItemsCount, originalItemsLength]);

  useEffect(() => {
    const active = indicatorContainerRef.current?.querySelector(".dots-active");
    if (active) {
      let index = active.getAttribute("data-index");
      if (index !== null && indicatorContainerRef.current?.scrollTo) {
        indicatorContainerRef.current?.scrollTo({
          left: ((Number(index) - 2) / 5) * 50,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  const nextItem = () => {
    const isOnEdgeForward = currentIndex > originalItemsLength;
    if (isOnEdgeForward) {
      setTimeoutInProgress(true);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const previousItem = () => {
    const isOnEdgeBack = true
      ? currentIndex <= visibleItemsCount
      : currentIndex === 0;

    if (isOnEdgeBack) {
      setTimeoutInProgress(true);
    }

    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      setTransitionEnabled(false);
      setCurrentIndex(originalItemsLength);
    } else if (currentIndex === originalItemsLength + visibleItemsCount) {
      setTransitionEnabled(false);
      setCurrentIndex(visibleItemsCount);
    }

    setTimeoutInProgress(false);
  };

  const extraPreviousItems = useMemo(() => {
    let output = [];
    for (let index = 0; index < visibleItemsCount; index++) {
      output.push(Children.toArray(children)[originalItemsLength - 1 - index]);
    }
    output.reverse();
    return output;
  }, [children, originalItemsLength, visibleItemsCount]);

  const extraNextItems = useMemo(() => {
    let output = [];
    for (let index = 0; index < visibleItemsCount; index++) {
      output.push(Children.toArray(children)[index]);
    }
    return output;
  }, [children, visibleItemsCount]);

  const renderDots = useMemo(() => {
    let output = [];

    const localShow = visibleItemsCount;
    const localLength = true
      ? originalItemsLength
      : Math.ceil(originalItemsLength / visibleItemsCount);
    const calculatedActiveIndex =
      currentIndex - localShow < 0
        ? originalItemsLength + (currentIndex - localShow)
        : currentIndex - localShow;

    for (let index = 0; index < localLength; index++) {
      let className = "";
      if (calculatedActiveIndex === index) {
        className = "dots-active";
      } else {
        if (calculatedActiveIndex === 0) {
          if (calculatedActiveIndex + index <= 2) {
            className = "dots-close";
          } else {
            className = "dots-far";
          }
        } else if (calculatedActiveIndex === localLength - 1) {
          if (Math.abs(calculatedActiveIndex - index) <= 2) {
            className = "dots-close";
          } else {
            className = "dots-far";
          }
        } else {
          if (Math.abs(calculatedActiveIndex - index) === 1) {
            className = "dots-close";
          } else {
            className = "dots-far";
          }
        }
      }
      output.push(<div key={index} data-index={index} className={className} />);
    }

    return output;
  }, [currentIndex, originalItemsLength, visibleItemsCount]);

  return (
    <>
      <div className="container">
        <button
          className="carousel-button left-arrow-button"
          onClick={previousItem}
          disabled={timeoutInProgress}
        >
          {"<"}
        </button>
        <button
          className="carousel-button right-arrow-button"
          onClick={nextItem}
          disabled={timeoutInProgress}
        >
          {">"}
        </button>
        <div className="carousel-container">
          <div
            className={`images-container`}
            style={{
              transform: `translateX(-${
                currentIndex * (100 / visibleItemsCount)
              }%)`,
              transition: !isTransitionEnabled ? "none" : undefined,
            }}
            onTransitionEnd={() => handleTransitionEnd()}
          >
            {extraPreviousItems}
            {children}
            {extraNextItems}
          </div>

          <div ref={indicatorContainerRef} className={`indicator-container`}>
            {renderDots}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
