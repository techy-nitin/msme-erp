package MSME.MSME.PDF;

import MSME.MSME.Client.ClientEntity;
import MSME.MSME.Client.ClientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class fetchClient {

    @Autowired
    private ClientRepo clientRepo;

    /**
     * Fetch client using customerId
     */
    public ClientEntity getClient(Long customerId) {

        return clientRepo.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Client not found with id : " + customerId));
    }

}