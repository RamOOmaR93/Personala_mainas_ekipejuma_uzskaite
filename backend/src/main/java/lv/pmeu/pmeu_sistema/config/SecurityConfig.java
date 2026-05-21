package lv.pmeu.pmeu_sistema.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lv.pmeu.pmeu_sistema.user.service.CustomUserDetailsService;


@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .userDetailsService(customUserDetailsService)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/users/*/equipment")
                        .hasAnyRole("DARBINIEKS", "PRIEKSNIEKS", "VIETNIEKS")

                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/equipment-items")
                        .hasAnyRole("DARBINIEKS", "PRIEKSNIEKS", "VIETNIEKS")

                        .requestMatchers("/users/**").hasAnyRole("PRIEKSNIEKS", "VIETNIEKS")
                        .requestMatchers("/equipment-items").hasAnyRole("PRIEKSNIEKS", "VIETNIEKS")

                        .requestMatchers("/shift-results/summary/**").hasAnyRole("PRIEKSNIEKS", "VIETNIEKS")
                        .requestMatchers("/shift-results/report/**").hasAnyRole("PRIEKSNIEKS", "VIETNIEKS")
                        .requestMatchers("/shifts/by-date").hasAnyRole("PRIEKSNIEKS", "VIETNIEKS")

                        .anyRequest().authenticated()

                        //.anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
public org.springframework.security.authentication.AuthenticationManager authenticationManager(
        org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration config
) throws Exception {
    return config.getAuthenticationManager();
}



}
