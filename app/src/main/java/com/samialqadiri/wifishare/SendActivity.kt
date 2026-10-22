package com.samialqadiri.wifishare

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.documentfile.provider.DocumentFile
import androidx.recyclerview.widget.LinearLayoutManager
import com.samialqadiri.wifishare.adapters.SelectedFilesAdapter
import com.samialqadiri.wifishare.databinding.ActivitySendBinding
import com.samialqadiri.wifishare.models.TransferFileItem
import com.samialqadiri.wifishare.network.HighSpeedTransferService
import com.samialqadiri.wifishare.utils.ChecksumVerifier
import kotlinx.coroutines.*

/**
 * شاشة إرسال الملفات والمجلدات
 * تطوير: سامي القادري 777484160
 */
class SendActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySendBinding
    private val selectedItems = mutableListOf<TransferFileItem>()
    private lateinit var fileAdapter: SelectedFilesAdapter
    private val scope = CoroutineScope(Dispatchers.Main + Job())

    // اختيار ملفات متعددة
    private val pickFilesLauncher = registerForActivityResult(
        ActivityResultContracts.OpenMultipleDocuments()
    ) { uris: List<Uri> ->
        if (uris.isNotEmpty()) {
            processSelectedUris(uris)
        }
    }

    // اختيار مجلد بالكامل مع شجرته الفرعية بضغطة زر واحدة
    private val pickFolderLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocumentTree()
    ) { treeUri: Uri? ->
        treeUri?.let { uri ->
            processFolderUri(uri)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySendBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupRecyclerView()
        setupActions()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener { finish() }
    }

    private fun setupRecyclerView() {
        fileAdapter = SelectedFilesAdapter(selectedItems) { position ->
            if (position in 0 until selectedItems.size) {
                selectedItems.removeAt(position)
                fileAdapter.notifyItemRemoved(position)
                updateTotalSummary()
            }
        }
        binding.rvSelectedFiles.layoutManager = LinearLayoutManager(this)
        binding.rvSelectedFiles.adapter = fileAdapter
    }

    private fun setupActions() {
        binding.btnPickFiles.setOnClickListener {
            pickFilesLauncher.launch(arrayOf("*/*"))
        }

        binding.btnPickFolder.setOnClickListener {
            pickFolderLauncher.launch(null)
        }

        binding.btnStartTransfer.setOnClickListener {
            if (selectedItems.isEmpty()) {
                Toast.makeText(this, "يرجى اختيار ملفات أو مجلد أولاً", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            startHighSpeedTransfer()
        }
    }

    private fun processSelectedUris(uris: List<Uri>) {
        for (uri in uris) {
            val doc = DocumentFile.fromSingleUri(this, uri) ?: continue
            selectedItems.add(
                TransferFileItem(
                    uri = uri,
                    name = doc.name ?: "file",
                    size = doc.length(),
                    relativePath = doc.name ?: "file"
                )
            )
        }
        fileAdapter.notifyDataSetChanged()
        updateTotalSummary()
    }

    private fun processFolderUri(uri: Uri) {
        val rootDir = DocumentFile.fromTreeUri(this, uri) ?: return
        val folderName = rootDir.name ?: "مجلد"
        Toast.makeText(this, "جاري فحص المجلد: $folderName", Toast.LENGTH_SHORT).show()

        scope.launch(Dispatchers.IO) {
            val folderFiles = mutableListOf<TransferFileItem>()
            traverseFolder(rootDir, "", folderFiles)
            withContext(Dispatchers.Main) {
                selectedItems.addAll(folderFiles)
                fileAdapter.notifyDataSetChanged()
                updateTotalSummary()
                Toast.makeText(this@SendActivity, "تم إضافة مجلد: $folderName (${folderFiles.size} ملف)", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun traverseFolder(dir: DocumentFile, relativePath: String, output: MutableList<TransferFileItem>) {
        val files = dir.listFiles()
        for (f in files) {
            if (f.isDirectory) {
                traverseFolder(f, "$relativePath${f.name}/", output)
            } else {
                output.add(
                    TransferFileItem(
                        uri = f.uri,
                        name = f.name ?: "file",
                        size = f.length(),
                        relativePath = "$relativePath${f.name}"
                    )
                )
            }
        }
    }

    private fun startHighSpeedTransfer() {
        binding.layoutTransferProgress.visibility = View.VISIBLE
        binding.btnStartTransfer.isEnabled = false

        val serviceIntent = Intent(this, HighSpeedTransferService::class.java).apply {
            action = HighSpeedTransferService.ACTION_SEND
        }
        startService(serviceIntent)
    }

    private fun updateTotalSummary() {
        val totalBytes = selectedItems.sumOf { it.size }
        binding.tvTotalCount.text = "${selectedItems.size} عنصر مختار"
        binding.tvTotalSize.text = ChecksumVerifier.formatBytes(totalBytes)
        binding.btnStartTransfer.isEnabled = selectedItems.isNotEmpty()
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
}
