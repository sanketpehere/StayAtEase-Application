package com.booking.core_app.service;

import com.booking.core_app.models.Customer;
import com.booking.core_app.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public Customer saveCustomer(Customer customer)
    {

        return customerRepository.save(customer);
    }
    public Optional<Customer> findByEmail(String email)
    {
        return customerRepository.findByEmail(email);
    }
}
