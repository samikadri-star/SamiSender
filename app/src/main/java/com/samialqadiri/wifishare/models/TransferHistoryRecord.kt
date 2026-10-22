package com.samialqadiri.wifishare.models

data class TransferHistoryRecord(
    val id: String,
    val name: String,
    val isFolder: Boolean,
    val itemsCount: Int,
    val size: Long,
    val direction: String, // send or receive
    val peerName: String,
    val timestamp: Long,
    val speedFormatted: String,
    val sha256: String
)
