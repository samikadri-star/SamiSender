package com.samialqadiri.wifishare.network

import com.samialqadiri.wifishare.utils.ChecksumVerifier
import java.io.*
import java.net.ServerSocket
import java.net.Socket
import java.security.MessageDigest
import kotlinx.coroutines.*

/**
 * سيرفر نقل البيانات فائق السرعة عبر الواي فاي
 * تطوير: سامي القادري 777484160
 */
class HighSpeedTransferServer(
    private val port: Int = 8888,
    private val saveDirectory: File,
    private val listener: TransferProgressListener
) {
    private var serverSocket: ServerSocket? = null
    private var isRunning = false

    interface TransferProgressListener {
        fun onProgress(bytesRead: Long, totalBytes: Long, speedBytesPerSec: Long, currentFile: String)
        fun onFileCompleted(fileName: String, sha256Matched: Boolean)
        fun onAllCompleted()
        fun onError(error: String)
    }

    fun startListening() = CoroutineScope(Dispatchers.IO).launch {
        try {
            serverSocket = ServerSocket(port)
            serverSocket?.receiveBufferSize = 4 * 1024 * 1024 // 4 MB Socket Buffer
            isRunning = true

            while (isRunning) {
                val clientSocket = serverSocket?.accept() ?: break
                clientSocket.tcpNoDelay = true
                clientSocket.receiveBufferSize = 4 * 1024 * 1024
                handleClientConnection(clientSocket)
            }
        } catch (e: Exception) {
            listener.onError(e.message ?: "خطأ في اتصال السيرفر")
        }
    }

    private fun handleClientConnection(socket: Socket) {
        val inputStream = DataInputStream(BufferedInputStream(socket.getInputStream(), 1024 * 1024))
        val outputStream = DataOutputStream(BufferedOutputStream(socket.getOutputStream()))

        try {
            val filesCount = inputStream.readInt()
            val totalBytes = inputStream.readLong()

            var totalBytesReceived = 0L
            var lastTime = System.currentTimeMillis()
            var bytesSinceLastTime = 0L

            val digest = MessageDigest.getInstance("SHA-256")

            for (i in 0 until filesCount) {
                val relativePath = inputStream.readUTF()
                val fileSize = inputStream.readLong()
                val senderSha256 = inputStream.readUTF()

                val targetFile = File(saveDirectory, relativePath)
                targetFile.parentFile?.mkdirs()

                val fileOut = FileOutputStream(targetFile)
                val buffer = ByteArray(1024 * 512) // 512 KB Chunk
                var bytesRemaining = fileSize

                digest.reset()

                while (bytesRemaining > 0) {
                    val read = inputStream.read(buffer, 0, Math.min(buffer.size.toLong(), bytesRemaining).toInt())
                    if (read == -1) break
                    fileOut.write(buffer, 0, read)
                    digest.update(buffer, 0, read)

                    bytesRemaining -= read
                    totalBytesReceived += read
                    bytesSinceLastTime += read

                    val currentTime = System.currentTimeMillis()
                    val delta = currentTime - lastTime
                    if (delta >= 250) {
                        val currentSpeed = (bytesSinceLastTime * 1000) / delta
                        listener.onProgress(totalBytesReceived, totalBytes, currentSpeed, targetFile.name)
                        lastTime = currentTime
                        bytesSinceLastTime = 0
                    }
                }
                fileOut.flush()
                fileOut.close()

                val receiverHash = ChecksumVerifier.bytesToHex(digest.digest())
                val matched = receiverHash.equals(senderSha256, ignoreCase = true)
                listener.onFileCompleted(targetFile.name, matched)
            }

            outputStream.writeBoolean(true)
            outputStream.flush()
            listener.onAllCompleted()
        } catch (e: Exception) {
            listener.onError(e.localizedMessage ?: "فشل في استقبال الملف")
        } finally {
            socket.close()
        }
    }

    fun stop() {
        isRunning = false
        serverSocket?.close()
    }
}
