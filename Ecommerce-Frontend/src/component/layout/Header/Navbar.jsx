import React, { useEffect, useState } from 'react'

import logo from "../../../images/logo.png";
import logoWhite from "../../../images/logo-white.png";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import "./Header.css"
import axios from 'axios';

const Navbar = () => {

    const nav = useNavigate();
    const cart = useSelector(s => s.cart);

    const [inp, setInp] = useState("");
    const [sug, setSug] = useState([]);
    const [inpFocus, setInpFocus] = useState(false);
    const [sugHover, setSugHover] = useState(false);

    const getSearchResult = async () => {
        if(inp === "") return;
        console.log("inp", inp);
        const { data } = await axios.post("/api/v1/product/search", { name: inp });
        console.log("search data ",data);
        setSug(data);
    }

    function handleSearch(keyword) {
        setInp(keyword);
        console.log("key", keyword)
        nav(`products/${keyword}`);
    }


    useEffect(() => {
        getSearchResult();
        console.log(inpFocus, sugHover)
        if(inp == ""){
            setSug([]);
        }
    }, [inp])

    return (
        <div className='nav-container'>
            <div className='logo'>
            <Link to={`/`}><img className='img1' src={logo} /></Link>
            <Link to={`/`}><img className='img2' src={logoWhite} /></Link>
            </div>

            <div className='nav-list-cont'>
                <ul className='nav-list'>
                    {/*<Link><div className='search-box'>  <input/> <div className='sug'>Ram Ram ji</div> </div> </Link>*/}

                    <a className='l-m-zero'> <div className='search-box'>

                        <div className='inp-box-cont'>
                            <input onChange={(e) => { setInp(e.target.value) }} value={inp} onFocus={() => { setInpFocus(true) }} onBlur={() => { setInpFocus(false) }} />
                        </div>

                        <div className='sug-cont' onMouseEnter={() => { setSugHover(true) }} onMouseLeave={() => { setSugHover(false) }} >

                            {(inpFocus || sugHover) && sug.product && sug.product.map(ele => {
                                return <button className='sug' onClick={() => handleSearch(ele.name)} >
                                    {ele.name}
                                </button>
                            })}
                            
                        </div>



                    </div>
                    </a>


                    <Link to="/"><li>Home</li></Link>
                    <Link to="/products"><li>Products</li></Link>
                    <Link to="login"><li>Login</li></Link>
                    <Link to="/cart"><li><AddShoppingCartIcon color="black" fontSize="large" />({cart.cartItems && cart.cartItems.length})</li></Link>
                </ul>
            </div>

        </div>
    )
}

export default Navbar