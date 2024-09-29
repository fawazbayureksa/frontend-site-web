import React, { useEffect, useState } from 'react';
import { DateTimeFormat } from '../components/DateTimeFormat';
import FormatCurrency from '../components/FormatCurrency';

const Sale = () => {

    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState(0);
    const [editId, setEditId] = useState(0);
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [newRowProduct, setNewRowProduct] = useState([{
        product_id: 0,
        quantity: '',
        sub_total: 0
    }]);


    useEffect(() => {
        getCustomers();
        getProducts();
        getData();
    }, []);

    const getCustomers = async () => {
        const response = await fetch('http://localhost:8000/api/customers');
        const data = await response.json();
        setCustomers(data.data);
    }

    const getProducts = async () => {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setProducts(data.data);
    }


    const selectProduct = (index,e) => {
        const newRowProductCopy = [...newRowProduct];
        newRowProductCopy[index] = {
            ...newRowProductCopy[index],
            product_id: parseInt(e.target.value)
        };
        setNewRowProduct(newRowProductCopy);
    }

    const changeQuantity = (index,e) => {
        
        let newRowProductCopy = [...newRowProduct];
        
        if(newRowProductCopy[index].product_id === 0){
            return
        }

        const product_price     = products.find(product => product.id === parseInt(newRowProductCopy[index].product_id)).price;
        
        newRowProductCopy[index] = {
            ...newRowProductCopy[index],
            quantity: parseInt(e.target.value),
            sub_total: e.target.value !== '' ? parseInt(e.target.value * product_price) : 0
        };
        setNewRowProduct(newRowProductCopy);
    }

    const selectCustomer = (e) => {
        setCustomer(e.target.value);
    }

    const createSale = async (e) => {
        e.preventDefault();

        if(customer === 0){
            alert('Please select customer');
             return
        }

        if(newRowProduct.filter(rowProduct => rowProduct.product_id === 0).length > 0){
            alert('Please select product');
             return
        }
       
        if (customer !== 0 && newRowProduct.filter(rowProduct => rowProduct.product_id === 0).length > 0) {
            const response = await fetch('http://localhost:8000/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_id: parseInt(customer),
                    products: newRowProduct,
                    sub_total: newRowProduct.map(rowProduct => rowProduct.sub_total).reduce((a, b) => a + b, 0)
                })
            });
            const data = await response.json();
            if (response.status === 200) {
                setNewRowProduct([{
                    product_id: 0,
                    quantity: '',
                    sub_total: 0
                }]);
                setCustomer(0);
                getData();
                alert('Sale created successfull');
            } else {
                alert(data.message);
            }
        }
    }
    const getData = async () => {
        const response = await fetch('http://localhost:8000/api/sales');
        const data = await response.json();
        setSales(data.data);
    }

    const deleteSale = async (id) => {
        const response = await fetch(`http://localhost:8000/api/sales/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.status === 200) {
            getData();
        } else {
            alert(data.message);
        }
    }


    const edit = async (e,sale) => {
        e.preventDefault();
            setEditId(sale.id);
            setCustomer(sale.customer_id);
            const newRowProductCopy = []; 
        
            sale.item_sale.forEach(item => {
                const newItem = {
                    product_id: parseInt(item.product_id),  // Convert to integer
                    quantity: parseInt(item.qty),           // Convert to integer
                    sub_total: parseInt(item.qty * item.product.price)  // Calculate subtotal
                };
                newRowProductCopy.push(newItem);  // Push the modified item to the array
            });
            setNewRowProduct(newRowProductCopy);
    }

    
    const updateSale = async (e) => {
        e.preventDefault();
        
        if(customer === 0){
            alert('Please select customer');
             return
        }

        if(newRowProduct.filter(rowProduct => rowProduct.product_id === 0).length > 0){
            alert('Please select product');
             return
        }
       
        if (customer !== 0 && newRowProduct.filter(rowProduct => rowProduct.product_id === 0).length > 0) {
            const response = await fetch(`http://localhost:8000/api/sales/${sales.find(sale => sale.customer_id === parseInt(customer)).id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_id: parseInt(customer),
                    products: newRowProduct,
                    sub_total: newRowProduct.map(rowProduct => rowProduct.sub_total).reduce((a, b) => a + b, 0)
                })
            });
            const data = await response.json();
            if (response.status === 200) {
                setNewRowProduct([{
                    product_id: 0,
                    quantity: '',
                    sub_total: 0
                }]);
                setCustomer(0);
                getData();
                alert('Sale updated successfull');
            } else {
                alert(data.message);
            }
        }
    }
    return (
        <div>
            <h1>Sale</h1>

            <div className='card shadow-md rounded'>
                <div className='card-body'>
                    <form onSubmit={editId > 0 ? updateSale : createSale}>
                        <div className='d-flex gap-3'> 
                                <div className="mb-3">
                                    <label className="form-label">Customer</label>
                                    <select className="form-control" onChange={selectCustomer} value={customer}>
                                        <option value="">-- Choose Customer --</option>
                                        {
                                            customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        <div className='d-flex flex-column gap-3'>
                            {newRowProduct.map((row,index) =>  (
                                <div className='d-flex align-items-center gap-3' key={index}>
                                    <div className="mb-3">
                                        <label className="form-label">Product</label>
                                        <select className="form-control" onChange={(e) => selectProduct(index,e)} value={row.product_id ? row.product_id : ''}>
                                            <option value="">-- Choose Product --</option>
                                            {
                                                products.map(product => <option key={product.id} value={product.id}>{product.product_name}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Qty</label>
                                        <input type="text" className="form-control" value={row.quantity ? row.quantity : 0} onChange={(e) => changeQuantity(index,e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Sub Total</label>
                                        <input type="text" placeholder='000.00' disabled className="form-control" value={row.sub_total ? row.sub_total : 0} />
                                    </div>
                                    {newRowProduct.length > 1 && (
                                        <div className="">
                                            <button type="button" className="btn btn-danger btn-sm mt-3" onClick={() => setNewRowProduct(newRowProduct.filter((item, i) => i !== index))}>Remove</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='d-flex justify-content-end'>
                            <button type="button" className="btn btn-primary me-3" onClick={() => setNewRowProduct([...newRowProduct, { id: '', product_id: '', quantity: 0, sub_total: 0 }])}>Add</button>
                            <button type="submit" className="btn btn-success">Save</button>
                        </div>
                    </form>
                </div>
            </div>

            <hr></hr>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Invoice Number</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Sub Total</th>
                        <th>Date</th>
                        {/* <th>Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {sales && sales.map((sale, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{sale.invoice_id}</td>
                            <td>{sale.customer.name}</td>
                            <td>
                                {sale.item_sale.map(item => 
                                    <div key={item.product.id}>{item.product.product_name} x {item.qty} : {FormatCurrency(item.qty * item.product.price)}</div>
                                )}
                            </td>
                            <td>{FormatCurrency(sale.sub_total)}</td>
                            <td>{DateTimeFormat(sale.created_at,2)}</td>
                            <td>
                                <button type="button" className="btn btn-secondary me-2 btn-sm" onClick={(e) => edit(e,sale)}>Edit</button>
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteSale(sale.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Sale;
