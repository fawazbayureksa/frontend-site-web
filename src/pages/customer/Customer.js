import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

const Customer = () => {

    const [customers, setCustomers] = useState([]);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(0);
    const [name, setName] = useState('');
    const [domicile, setDomicile] = useState('');
    const [gender, setGender] = useState(1);


    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await fetch('http://localhost:8000/api/customers');
        const data = await response.json();
        setCustomers(data.data);
    }
    
  
    const createCustomer = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                domicile,
                gender
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            setCustomers([...customers, data.data]);
            setName('');
            setDomicile('');
            setGender(1);
            setModal(false);
        } else {
            alert(data.message);
        }
    }

    
    const deleteCustomer = async (id) => {
        const response = await fetch(`http://localhost:8000/api/customers/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 200) {
            setCustomers(customers.filter(customer => customer.id !== id))
        } else {
            alert('Delete customer failed');
        }
    }

    
    const editCustomer = async (customer) => {
        setEditId(customer.id);
        setName(customer.name);
        setDomicile(customer.domicile);
        setGender(customer.gender);
        setModal(true);
    }

    const updateCustomer = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8000/api/customers/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                domicile,
                gender
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            const updatedCustomers = customers.map(customer => {
                if (customer.id === editId) {
                    return {...data.data};
                }
                return customer;
            });
            setCustomers(updatedCustomers);
            setEditId(0);
            setName('');
            setDomicile('');
            setGender(1);
            setModal(false);
        } else {
            alert(data.message);
        }
    }
    return (
        <div className=''>
            <h1>Customer</h1>
            
            <div className='d-flex justify-content-end'>
                <button type="button" className="btn btn-primary"   onClick={() => setModal(true)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Create New
                </button>
            </div>
           
            <Modal show={modal} onHide={() => setModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editId > 0 ? 'Edit Customer' :'Create New Customer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <form onSubmit={editId > 0 ? updateCustomer : createCustomer}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="domicile" className="form-label">Domicile</label>
                                <input type="text" className="form-control" id="domicile" value={domicile} onChange={(e) => setDomicile(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <select className="form-select" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                </select>
                            </div>
                        <Modal.Footer>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">{editId > 0 ? 'Update' : 'Create'}</button>
                        </Modal.Footer>
                        </form>
                </Modal.Body>
            </Modal>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Domicile</th>
                        <th>Gender</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 && customers.map(customer => {
                        return (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.domicile}</td>
                                <td>{customer.gender === '1' ? 'Male' : 'Female'}</td>
                                <td>
                                    <button type="button" onClick={() => editCustomer(customer)} className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button type="button" onClick={() => deleteCustomer(customer.id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>    );

}

export default Customer;
