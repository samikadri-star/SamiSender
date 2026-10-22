package com.samialqadiri.wifishare.network

import android.app.Service
import android.content.Intent
import android.os.IBinder

class HighSpeedTransferService : Service() {

    companion object {
        const val ACTION_SEND = "com.samialqadiri.wifishare.ACTION_SEND"
        const val ACTION_RECEIVE = "com.samialqadiri.wifishare.ACTION_RECEIVE"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // إدارة تدفق البيانات السريعة عبر NIO Sockets
        return START_NOT_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
