package MSME.MSME.Login;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class jwtservice {
    private static final String secret = "MSMEProjectJWTSecretKey2026SuperSecureKey12345";
    public String generateToken (String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+86400000))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()),
                        SignatureAlgorithm.HS256)
                .compact();
    }
    public String extractEmail(String token){
       return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}
