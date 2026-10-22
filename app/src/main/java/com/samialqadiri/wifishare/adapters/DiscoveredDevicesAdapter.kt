package com.samialqadiri.wifishare.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.samialqadiri.wifishare.databinding.ItemDeviceBinding
import com.samialqadiri.wifishare.models.DiscoveredDevice

class DiscoveredDevicesAdapter(
    private val devices: List<DiscoveredDevice>,
    private val onDeviceClick: (DiscoveredDevice) -> Unit
) : RecyclerView.Adapter<DiscoveredDevicesAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemDeviceBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemDeviceBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val device = devices[position]
        holder.binding.tvDeviceName.text = device.deviceName
        holder.binding.tvDeviceIp.text = device.ipAddress
        holder.binding.tvSignal.text = "${device.signalStrength}%"
        holder.binding.root.setOnClickListener { onDeviceClick(device) }
    }

    override fun getItemCount(): Int = devices.size
}
