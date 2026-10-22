package com.samialqadiri.wifishare.ui

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View
import android.view.animation.LinearInterpolator

class RadarScanView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val circlePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 3f
        color = Color.parseColor("#34D399")
        alpha = 90
    }

    private val sweepPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.FILL
    }

    private var sweepAngle = 0f
    private var animator: ValueAnimator? = null

    fun startScanningAnimation() {
        animator?.cancel()
        animator = ValueAnimator.ofFloat(0f, 360f).apply {
            duration = 3000
            repeatCount = ValueAnimator.INFINITE
            interpolator = LinearInterpolator()
            addUpdateListener {
                sweepAngle = it.animatedValue as Float
                invalidate()
            }
            start()
        }
    }

    fun stopScanningAnimation() {
        animator?.cancel()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val cx = width / 2f
        val cy = height / 2f
        val maxRadius = Math.min(cx, cy) * 0.9f

        // رسم الحلقات المركزية
        canvas.drawCircle(cx, cy, maxRadius * 0.3f, circlePaint)
        canvas.drawCircle(cx, cy, maxRadius * 0.6f, circlePaint)
        canvas.drawCircle(cx, cy, maxRadius, circlePaint)

        // رسم ماسح الرادار المخروطي
        val sweepGradient = SweepGradient(
            cx, cy,
            intArrayOf(Color.TRANSPARENT, Color.parseColor("#3010B981")),
            floatArrayOf(0f, 1f)
        )
        val matrix = Matrix()
        matrix.postRotate(sweepAngle, cx, cy)
        sweepGradient.setLocalMatrix(matrix)
        sweepPaint.shader = sweepGradient

        canvas.drawCircle(cx, cy, maxRadius, sweepPaint)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        stopScanningAnimation()
    }
}
