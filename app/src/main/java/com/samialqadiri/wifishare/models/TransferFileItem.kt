package com.samialqadiri.wifishare.models

import android.net.Uri

data class TransferFileItem(
    val uri: Uri,
    val name: String,
    val size: Long,
    val relativePath: String = name,
    var progress: Int = 0,
    var sha256: String = ""
)
