package com.meubelpendawa.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.midtrans.Config;
import com.midtrans.ConfigFactory;
import com.midtrans.service.MidtransCoreApi;
import com.midtrans.service.MidtransSnapApi;

@Configuration
public class MidtransConfig {

    @Value("${midtrans.server-key}")
    private String serverKey;

    @Value("${midtrans.client-key}")
    private String clientKey;

    @Value("${midtrans.is-production:false}")
    private boolean isProduction;

    //generate Snap Token
    @Bean
    public MidtransSnapApi midtransSnapApi() {
        Config config = Config.builder()
                .setServerKey(serverKey)
                .setClientKey(clientKey)
                .setIsProduction(isProduction)
                .build();
        return new ConfigFactory(config).getSnapApi();
    }

    //midtrans
    @Bean
    public MidtransCoreApi midtransCoreApi() {
        Config config = Config.builder()
                .setServerKey(serverKey)
                .setClientKey(clientKey)
                .setIsProduction(isProduction)
                .build();
        return new ConfigFactory(config).getCoreApi();
    }
}