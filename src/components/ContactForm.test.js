import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(
        <h1>Contact Form</h1>
    );
    
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    
    const firstName = screen.getByPlaceholderText(/edd/i);
    userEvent.type(firstName, 'jess');

    const errorMessage = await screen.findByTestId('error');

    expect(errorMessage).toBeVisible();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    
    const button = screen.getByRole('button');
    userEvent.click(button);

    waitFor(async () => {
        const errors = screen.getAllByTestId('error');
        expect(errors).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
    
    const firstName= screen.getByPlaceholderText(/edd/i);
    userEvent.type(firstName, 'Jessica');
    
    const lastName= screen.getByPlaceholderText(/burke/i);
    userEvent.type(lastName, 'Williams');

    const email= screen.getByPlaceholderText(/bluebill/i);
    userEvent.type(email, '');
    
    const button = screen.getByRole('button');
    userEvent.click(button);

    waitFor(async () => {
        const error = screen.getByTestId('error');
        expect(error).toBeInTheDocument();
    })

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    
    const email= screen.getByPlaceholderText(/bluebill/i);
    userEvent.type(email, 'jesswill');
    
    const emailError = await screen.findByText(/email must be a valid email address/i);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>); 

    const lastName = screen.getByPlaceholderText(/burke/i);

    const submit = screen.getByRole('button', {name: 'Submit'});

    userEvent.type(lastName, '');
    userEvent.click(submit);

    const lastNameError = await screen.findByText(/lastName is a required field/i);
    expect(lastNameError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
    
    const firstName= screen.getByPlaceholderText(/edd/i);
    userEvent.type(firstName, 'Jessica');
    
    const lastName= screen.getByPlaceholderText(/burke/i);
    userEvent.type(lastName, 'Williams');

    const email= screen.getByPlaceholderText(/bluebill/i);
    userEvent.type(email, '');

    const message = screen.getAllByLabelText(/message/i);
    userEvent.type(message, '');

    const submit = screen.getByRole('button', {name: 'Submit'});
    userEvent.click(submit);

    waitFor(async () => {
        const firstOutput= screen.queryAllByText(firstName);
        const lastOutput= screen.queryAllByText(lastName);
        const emailOutput= screen.queryAllByText(email);

        expect(firstOutput).toBeInTheDocument();
        expect(lastOutput).toBeInTheDocument();
        expect(emailOutput).toBeInTheDocument();
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    
    const firstName= screen.getByPlaceholderText(/edd/i);
    userEvent.type(firstName, 'Jessica');
    
    const lastName= screen.getByPlaceholderText(/burke/i);
    userEvent.type(lastName, 'Williams');

    const email= screen.getByPlaceholderText(/bluebill/i);
    userEvent.type(email, 'jesswillcode@gmail.com');

    const message = screen.getAllByLabelText(/message/i);
    userEvent.type(message, 'Loyal, Brave, and True');

    const submit = screen.getByRole('button', {name: 'Submit'});
    userEvent.click(submit);

    waitFor(async () => {
        const firstOutput= screen.queryByText(firstName);
        const lastOutput= screen.queryByText(lastName);
        const emailOutput= screen.queryByText(email);
        const messageOutput =screen.queryByText(message);

        expect(firstOutput).toBeInTheDocument();
        expect(lastOutput).toBeInTheDocument();
        expect(emailOutput).toBeInTheDocument();
        expect(messageOutput).toBeInTheDocument();
    })

});