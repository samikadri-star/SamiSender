package com.samialqadiri.wifishare

import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.samialqadiri.wifishare.databinding.ActivitySettingsBinding

/**
 * شاشة الإعدادات وتخصيص مسار الحفظ واسم المستخدم
 * تطوير: سامي القادري 777484160
 */
class SettingsActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySettingsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbar.setNavigationOnClickListener { finish() }

        val prefs = getSharedPreferences("wifi_share_prefs", Context.MODE_PRIVATE)
        binding.etUserName.setText(prefs.getString("user_name", "سامي القادري"))
        binding.etSavePath.setText(prefs.getString("save_path", "/storage/emulated/0/Download/WiFiShare_Sami/"))

        binding.btnSaveSettings.setOnClickListener {
            val userName = binding.etUserName.text.toString().trim()
            val savePath = binding.etSavePath.text.toString().trim()

            prefs.edit()
                .putString("user_name", userName)
                .putString("save_path", savePath)
                .apply()

            Toast.makeText(this, "تم حفظ الإعدادات واسم المستخدم بنجاح", Toast.LENGTH_SHORT).show()
            finish()
        }
    }
}
