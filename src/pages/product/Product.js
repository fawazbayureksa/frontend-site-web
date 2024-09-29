import React, { useEffect, useState } from 'react';
import FormatCurrency from '../components/FormatCurrency';
import { Modal } from 'react-bootstrap';

const Product = () => {

    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(0);
    const [code, setCode] = useState('');
    const [product_name, setProduct_name] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);

    
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setProducts(data.data);
    }
 
    const createProduct = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                product_name,
                category,
                price
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            setProducts([...products, data.data]);
            setCode('');
            setProduct_name('');
            setCategory('');
            setPrice(0);
            setModal(false);
        } else {
            alert(data.message);
        }
    }

    
    const deleteProduct = async (id) => {
        const response = await fetch(`http://localhost:8000/api/products/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 200) {
            setProducts(products.filter(Product => Product.id !== id))
        } else {
            alert('Delete Product failed');
        }
    }

    
    const updateProduct = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8000/api/products/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                product_name,
                category,
                price
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            const updatedProducts = products.map(Product => {
                if (Product.id === editId) {
                    return {...data.data};
                }
                return Product;
            });
            setProducts(updatedProducts);
            setEditId(0);
            setCode('');
            setProduct_name('');
            setCategory('');
            setPrice(0);
            setModal(false);
        } else {
            alert(data.message);
        }
    }
    
    
    
    const edit = async (Product) => {
        setEditId(Product.id);
        setCode(Product.code);
        setProduct_name(Product.product_name);
        setCategory(Product.category);
        setPrice(Product.price);
        setModal(true);
    }

    return (
        <div className=''>
            <h1>Product</h1>
            
            <div className='d-flex justify-content-end'>
                <button type="button" className="btn btn-primary"   onClick={() => setModal(true)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Create New
                </button>
            </div>
            <Modal show={modal} onHide={() => setModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editId > 0 ? 'Edit Product' :'Create New Product'}</Modal.Title>
                </Modal.Header>
                        <form onSubmit={editId > 0 ? updateProduct : createProduct}>
                <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="code" className="form-label">Code</label>
                            <input type="text" className="form-control" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="product_name" className="form-label">Product Name</label>
                            <input type="text" className="form-control" id="product_name" value={product_name} onChange={(e) => setProduct_name(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select className="form-select" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Cooking ware">Cooking ware</option>
                                <option value="Electronic">Electronic</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Drink">Drink</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input type="number" className="form-control" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>                        
                     <Modal.Footer>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">{editId > 0 ? 'Edit' : 'Create'}</button>
                     </Modal.Footer>
                </Modal.Body>
                  </form>
            </Modal>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 && products.map(product => {
                        return (
                            <tr key={product.id}>
                                <td>{product.code}</td>
                                <td>{product.product_name}</td>
                                <td>{product.category}</td>
                                <td>{FormatCurrency(product.price)}</td>
                                <td>
                                    <button type="button" onClick={() => edit(product)} className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button type="button" onClick={() => deleteProduct(Product.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

}

export default Product;
