// backend/routes/contacts.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET /contacts (No changes needed)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        console.error('!!! ERROR IN GET /contacts:', err); 
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /contacts (Update to include phone)
router.post('/', async (req, res) => {
    // --- UPDATE THIS LINE ---
    const { name, email, phone } = req.body;
    try {
        const newContact = new Contact({ 
            name, 
            email, 
            // --- ADD THIS LINE ---
            phone 
        });
        const contact = await newContact.save();
        res.status(201).json(contact);
    } catch (err) {
        console.error('!!! ERROR IN POST /contacts:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- ADD THIS ENTIRE BLOCK ---
// @route   PUT /contacts/:id
// @desc    Update a contact
router.put('/:id', async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true } // {new: true} returns the document after update
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(updatedContact);
    } catch (err) {
        console.error('!!! ERROR IN PUT /contacts/:id:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});
// --- END OF NEW BLOCK ---

// DELETE /contacts/:id (No changes needed)
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        await contact.deleteOne();
        res.json({ message: 'Contact removed' });
    } catch (err) {
        console.error('!!! ERROR IN DELETE /contacts/:id:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;