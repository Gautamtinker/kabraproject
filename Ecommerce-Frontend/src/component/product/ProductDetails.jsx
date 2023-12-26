import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// components
import { Fade, Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import ReactStars from "react-rating-stars-component";
import { useSnackbar } from "notistack";

// files
import { getProductsDetails } from "../../action/productAction";
import ReviewCard from "./ReviewCard.jsx";
import Loader from "../layout/loader/Loader";

import { addItemsToCart } from "../../action/cartAction";

// css
import "./productDetail.css";

export default function ProductDetails({ match }) {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const [quantity, setQuantity] = useState(1);

  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (msg, type) => {
    enqueueSnackbar(msg, { variant: type });
  };

  const params = useParams();

  useEffect(() => {
    if (error) {
      return handleAlert(error, "error");
    }
    dispatch(getProductsDetails(params.id));
  }, [dispatch, params.id, alert, error]);

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.rating,
    isHalf: true,
  };

  const addToCartHandler = () => {
    console.log(params.id);
    dispatch(addItemsToCart(params.id, quantity));
    handleAlert("Item added to cart", "success");
  };

  return (
    <Fragment>
      {loading ? (
        Loader
      ) : (
        <Fragment>
          <div className="ProductDetails">
            <div className="slide-container">
              <div className="slide">
                {product.images && (
                  <Slide>
                    {product.images.map((ele, ind) => (
                      <img
                        className="CarouselImage"
                        key={ind}
                        src={ele.url}
                        alt={`${ind} Slide`}
                      />
                    ))}
                  </Slide>
                )}
              </div>
            </div>

            <div className="details">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button
                      onClick={() => {
                        setQuantity(Math.max(0, quantity - 1));
                      }}
                    >
                      -
                    </button>
                    <input readOnly type="number" value={quantity} />
                    <button
                      onClick={() => {
                        product.Stock > quantity && setQuantity(quantity + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={addToCartHandler}
                    className="submitReview"
                    disabled={product.Stock < 1 ? true : false}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview">Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
