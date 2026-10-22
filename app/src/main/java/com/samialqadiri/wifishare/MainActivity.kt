package com.samialqadiri.wifishare

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.samialqadiri.wifishare.databinding.ActivityMainBinding

/**
 * تطبيق واي فاي شير برو لنقل الملفات والمجلدات بسرعة فائقة
 * تطوير: سامي القادري 777484160
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.entries.all { it.value }
        if (!allGranted) {
            Toast.makeText(this, "يرجى منح أذونات الواي فاي والموقع للبحث التلقائي عن الأجهزة", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.topAppBar)
        requestRequiredPermissions()

        setupClickListeners()
        setupDeveloperSignature()
    }

    private fun setupClickListeners() {
        // شاشة إرسال الملفات والمجلدات
        binding.cardSend.setOnClickListener {
            startActivity(Intent(this, SendActivity::class.java))
        }

        // شاشة استقبال الملفات مع الرادار التلقائي
        binding.cardReceive.setOnClickListener {
            startActivity(Intent(this, ReceiveActivity::class.java))
        }

        // سجل عمليات النقل
        binding.cardHistory.setOnClickListener {
            startActivity(Intent(this, HistoryActivity::class.java))
        }

        // الإعدادات وتخصيص مسار الحفظ واسم المستخدم
        binding.cardSettings.setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
    }

    private fun setupDeveloperSignature() {
        binding.tvDeveloper.text = "تطوير: سامي القادري 777484160"
        binding.tvDeveloper.setOnClickListener {
            showAboutDialog()
        }
    }

    private fun showAboutDialog() {
        MaterialAlertDialogBuilder(this)
            .setTitle("حول تطبيق واي فاي شير برو")
            .setMessage("تطبيق نقل ملفات ومجلدات فائقة السرعة عبر شبكة الواي فاي بدون استهلاك الإنترنت.\n\nالميزات:\n• فحص سلامة SHA-256\n• إرسال مجلدات كاملة بضغطة زر\n• تغيير اسم المستخدم\n• دعم الوضع الليلي\n• عداد سرعة لحظي (MB/s)\n\nتطوير: سامي القادري 777484160")
            .setPositiveButton("حسناً", null)
            .show()
    }

    private fun requestRequiredPermissions() {
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.NEARBY_WIFI_DEVICES)
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.Q) {
            permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
            permissions.add(Manifest.permission.READ_EXTERNAL_STORAGE)
        }
        permissionLauncher.launch(permissions.toTypedArray())
    }
}
