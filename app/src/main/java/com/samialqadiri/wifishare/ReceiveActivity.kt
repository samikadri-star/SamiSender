package com.samialqadiri.wifishare

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.samialqadiri.wifishare.adapters.DiscoveredDevicesAdapter
import com.samialqadiri.wifishare.databinding.ActivityReceiveBinding
import com.samialqadiri.wifishare.models.DiscoveredDevice
import com.samialqadiri.wifishare.network.WifiDirectManager

/**
 * شاشة استقبال الملفات والبحث التلقائي
 * تطوير: سامي القادري 777484160
 */
class ReceiveActivity : AppCompatActivity() {

    private lateinit var binding: ActivityReceiveBinding
    private val wifiDirectManager = WifiDirectManager()
    private val discoveredDevices = mutableListOf<DiscoveredDevice>()
    private lateinit var devicesAdapter: DiscoveredDevicesAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityReceiveBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupRadarAnimation()
        setupRecyclerView()
        startAutomaticDiscovery()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener { finish() }
    }

    private fun setupRadarAnimation() {
        binding.radarView.startScanningAnimation()
        binding.tvScanningStatus.text = "جاري البحث التلقائي عن أجهزة قريبة عبر الواي فاي..."
    }

    private fun setupRecyclerView() {
        devicesAdapter = DiscoveredDevicesAdapter(discoveredDevices) { device ->
            connectToSenderDevice(device)
        }
        binding.rvNearbyDevices.layoutManager = LinearLayoutManager(this)
        binding.rvNearbyDevices.adapter = devicesAdapter
    }

    private fun startAutomaticDiscovery() {
        wifiDirectManager.discoverPeers(this, object : WifiDirectManager.PeerDiscoveryCallback {
            override fun onPeersFound(peers: List<DiscoveredDevice>) {
                discoveredDevices.clear()
                discoveredDevices.addAll(peers)
                devicesAdapter.notifyDataSetChanged()
                binding.tvScanningStatus.text = "تم العثور على ${peers.size} جهاز جاهز للإرسال"
            }

            override fun onError(reason: String) {
                Toast.makeText(this@ReceiveActivity, "حالة الرادار: $reason", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun connectToSenderDevice(device: DiscoveredDevice) {
        Toast.makeText(this, "جاري استقبال البيانات من: ${device.deviceName}", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.radarView.stopScanningAnimation()
        wifiDirectManager.stopDiscovery()
    }
}
