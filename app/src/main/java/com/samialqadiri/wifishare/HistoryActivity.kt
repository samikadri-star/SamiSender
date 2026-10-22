package com.samialqadiri.wifishare

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.samialqadiri.wifishare.adapters.HistoryAdapter
import com.samialqadiri.wifishare.databinding.ActivityHistoryBinding
import com.samialqadiri.wifishare.models.TransferHistoryRecord

/**
 * شاشة سجل العمليات السابقة
 * تطوير: سامي القادري 777484160
 */
class HistoryActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHistoryBinding
    private val historyRecords = mutableListOf<TransferHistoryRecord>()
    private lateinit var adapter: HistoryAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHistoryBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbar.setNavigationOnClickListener { finish() }

        loadSampleHistory()
        adapter = HistoryAdapter(historyRecords)
        binding.rvHistory.layoutManager = LinearLayoutManager(this)
        binding.rvHistory.adapter = adapter
    }

    private fun loadSampleHistory() {
        historyRecords.add(
            TransferHistoryRecord(
                id = "1",
                name = "مشروع_تطبيق_كوتلن_النهائي",
                isFolder = true,
                itemsCount = 48,
                size = 324 * 1024 * 1024L,
                direction = "send",
                peerName = "لابتوب ديل XPS 15",
                timestamp = System.currentTimeMillis() - 3600000,
                speedFormatted = "47.6 MB/s",
                sha256 = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
            )
        )
    }
}
