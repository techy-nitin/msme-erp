package MSME.MSME.Client;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepo clientRepository;

    // Manual Constructor
    public ClientService(ClientRepo clientRepository) {
        this.clientRepository = clientRepository;
    }

    // Create Client
    public ClientResponse createClient(ClientRequest request) {

        if (request.getEmail() != null &&
                clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPhone() != null &&
                clientRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        if (request.getGstNumber() != null &&
                clientRepository.existsByGstNumber(request.getGstNumber())) {
            throw new RuntimeException("GST Number already exists");
        }

        ClientEntity client = new ClientEntity();
        client.setCustomerName(request.getCustomerName());
        client.setCompanyName(request.getCompanyName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setGstNumber(request.getGstNumber());
        client.setAddress(request.getAddress());
        client.setCity(request.getCity());
        client.setState(request.getState());
        client.setCountry(request.getCountry());
        client.setPincode(request.getPincode());

        client = clientRepository.save(client);

        return mapToResponse(client);
    }

    // Get All Clients
    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Client By Id
    public ClientResponse getClientById(Long id) {

        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        return mapToResponse(client);
    }

    // Update Client
    public ClientResponse updateClient(Long id, ClientRequest request) {

        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        client.setCustomerName(request.getCustomerName());
        client.setCompanyName(request.getCompanyName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setGstNumber(request.getGstNumber());
        client.setAddress(request.getAddress());
        client.setCity(request.getCity());
        client.setState(request.getState());
        client.setCountry(request.getCountry());
        client.setPincode(request.getPincode());

        client = clientRepository.save(client);

        return mapToResponse(client);
    }

    // Delete Client
    public void deleteClient(Long id) {

        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        clientRepository.delete(client);
    }

    // Mapper
    private ClientResponse mapToResponse(ClientEntity client) {

        ClientResponse response = new ClientResponse();

        response.setId(client.getId());
        response.setCustomerName(client.getCustomerName());
        response.setCompanyName(client.getCompanyName());
        response.setEmail(client.getEmail());
        response.setPhone(client.getPhone());
        response.setGstNumber(client.getGstNumber());
        response.setAddress(client.getAddress());
        response.setCity(client.getCity());
        response.setState(client.getState());
        response.setCountry(client.getCountry());
        response.setPincode(client.getPincode());
        response.setCreatedAt(client.getCreatedAt());
        response.setUpdatedAt(client.getUpdatedAt());

        return response;
    }
}