package com.samialqadiri.wifishare.models

data class DiscoveredDevice(
    val deviceAddress: String,
    val deviceName: String,
    val ipAddress: String = "192.168.1.100",
    val signalStrength: Int = 90,
    val isWifi6: Boolean = true
)
