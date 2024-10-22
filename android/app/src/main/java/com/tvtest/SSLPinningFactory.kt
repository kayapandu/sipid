package com.sipid

import com.facebook.react.modules.network.OkHttpClientFactory
import com.facebook.react.modules.network.OkHttpClientProvider
import okhttp3.CertificatePinner
import okhttp3.OkHttpClient

class SSLPinningFactory : OkHttpClientFactory {
    companion object {
        private const val hostname = "jsonplaceholder.typicode.com"
        private val sha256Keys = listOf(
            "sha256/IcwtGuxd2fA2t1B0ylJrjvtQm4g4vz5aVshokMHp2Qc=",
            "sha256/IcwtGuxd2fA2t1B0ylJrjvtQm4g4vz5aVshokMHp2Qc=",
            "sha256/IcwtGuxd2fA2t1B0ylJrjvtQm4g4vz5aVshokMHp2Qc="
        )
    }
    override fun createNewNetworkModuleClient(): OkHttpClient {
        val certificatePinnerBuilder = CertificatePinner.Builder()
        for (key in sha256Keys) {
            certificatePinnerBuilder.add(hostname, key)
        }
        val certificatePinner = certificatePinnerBuilder.build()
        val clientBuilder = OkHttpClientProvider.createClientBuilder()
        return clientBuilder.certificatePinner(certificatePinner).build()
    }
}