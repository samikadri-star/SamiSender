package com.samialqadiri.wifishare.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.samialqadiri.wifishare.databinding.ItemSelectedFileBinding
import com.samialqadiri.wifishare.models.TransferFileItem
import com.samialqadiri.wifishare.utils.ChecksumVerifier

class SelectedFilesAdapter(
    private val items: List<TransferFileItem>,
    private val onDeleteClick: (Int) -> Unit
) : RecyclerView.Adapter<SelectedFilesAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemSelectedFileBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemSelectedFileBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.binding.tvFileName.text = item.name
        holder.binding.tvFileSize.text = ChecksumVerifier.formatBytes(item.size)
        holder.binding.btnDelete.setOnClickListener {
            onDeleteClick(holder.adapterPosition)
        }
    }

    override fun getItemCount(): Int = items.size
}
