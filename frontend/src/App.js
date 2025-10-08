// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5001/contacts';

function App() {
    const [contacts, setContacts] = useState([]);
    
    // State for the main form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // --- NEW: State for handling editing ---
    const [editingId, setEditingId] = useState(null); // ID of the contact being edited
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');

    // --- NEW: State for user feedback ---
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState('');

    // Fetch contacts from the server
    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setContacts(response.data);
                setError('');
            })
            .catch(error => {
                console.error('There was an error fetching the contacts!', error);
                setError('Could not fetch contacts. Please try again later.');
            })
            .finally(() => {
                setLoading(false); // Stop loading in any case
            });
    }, []);

    // Add a new contact
    const handleAddContact = (event) => {
        event.preventDefault();
        if (!name || !email) return alert('Name and Email are required.');

        const newContact = { name, email, phone };
        axios.post(API_URL, newContact)
            .then(response => {
                setContacts([...contacts, response.data]);
                setName('');
                setEmail('');
                setPhone('');
                setError('');
            })
            .catch(error => {
                console.error('There was an error adding the contact!', error);
                setError('Failed to add contact.');
            });
    };

    // Delete a contact
    const handleDeleteContact = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                setContacts(contacts.filter(contact => contact._id !== id));
                setError('');
            })
            .catch(error => {
                console.error('There was an error deleting the contact!', error);
                setError('Failed to delete contact.');
            });
    };

    // --- NEW: Start editing a contact ---
    const handleEditClick = (contact) => {
        setEditingId(contact._id);
        setEditName(contact.name);
        setEditEmail(contact.email);
        setEditPhone(contact.phone || ''); // Handle case where phone might not exist
    };
    
    // --- NEW: Cancel editing ---
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // --- NEW: Update a contact ---
    const handleUpdateContact = (event, id) => {
        event.preventDefault();
        const updatedContact = { name: editName, email: editEmail, phone: editPhone };

        axios.put(`${API_URL}/${id}`, updatedContact)
            .then(response => {
                // Update the contact in the list
                const updatedContacts = contacts.map(contact =>
                    contact._id === id ? response.data : contact
                );
                setContacts(updatedContacts);
                setEditingId(null); // Exit editing mode
                setError('');
            })
            .catch(error => {
                console.error('There was an error updating the contact!', error);
                setError('Failed to update contact.');
            });
    };


    return (
        <div className="container">
            <h1>Contact List</h1>

            {/* --- NEW: Display error messages --- */}
            {error && <p className="error-msg">{error}</p>}

            {/* Form to Add a New Contact */}
            <form onSubmit={handleAddContact} className="add-form">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button type="submit">Add Contact</button>
            </form>

            {/* --- NEW: Display loading message --- */}
            {loading && <p>Loading contacts...</p>}

            {/* List of Contacts */}
            <ul>
                {contacts.map(contact => (
                    <li key={contact._id}>
                        {/* --- NEW: Conditional rendering for editing mode --- */}
                        {editingId === contact._id ? (
                            <form className="edit-form" onSubmit={(e) => handleUpdateContact(e, contact._id)}>
                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                                <button type="submit">Save</button>
                                <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                            </form>
                        ) : (
                            <>
                                <div className="contact-details">
                                    <strong>{contact.name}</strong><br />
                                    <span>{contact.email}</span><br />
                                    {contact.phone && <span className="phone">{contact.phone}</span>}
                                </div>
                                <div className="contact-actions">
                                    <button onClick={() => handleEditClick(contact)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDeleteContact(contact._id)} className="delete-btn">Remove</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;