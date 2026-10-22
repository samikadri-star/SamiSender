package com.samialqadiri.wifishare.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.samialqadiri.wifishare.databinding.ItemHistoryBinding
import com.samialqadiri.wifishare.models.TransferHistoryRecord
import com.samialqadiri.wifishare.utils.ChecksumVerifier

class HistoryAdapter(
    private val records: List<TransferHistoryRecord>
) : RecyclerView.Adapter<HistoryAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemHistoryBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemHistoryBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val r = records[position]
        holder.binding.tvHistoryName.text = r.name
        holder.binding.tvHistoryDetails.text = "${ChecksumVerifier.formatBytes(r.size)} • ${r.speedFormatted}"
        holder.binding.tvHistorySha.text = "SHA: ${r.sha256.take(12)}..."
    }

    override fun getItemCount(): Int = records.size
}
