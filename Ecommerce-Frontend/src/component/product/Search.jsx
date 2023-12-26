import { Fragment, useState } from "react";
import MetaData from "../layout/MetaData";

import "./search.css";

export default function Search({ history }) {
  const [keyword, setKeyword] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      window.location.href = `/products/${keyword}`;
    } else {
      window.location.href = "/products";
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
}
