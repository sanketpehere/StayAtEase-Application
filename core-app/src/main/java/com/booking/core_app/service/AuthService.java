package com.booking.core_app.service;

import com.booking.core_app.configuration.PasswordConfig;
import com.booking.core_app.models.Customer;
import com.booking.core_app.requestDto.CustomerLoginDto;
import com.booking.core_app.requestDto.CustomerSignupDto;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Currency;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    CustomerService customerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // social signup handles both, signup as well as login also if user is using google
    public Customer socialSignup(Map<String, String> socialDetails)
    {
        String email = socialDetails.get("email");
        String name = socialDetails.get("name");
        String provider = socialDetails.get("provider");
        String picture = socialDetails.get("picture");

        Optional<Customer> existing = customerService.findByEmail(email);
        if (existing.isPresent()) {
            return existing.get();  // ← this handles Google login
        }

        Customer customer = new Customer();
        customer.setFullName(name);
        customer.setEmail(email);
        customer.setProfilePicture(picture);
        customer.setProvider(provider);
        customer.setVerified(true);

        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        customer.setCreatedBy("System");
        customer.setUpdatedBy("System");

       return customerService.saveCustomer(customer);
    }

    // otherwise we are having this for manual signup
    public  Customer signup(CustomerSignupDto customerSignupDto)
    {
        Customer customer = new Customer();

        customer.setVerified(false);
        customer.setFullName(customerSignupDto.getFullName());
        customer.setPassword(passwordEncoder.encode(customerSignupDto.getPassword()));
        customer.setEmail(customerSignupDto.getEmail());
        customer.setProvider("SELF");

        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        customer.setCreatedBy("System");
        customer.setUpdatedBy("System");

        return customerService.saveCustomer(customer);
    }


    // manual login
    public Customer login(CustomerLoginDto customerLoginDto) {
        Customer customer = customerService.findByEmail(customerLoginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(customerLoginDto.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return customer;
    }
}
