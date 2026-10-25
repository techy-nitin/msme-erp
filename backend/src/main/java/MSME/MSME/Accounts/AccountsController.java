package MSME.MSME.Accounts;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
public class AccountsController {

    private final AccountsService accountsService;

    public AccountsController(AccountsService accountsService){
        this.accountsService=accountsService;
    }

    @GetMapping("/dashboard")
    public AccountsResponse dashboard(){

        return accountsService.getAccountsDashboard();

    }

}