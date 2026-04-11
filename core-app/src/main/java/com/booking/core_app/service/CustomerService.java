package com.booking.core_app.service;

import com.booking.core_app.models.Customer;
import com.booking.core_app.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // =========================
    // SAVE CUSTOMER
    // =========================
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // =========================
    // FIND BY EMAIL
    // =========================
    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    // =========================
    // FIND BY VERIFICATION TOKEN
    // =========================
    public Optional<Customer> findByVerificationToken(String token) {
        return customerRepository.findByVerificationToken(token);
    }

    // =========================
    // VERIFY EMAIL
    // =========================
    public boolean verifyCustomer(String token) {

        Optional<Customer> optionalCustomer =
                customerRepository.findByVerificationToken(token);

        if (optionalCustomer.isEmpty()) {
            return false;
        }

        Customer customer = optionalCustomer.get();

        // already verified
        if (customer.isVerified()) {
            return true;
        }

        // mark verified
        customer.setVerified(true);

        // IMPORTANT → remove token after verification
        customer.setVerificationToken(null);

        customer.setUpdatedAt(LocalDateTime.now());
        customer.setUpdatedBy("System");

        customerRepository.save(customer);

        return true;
    }
}