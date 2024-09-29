import React, { useEffect, useState } from 'react';

const Home = () => {

    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await fetch('http://localhost:8000/api/dashboard');
        const data = await response.json();
        setTotalProducts(data.data.products)
        setTotalCustomers(data.data.customers) 
        setTotalSales(data.data.transactions)
    }

    return (
        <div>
            <h1>Cashier</h1>

            <hr></hr>
            <div className="row">
                <div className="col-md-4">
                    <div className="card text-white bg-secondary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Products</h5>
                            <p className="card-text">{totalProducts}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-secondary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Customers</h5>
                            <p className="card-text">{totalCustomers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-secondary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Sale</h5>
                            <p className="card-text">{totalSales}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
