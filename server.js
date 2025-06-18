const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database simulation (in a real app, use MongoDB/MySQL/etc.)
let bookings = [];

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Booking endpoint
app.post('/api/bookings', (req, res) => {
    try {
        const bookingData = req.body;
        
        // Validate data
        if (!bookingData.date || !bookingData.time || !bookingData.guests) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check guest ages
        for (const guest of bookingData.guests) {
            const dob = new Date(guest.dob);
            const age = calculateAge(dob);
            
            if (age < 21) {
                return res.status(400).json({ error: `Guest ${guest.name} is under 18 years old` });
            }
        }
        
        // Add to "database"
        bookings.push(bookingData);
        
        // Send confirmation email
        sendConfirmationEmail(bookingData);
        
        res.status(201).json({ message: 'Booking successful', booking: bookingData });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function calculateAge(dob) {
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function sendConfirmationEmail(booking) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: booking.contactEmail,
        subject: 'Levels Club Pokhara - Booking Confirmation',
        html: `
            <h2>Your Reservation is Confirmed!</h2>
            <p>Thank you for booking with Levels Club Pokhara.</p>
            <h3>Booking Details</h3>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Number of Guests:</strong> ${booking.guests.length}</p>
            <p><strong>Contact Person:</strong> ${booking.contactName}</p>
            <p>Please bring valid ID for all guests upon arrival.</p>
            <p>For any changes, please contact us at +977 984XXXXXXX</p>
        `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});