package MSME.MSME.Client;

import MSME.MSME.Client.ClientRequest;
import MSME.MSME.Client.ClientResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {

    private final ClientService clientService;

    // Manual Constructor
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // Create Client
    @PostMapping
    public ResponseEntity<ClientResponse> createClient(
            @Valid @RequestBody ClientRequest request) {

        return new ResponseEntity<>(
                clientService.createClient(request),
                HttpStatus.CREATED
        );
    }

    // Get All Clients
    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAllClients() {

        return ResponseEntity.ok(clientService.getAllClients());
    }

    // Get Client By Id
    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(
            @PathVariable Long id) {

        return ResponseEntity.ok(clientService.getClientById(id));
    }

    // Update Client
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequest request) {

        return ResponseEntity.ok(
                clientService.updateClient(id, request)
        );
    }

    // Delete Client
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(
            @PathVariable Long id) {

        clientService.deleteClient(id);

        return ResponseEntity.ok("Client deleted successfully.");
    }
}