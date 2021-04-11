import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import Request from '../helpers/request.js';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';
import MenuPage from '../components/MenuPage';
import OrderPage from '../components/OrderPage';
import PaymentForm from '../components/PaymentForm.js';

// import TopNavBar from '../components/TopNavBar';

const MainContainer = () => {

    const [currentItems, setCurrentItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("menu_items/category/main")
    const [basket, setBasket] = useState([])
    const [basketValue, setBasketValue] = useState(0)
    const [loggedIn, setLoggedIn] = useState(false)
    const [activeCustomer, setActiveCustomer] = useState(null);

    useEffect(() => {
        console.log("Fetching menu items...")
        // let categoryUrl = selectedCategory;
        const request = new Request();
        const allItemsPromise = request.get(selectedCategory)

        Promise.all([allItemsPromise])
            .then((data) => {
                setCurrentItems(data[0]);
            })

    }, [selectedCategory])


    // useEffect to update cart value when cart items change
    // useEffect(() => {
    //     console.log("Basket has changed contents")
    //     let total = 0;
    //     total = basket.map((basketItem) => {
    //         return total -= basketItem.price
    //     })
    //     // console.log("Basket total: ", basketValue);
    // }, [basket])

    if (!currentItems) {
        return <p>nothing</p>
    }

    const handleCategoryNavClick = (category) => {
        setSelectedCategory(category);
    }

    const handleSelectedItemAdd = (item) => {
        // Update contents of the basket
        // Add a quantity field to the object and append by 1 if already exist and > 0
        // console.log("ITEM QTY: ", item.quantity + 1);
        if (item.quantity > 0) {
            item.quantity += 1;
        } else {
            item.quantity = 1;
            setBasket([...basket, item])
        }

        // Update value of basket 
        setBasketValue(basketValue + item.price)
    }

    const handleSelectedItemRemove = (item) => {

        // // Remove item from basket
        const updatedBasket = basket.filter((basketItem) => {
            if (basketItem === item && item.quantity > 0) {
                // Remove item price from basket if item to remove is found
                setBasketValue(basketValue - basketItem.price)
                basketItem.quantity -= 1;
                if (basketItem.quantity === 0) {
                    return null
                } else {
                    return basketItem
                }

            } else {
                return basketItem !== item
            }

        })
        setBasket(updatedBasket);
        console.log("UPDATED BASKET: ", updatedBasket);
    }

    const handleCustomerLogIn = () => {
        console.log("handle customer login triggered");
        setLoggedIn(true);
    }
    // Can be moved then passed down later /////////
    const handleCustomerPost = function (customer) {
        const request = new Request();
        request.post("/customers", customer)
        setActiveCustomer(customer);
        // .then(() => window.location = '/home')
        // change '/' to whichever route the home page is called
    }
    ///////////////////////////////////////////////

    // Handle payment
    const handlePayment = () => {
        console.log("PAYMENT");

    }
    // const handlePayment = (payment) => {
    //     console.log("PAYMENT", payment);

    //     const request = new Request();
    //     request.post("/payments", payment)
    //     // .then(() => window.location = '/home')
    //     // change '/' to whichever route the home page is called
    // }

    return (
        <>
            {/* HAVE TOPNAVBAR HERE IF YOU WANT IT ON ALL PAGES */}
            <Switch>
                <Route exact path="/" render={() => {
                    return (
                        loggedIn ?
                            <Redirect to="/home" /> :
                            <Redirect to="/login" />
                    )
                }} />
                <Route exact path="/login" render={() => {
                    return (
                        loggedIn ?
                            // <Redirect to="/home" /> :
                            // <LoginPage handleCustomerLogIn={handleCustomerLogIn} />
                            <Redirect to="/home" /> :
                            <LoginPage handleCustomerLogIn={handleCustomerLogIn} handleCustomerPost={handleCustomerPost} />
                    )
                }} />
                <Route exact path="/home" render={() => {
                    return <HomePage handleCategoryNavClick={handleCategoryNavClick} />
                }} />
                <Route exact path="/menu" render={() => {
                    return (
                        <MenuPage currentItems={currentItems}
                            handleCategoryNavClick={handleCategoryNavClick}
                            category={selectedCategory}
                            handleSelectedItemAdd={handleSelectedItemAdd}
                            handleSelectedItemRemove={handleSelectedItemRemove}
                            basket={basket}
                            basketValue={basketValue}
                            handlePayment={handlePayment}
                        />
                    )
                }} />

                <Route exact path="/order" render={() => {
                    return (
                        <OrderPage customer={activeCustomer}
                            basket={basket}
                            basketValue={basketValue}
                        />
                    )
                }} />

                <Route exact path="/Basket" component={OrderPage} />

                {/* Render payment page  */}
                <Route exact path="/paymentform" render={() => {
                    return (
                        <PaymentForm
                            basket={basket}
                            basketValue={basketValue}
                        />
                    )
                }} />
            </Switch>
        </>
    )
}

export default MainContainer;