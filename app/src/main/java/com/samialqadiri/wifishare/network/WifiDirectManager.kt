package com.samialqadiri.wifishare.network

import android.content.Context
import com.samialqadiri.wifishare.models.DiscoveredDevice

class WifiDirectManager {

    interface PeerDiscoveryCallback {
        fun onPeersFound(peers: List<DiscoveredDevice>)
        fun onError(reason: String)
    }

    fun discoverPeers(context: Context, callback: PeerDiscoveryCallback) {
        // محاكاة اكتشاف الأجهزة عبر Wi-Fi Direct P2P Manager
        val samplePeers = listOf(
            DiscoveredDevice("02:00:00:00:00:01", "لابتوب سامي القادري (Windows 11)", "192.168.1.105", 98, true),
            DiscoveredDevice("02:00:00:00:00:02", "سامسونج جالاكسي تاب S9", "192.168.1.118", 92, true),
            DiscoveredDevice("02:00:00:00:00:03", "شاومي 14 برو (صنعاء)", "192.168.1.144", 82, false)
        )
        callback.onPeersFound(samplePeers)
    }

    fun stopDiscovery() {
        // إيقاف المسح عند إغلاق الشاشة
    }
}
